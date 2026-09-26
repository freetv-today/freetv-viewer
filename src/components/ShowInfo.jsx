import { capitalizeFirstLetter } from './CategoryLabel';

function ExternalLink({ href, children, title }) {
	return (
		<a href={href} target="_blank" rel="noopener noreferrer" title={title}>
			{children} <span aria-hidden="true">↗</span>
		</a>
	);
}

export function ShowInfo({ show, onClose }) {
	if (!show) return null;

	const airedYears = show.start && show.end && show.start !== show.end
		? `${show.start}–${show.end}`
		: show.start || show.end || 'Unknown';
	const thumbnail = show.imdb ? `/thumbs/${show.imdb}.jpg` : '/freetv.png';

	return (
		<article className="show-info" aria-labelledby="show-info-title">
			<div className="show-info__header">
				<h2 id="show-info-title" className="h3 mb-0">{show.title}</h2>
				<button type="button" className="btn-close" aria-label="Close show information" onClick={onClose} />
			</div>
			<div className="show-info__body">
				<img
					className="show-info__thumbnail"
					src={thumbnail}
					alt={`${show.title} thumbnail`}
					onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/freetv.png'; }}
				/>
				<div className="show-info__details">
					<p><strong>Category:</strong> {capitalizeFirstLetter(show.category || '') || 'Unknown'}</p>
					<div className="show-info__description">
						<strong>Description:</strong>
						<p>{show.desc || 'No description is available.'}</p>
					</div>
					<p><strong>Originally aired:</strong> {airedYears}</p>
					<ul className="show-info__links">
						{show.imdb && (
							<li><ExternalLink href={`https://www.imdb.com/title/${encodeURIComponent(show.imdb)}/`} title="View this show on IMDb">IMDb page</ExternalLink></li>
						)}
						<li><ExternalLink href={`https://archive.org/details/${encodeURIComponent(show.identifier)}`} title="View this show on the Internet Archive">Internet Archive</ExternalLink></li>
						<li><ExternalLink href={`https://archive.org/download/${encodeURIComponent(show.identifier)}`} title="Download files from the Internet Archive">Download files</ExternalLink></li>
					</ul>
				</div>
			</div>
		</article>
	);
}
