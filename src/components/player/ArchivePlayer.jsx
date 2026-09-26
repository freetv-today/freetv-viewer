import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { fetchArchivePlaylist } from '../../data/archiveMedia';
import { EpisodeList } from './EpisodeList';
import { PlayerControls } from './PlayerControls';
import './player.css';

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
	const [muted, setMuted] = useState(false);
	const [volume, setVolume] = useState(0.9);
	const [rate, setRate] = useState(1);
	const [time, setTime] = useState({ current: 0, duration: 0 });
	const videoRef = useRef(null);
	const stageRef = useRef(null);
	const episode = playlist?.episodes[episodeIndex];
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
	}, []);

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
				<button type="button" className="ftv-back" onClick={onBack}>‹ <span>Back to shows</span></button>
				<strong title={video.title}>{video.title}</strong>
				<span className="ftv-identifier">Internet Archive: {video.identifier}</span>
			</div>

			{loading && <div className="ftv-message" role="status">Loading video information from Internet Archive…</div>}
			{error && <div className="ftv-message ftv-error" role="alert">{error}</div>}

			{playlist && (
				<div className="ftv-layout">
					<div className="ftv-main">
						<div className="ftv-stage" ref={stageRef} onClick={togglePlay}>
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
							<div className="ftv-title-overlay" aria-live="polite">
								<strong>{episode?.title || video.title}</strong>
								<span>{video.title} · Video {episodeIndex + 1} of {playlist.episodes.length}</span>
							</div>
							{mediaLoading && <div className="ftv-media-status" role="status">Loading video…</div>}
							{mediaError && <div className="ftv-media-error" role="alert">{mediaError}</div>}
							{!playing && !mediaLoading && !mediaError && (
								<button type="button" className="ftv-bigplay" onClick={(event) => { event.stopPropagation(); togglePlay(); }} aria-label="Play">▶</button>
							)}
							<PlayerControls
								playing={playing} muted={muted} volume={volume} rate={rate} time={time}
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
