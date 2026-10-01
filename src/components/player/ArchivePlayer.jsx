import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { fetchArchivePlaylist } from '../../data/archiveMedia';
import { isFavoriteShow, toggleFavoriteShow } from '../../data/userLists';
import { EpisodeList } from './EpisodeList';
import { PlayerControls } from './PlayerControls';
import './player.css';
import { appPath } from '../../data/paths';

function releaseMedia(player) {
	player.pause();
	player.removeAttribute('src');
	player.querySelectorAll('source').forEach((source) => source.removeAttribute('src'));
	player.load();
}

export function ArchivePlayer({ video, onBack }) {
	const [playlist, setPlaylist] = useState(null);
	const [episodeIndex, setEpisodeIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [mediaLoading, setMediaLoading] = useState(true);
	const [error, setError] = useState('');
	const [mediaError, setMediaError] = useState('');
	const [playing, setPlaying] = useState(false);
	const [controlsVisible, setControlsVisible] = useState(true);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isFavorite, setIsFavorite] = useState(() => isFavoriteShow(video));
	const [muted, setMuted] = useState(false);
	const [volume, setVolume] = useState(0.9);
	const [rate, setRate] = useState(1);
	const [time, setTime] = useState({ current: 0, duration: 0 });
	const videoRef = useRef(null);
	const stageRef = useRef(null);
	const episode = playlist?.episodes[episodeIndex];
	const controlsTimerRef = useRef(null);
	const lastStageTapRef = useRef(0);

	function handleStageTouch(event) {
		showControls();
		if (event.target.closest?.('.ftv-controls')) return;
		const now = Date.now();
		if (now - lastStageTapRef.current < 350) {
			lastStageTapRef.current = 0;
			toggleFullscreen();
		} else lastStageTapRef.current = now;
	}

	const showControls = useCallback(() => {
		setControlsVisible(true);
		clearTimeout(controlsTimerRef.current);
		if (playing) {
			controlsTimerRef.current = setTimeout(() => {
				const focusedElement = document.activeElement;
				const keyboardFocused = stageRef.current?.contains(focusedElement) && focusedElement.matches(':focus-visible');
				if (!keyboardFocused) setControlsVisible(false);
			}, 3000);
		}
	}, [playing]);
	const setVideoElement = useCallback((element) => {
		if (!element && videoRef.current) releaseMedia(videoRef.current);
		videoRef.current = element;
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		setPlaylist(null);
		setEpisodeIndex(0);
		setLoading(true);
		setError('');

		fetchArchivePlaylist(video.identifier, { signal: controller.signal })
			.then(setPlaylist)
			.catch((fetchError) => {
				if (!controller.signal.aborted) setError(fetchError.message || 'Could not load this Internet Archive item.');
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false);
			});

		return () => controller.abort();
	}, [video.identifier]);

	useEffect(() => {
		setTime({ current: 0, duration: 0 });
		setMediaError('');
		setMediaLoading(Boolean(episode));
	}, [episode?.url]);

	useEffect(() => () => {
		if (videoRef.current) releaseMedia(videoRef.current);
		clearTimeout(controlsTimerRef.current);
	}, []);

	useEffect(() => {
		if (playing) showControls();
		else {
			clearTimeout(controlsTimerRef.current);
			setControlsVisible(true);
		}
		return () => clearTimeout(controlsTimerRef.current);
	}, [playing, showControls]);

	useEffect(() => {
		function handleFullscreenChange() {
			setIsFullscreen(Boolean(stageRef.current && document.fullscreenElement === stageRef.current));
		}

		document.addEventListener('fullscreenchange', handleFullscreenChange);
		handleFullscreenChange();
		return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
	}, []);

	useEffect(() => {
		function handlePlayerKeyDown(event) {
			if (event.code !== 'Space' || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
			const target = event.target;
			if (target instanceof HTMLElement && (target.isContentEditable || target.matches('input, select, textarea, button, [role="slider"]'))) return;
			event.preventDefault();
			showControls();
			togglePlay();
		}

		document.addEventListener('keydown', handlePlayerKeyDown);
		return () => document.removeEventListener('keydown', handlePlayerKeyDown);
	}, [showControls]);

	function togglePlay() {
		const player = videoRef.current;
		if (!player || mediaError) return;
		if (player.paused) player.play().catch(() => setPlaying(false));
		else player.pause();
	}

	function selectEpisode(index) {
		setEpisodeIndex(index);
		setPlaying(false);
	}

	function handleToggleFavorite() {
		const result = toggleFavoriteShow(video);
		setIsFavorite(result.isFavorite);
		if (result.isFavorite) {
			setTimeout(() => window.alert(`${video.title} has been added to your Favorites`), 500);
		}
	}

	function changeVolume(nextVolume) {
		setVolume(nextVolume);
		setMuted(false);
		if (videoRef.current) {
			videoRef.current.volume = nextVolume;
			videoRef.current.muted = false;
		}
	}

	function toggleMute() {
		const nextMuted = !muted;
		setMuted(nextMuted);
		if (videoRef.current) videoRef.current.muted = nextMuted;
	}

	function changeRate(nextRate) {
		setRate(nextRate);
		if (videoRef.current) videoRef.current.playbackRate = nextRate;
	}

	async function toggleFullscreen() {
		const stage = stageRef.current;
		if (!stage) return;
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
			else await stage.requestFullscreen?.();
		} catch {
			// Fullscreen may be unavailable or denied by the browser.
		}
	}

	function handleLoadedMetadata(event) {
		const player = event.currentTarget;
		setTime((previous) => ({ ...previous, duration: Number.isFinite(player.duration) ? player.duration : 0 }));
		player.volume = volume;
		player.muted = muted;
		player.playbackRate = rate;
		setMediaLoading(false);
		player.play().catch(() => setPlaying(false));
	}

	function handleTimeUpdate(event) {
		const player = event.currentTarget;
		setTime({ current: player.currentTime, duration: Number.isFinite(player.duration) ? player.duration : 0 });
	}

	function handleEnded() {
		if (playlist && episodeIndex < playlist.episodes.length - 1) selectEpisode(episodeIndex + 1);
		else setPlaying(false);
	}

	return (
		<section className="ftv-player" aria-label={`Now playing ${video.title}`}>
			<div className="ftv-player-topbar">
				<button type="button" className="ftv-back" onClick={onBack} title="FreeTV">
					<img src={appPath('freetv-small.png')} height="30" alt="FreeTV" className="d-inline-block me-2 pb-1"/>
					<span className="noselect">FreeTV</span>
				</button>
				<span className="ms-auto">
					<button
						type="button"
						className={`btn btn-outline-danger rounded-circle${isFavorite ? ' active' : ''}`}
						aria-label={isFavorite ? `Remove ${video.title} from Favorites` : `Add ${video.title} to Favorites`}
						aria-pressed={isFavorite}
						title={isFavorite ? `Remove ${video.title} from Favorites` : `Add ${video.title} to Favorites`}
						onClick={handleToggleFavorite}
					>
						<i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`} aria-hidden="true"></i>
					</button>
					<button type="button" className="btn ms-1" onClick={onBack} title="Exit Player" aria-label="Exit Player">
						<i class="bi bi-x-square text-danger fs-3"></i>
					</button>
				</span>
			</div>

			{loading && <div className="ftv-message" role="status">Loading video information from Internet Archive…</div>}
			{error && <div className="ftv-message ftv-error" role="alert">{error}</div>}

			{playlist && (
				<div className="ftv-layout">
					<div className="ftv-main">
						<div className={`ftv-stage${controlsVisible ? '' : ' ftv-controls-hidden'}`} ref={stageRef} onClick={(event) => { if (event.detail === 1) togglePlay(); }} onDblClick={(event) => { if (event.target.closest?.('.ftv-controls')) return; event.preventDefault(); togglePlay(); toggleFullscreen(); }} onPointerMove={showControls} onTouchStart={handleStageTouch} onFocusIn={showControls}>
							<video
								ref={setVideoElement}
								key={episode?.url}
								poster={playlist.thumbnail}
								playsInline
								onLoadedMetadata={handleLoadedMetadata}
								onCanPlay={() => setMediaLoading(false)}
								onWaiting={() => setMediaLoading(true)}
								onTimeUpdate={handleTimeUpdate}
								onPlay={() => setPlaying(true)}
								onPause={() => setPlaying(false)}
								onEnded={handleEnded}
								onError={() => { setMediaLoading(false); setMediaError('This video could not be played. Try another episode.'); }}
							>
								<source src={episode?.url} type={episode?.type} />
							</video>
							<div className={`ftv-title-overlay${controlsVisible ? '' : ' is-hidden'}`} aria-live="polite">
								<strong>{episode?.title || video.title}</strong>
								<span>{video.title} · Video {episodeIndex + 1} of {playlist.episodes.length}</span>
							</div>
							{mediaLoading && <div className="ftv-media-status" role="status">Loading video…</div>}
							{mediaError && <div className="ftv-media-error" role="alert">{mediaError}</div>}
							{!playing && !mediaLoading && !mediaError && (
								<button type="button" className="ftv-bigplay" onClick={(event) => { event.stopPropagation(); togglePlay(); }} aria-label="Play">▶</button>
							)}
							<PlayerControls
								controlsVisible={controlsVisible}
								playing={playing} muted={muted} volume={volume} rate={rate} time={time} isFullscreen={isFullscreen}
								hasPrevious={episodeIndex > 0} hasNext={episodeIndex < playlist.episodes.length - 1}
								onTogglePlay={togglePlay}
								onSeek={(seconds) => { if (videoRef.current) videoRef.current.currentTime = seconds; }}
								onToggleMute={toggleMute} onVolume={changeVolume} onRate={changeRate}
								onFullscreen={toggleFullscreen}
								onPrevious={() => selectEpisode(Math.max(episodeIndex - 1, 0))}
								onNext={() => selectEpisode(Math.min(episodeIndex + 1, playlist.episodes.length - 1))}
							/>
						</div>
					</div>
					<EpisodeList title={video.title} episodes={playlist.episodes} current={episodeIndex} onSelect={selectEpisode} />
				</div>
			)}

			{!loading && !error && !playlist && <div className="ftv-message" role="alert">No playable video was found.</div>}
		</section>
	);
}
