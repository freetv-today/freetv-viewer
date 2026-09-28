import { useRef, useState } from 'preact/hooks';
import { ShowTitleList } from '../components/ShowTitleList';
import { ShowInfo } from '../components/ShowInfo';
import { getRecentShows } from '../data/userLists';
import { appPath } from '../data/paths';

export function History() {
	const [shows] = useState(getRecentShows);
	const [selectedShow, setSelectedShow] = useState(null);
	const infoRef = useRef(null);

	function handleShowInfo(show) {
		setSelectedShow(show);
		if (window.matchMedia('(max-width: 767.98px)').matches) {
			requestAnimationFrame(() => infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
		}
	}

	function handleCloseShowInfo() {
		setSelectedShow(null);
		if (window.matchMedia('(max-width: 767.98px)').matches) {
			requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
		}
	}

	return (
		<section className="category-view">
			<aside className="category-view__sidebar" aria-label="Recently watched shows">
				<ShowTitleList shows={shows} preserveOrder groupShows={false} onShowInfo={handleShowInfo} />
				{shows.length === 0 && <p className="text-secondary">No recent shows yet.</p>}
			</aside>
			<div className="category-view__content" ref={infoRef}>
				{selectedShow ? (
					<ShowInfo show={selectedShow} onClose={handleCloseShowInfo} />
				) : (
					<>
						<h1 className="text-center text-secondary fw-bold mt-4">Recent History</h1>
						<p className="text-center">Your 25 most recently watched shows.</p>
						<div className="text-center">
							<img src={appPath('freetv.png')} width="250" alt="FreeTV Logo" title="FreeTV" className="category-view__logo" />
						</div>
					</>
				)}
			</div>
		</section>
	);
}
