import { useLocation } from 'preact-iso';
import { useState } from 'preact/hooks';
import { useAppContext } from '../state/AppProvider';
import { isFavoriteShow, toggleFavoriteShow } from '../data/userLists';

export function ShowTitleButton({ show, title = show?.title || 'Show Title', onFavoritesChange }) {
	const { queueVideo } = useAppContext();
	const { route } = useLocation();
	const [isFavorite, setIsFavorite] = useState(() => isFavoriteShow(show));

	function handleWatch() {
		if (queueVideo(show)) route('/nowplaying');
	}

	function handleToggleFavorite() {
		const result = toggleFavoriteShow(show);
		setIsFavorite(result.isFavorite);
		onFavoritesChange?.(result.shows);
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
				<li><button className="dropdown-item" type="button">About this show</button></li>
				<li><button className="dropdown-item" type="button" onClick={handleToggleFavorite}>
					{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
				</button></li>
				<li><button className="dropdown-item link-danger" type="button">Report a problem</button></li>
				<li><button className="dropdown-item" type="button">Download files</button></li>
			</ul>
		</div>
	);
}
