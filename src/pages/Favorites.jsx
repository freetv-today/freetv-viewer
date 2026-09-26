import { useState } from 'preact/hooks';
import { ShowTitleList } from '../components/ShowTitleList';
import { getFavoriteShows } from '../data/userLists';

export function Favorites() {
	const [shows, setShows] = useState(getFavoriteShows);

	return (
		<section className="category-view">
			<aside className="category-view__sidebar" aria-label="Favorite shows">
				<ShowTitleList shows={shows} onFavoritesChange={setShows} />
				{shows.length === 0 && <p className="text-secondary">You haven't added any favorites yet.</p>}
			</aside>
			<div className="category-view__content">
				<h1 className="text-center text-secondary fw-bold mt-4">Favorites</h1>
				<p className="text-center">Your saved show titles.</p>
				<div className="text-center">
					<img src="/freetv.png" width="250" alt="FreeTV Logo" title="FreeTV" className="category-view__logo" />
				</div>
			</div>
		</section>
	);
}
