import { useLocation } from 'preact-iso';
import { useState } from 'preact/hooks';
import { useAppContext } from '../state/AppProvider';
import { capitalizeFirstLetter } from './CategoryLabel';
import { isFavoriteShow, toggleFavoriteShow } from '../data/userLists';

export function ShowTitleButton({ show, title = show?.title || 'Show Title', onFavoritesChange, onShowInfo }) {
	const { queueVideo, currentPlaylist } = useAppContext();
	const { route } = useLocation();
	const [isFavorite, setIsFavorite] = useState(() => isFavoriteShow(show));

	function handleWatch() {
		if (queueVideo(show)) route('/nowplaying');
	}

	function handleToggleFavorite() {
		const result = toggleFavoriteShow(show);
		setIsFavorite(result.isFavorite);
		onFavoritesChange?.(result.shows);
		if (result.isFavorite) {
			setTimeout(() => window.alert('Show has been added to your Favorites'), 500);
		}
	}

	function handleShowInfo() {
		onShowInfo?.(show);
	}

	async function handleReportProblem() {
		const category = show?.category || '';
		const confirmation = [
			`Report a problem with “${title}”?`,
			'',
			`Category: ${capitalizeFirstLetter(category) || 'Unknown'}`,
		].join('\n');
		if (!window.confirm(confirmation)) return;

		try {
			const response = await fetch('/api/report-problem.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					title,
					category,
					identifier: show?.identifier || '',
					desc: show?.desc || '',
					start: show?.start || '',
					end: show?.end || '',
					imdb: show?.imdb || '',
					playlist: currentPlaylist?.filename || '',
				}),
			});
			const responseText = await response.text();
			let result = {};
			try { result = JSON.parse(responseText); } catch { /* Non-JSON response. */ }

			if (response.ok) {
				window.alert('Thank you! Your problem report has been received.');
			} else {
				console.error('[FreeTV] Problem report request failed', {
					status: response.status,
					statusText: response.statusText,
					response: responseText.slice(0, 1000),
					playlist: currentPlaylist?.filename || '',
					identifier: show?.identifier || '',
				});
				window.alert(result.message || 'There was a problem submitting your report. Please try again later.');
			}
		} catch (error) {
			console.error('[FreeTV] Problem report request could not reach the server', error);
			window.alert('There was a problem submitting your report. Please try again later.');
		}
	}

	return (
		<div className="btn-group dropend show-title-button">
			<button
				type="button"
				className="btn btn-sm btn-outline-dark show-title-button__title"
				title={title}
				aria-label={`Watch ${title}`}
				onClick={handleWatch}
			>
				{title}
			</button>
			<button
				type="button"
				className="btn btn-sm btn-outline-dark dropdown-toggle dropdown-toggle-split show-title-button__menu"
				data-bs-toggle="dropdown"
				aria-expanded="false"
				aria-label={`Actions for ${title}`}
			>
				<span className="visually-hidden">Toggle Menu</span>
			</button>
			<ul className="dropdown-menu">
				<li><button className="dropdown-item" type="button" onClick={handleShowInfo}>About this show</button></li>
				<li><button className="dropdown-item" type="button" onClick={handleToggleFavorite}>
					{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
				</button></li>
				<li><button className="dropdown-item link-danger" type="button" onClick={handleReportProblem}>Report a problem</button></li>
				<li><a
					className="dropdown-item"
					href={`https://archive.org/download/${encodeURIComponent(show?.identifier || '')}`}
					target="_blank"
					rel="noopener noreferrer"
					title={`Download files for ${title}`}
				>Download files</a></li>
			</ul>
		</div>
	);
}
