import { formatDuration } from '../../data/archiveMedia';

export function PlayerControls({
	playing, muted, volume, rate, time, hasPrevious, hasNext,
	onTogglePlay, onSeek, onToggleMute, onVolume, onRate, onFullscreen, onPrevious, onNext,
}) {
	const progress = time.duration ? (time.current / time.duration) * 100 : 0;

	return (
		<div className="ftv-controls" onClick={(event) => event.stopPropagation()}>
			<input
				className="ftv-seek"
				type="range"
				min="0"
				max={time.duration || 0}
				step="0.1"
				value={time.current}
				style={{ '--ftv-progress': `${progress}%` }}
				aria-label="Seek"
				disabled={!time.duration}
				onInput={(event) => onSeek(Number(event.currentTarget.value))}
			/>
			<div className="ftv-buttons">
				<button type="button" className="ftv-control" onClick={onTogglePlay} aria-label={playing ? 'Pause' : 'Play'}>
					{playing ? '❚❚' : '▶'}
				</button>
				<button type="button" className="ftv-control" onClick={onPrevious} disabled={!hasPrevious} aria-label="Previous episode">⏮</button>
				<button type="button" className="ftv-control" onClick={onNext} disabled={!hasNext} aria-label="Next episode">⏭</button>
				<span className="ftv-time">{formatDuration(time.current)} / {formatDuration(time.duration)}</span>
				<span className="ftv-controls-spacer" />
				<button type="button" className="ftv-control" onClick={onToggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
					{muted || volume === 0 ? '🔇' : '🔊'}
				</button>
				<input
					className="ftv-volume"
					type="range"
					min="0"
					max="1"
					step="0.01"
					value={muted ? 0 : volume}
					aria-label="Volume"
					onInput={(event) => onVolume(Number(event.currentTarget.value))}
				/>
				<label className="ftv-rate-label">
					<span className="visually-hidden">Playback speed</span>
					<select value={rate} onChange={(event) => onRate(Number(event.currentTarget.value))}>
						{[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
							<option key={speed} value={speed}>{speed}×</option>
						))}
					</select>
				</label>
				<button type="button" className="ftv-control" onClick={onFullscreen} aria-label="Toggle fullscreen">⛶</button>
			</div>
		</div>
	);
}
