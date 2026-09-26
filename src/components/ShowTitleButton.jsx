import { useLocation } from 'preact-iso';
import { useAppContext } from '../state/AppProvider';

export function ShowTitleButton({ show, title = show?.title || 'Show Title' }) {
	const { queueVideo } = useAppContext();
	const { route } = useLocation();

	function handleWatch() {
		if (queueVideo(show)) route('/nowplaying');
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
				<li><button className="dropdown-item" type="button">Add to Favorites</button></li>
				<li><button className="dropdown-item link-danger" type="button">Report a problem</button></li>
				<li><button className="dropdown-item" type="button">Download files</button></li>
			</ul>
		</div>
	);
}
