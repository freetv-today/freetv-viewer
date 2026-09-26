import { useState } from 'preact/hooks';
import { ShowTitleList } from '../components/ShowTitleList';
import { getRecentShows } from '../data/userLists';

export function History() {
	const [shows] = useState(getRecentShows);

	return (
		<section className="category-view">
			<aside className="category-view__sidebar" aria-label="Recently watched shows">
				<ShowTitleList shows={shows} preserveOrder groupShows={false} />
				{shows.length === 0 && <p className="text-secondary">No recent shows yet.</p>}
			</aside>
			<div className="category-view__content">
				<h1 className="text-center text-secondary fw-bold mt-4">Recent History</h1>
				<p className="text-center">Your 25 most recently watched shows.</p>
				<div className="text-center">
					<img src="/freetv.png" width="250" alt="FreeTV Logo" title="FreeTV" className="category-view__logo" />
				</div>
			</div>
		</section>
	);
}
