export function EpisodeList({ title, episodes, current, onSelect }) {
	return (
		<aside className="ftv-sidebar" aria-label="Episodes">
			<div className="ftv-playlist-header">
				<strong title={title}>{title}</strong>
				<span>{episodes.length} {episodes.length === 1 ? 'video' : 'videos'}</span>
			</div>
			<ol className="ftv-playlist">
				{episodes.map((episode, index) => (
					<li key={episode.url}>
						<button
							type="button"
							className={`ftv-episode${index === current ? ' active' : ''}`}
							aria-current={index === current ? 'true' : undefined}
							onClick={() => onSelect(index)}
						>
							<span className="ftv-episode-number">{index + 1}</span>
							<span className="ftv-episode-title">{episode.title}</span>
							{episode.duration && <span className="ftv-episode-duration">{episode.duration}</span>}
						</button>
					</li>
				))}
			</ol>
		</aside>
	);
}
