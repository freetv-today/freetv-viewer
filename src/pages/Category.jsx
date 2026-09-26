import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { ShowTitleList } from '../components/ShowTitleList';
import { ShowInfo } from '../components/ShowInfo';
import { capitalizeFirstLetter } from '../components/CategoryLabel';
import { useAppContext } from '../state/AppProvider';
import { CategoryNav } from '../components/CategoryNav';

export function Category({ name }) {
	const { categories, catalog, isInitializing, isCatalogLoading, initializationError, catalogError } = useAppContext();
	const [selectedShow, setSelectedShow] = useState(null);
	const infoRef = useRef(null);
	const error = initializationError || catalogError;
	const isLoading = isInitializing || isCatalogLoading;
	const category = name || '';
	const categoryExists = categories.some((item) => item.toLowerCase() === category.toLowerCase());
	const shows = useMemo(() => {
		if (!category || !Array.isArray(catalog?.shows)) return [];

		return catalog.shows.filter((show) => show.category?.toLowerCase() === category.toLowerCase());
	}, [catalog, category]);

	useEffect(() => setSelectedShow(null), [category]);

	function handleShowInfo(show) {
		setSelectedShow(show);
		if (window.matchMedia('(max-width: 767.98px)').matches) {
			requestAnimationFrame(() => infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
		}
	}

	return (
	<>
		<CategoryNav />
		<section className="category-view">
			<aside className="category-view__sidebar" aria-label={`${capitalizeFirstLetter(category)} shows`}>
				<ShowTitleList shows={shows} onShowInfo={handleShowInfo} />
				{!isLoading && !error && categoryExists && shows.length === 0 && (
					<p className="text-secondary">No shows are available in this category.</p>
				)}
			</aside>
			<div className="category-view__content" ref={infoRef}>
				{selectedShow ? (
					<ShowInfo show={selectedShow} onClose={() => setSelectedShow(null)} />
				) : (
					<>
						<h1 className="text-center text-secondary fw-bold mt-4">
							{category ? capitalizeFirstLetter(category) : 'Category'}
						</h1>
						{error && <p className="alert alert-danger" role="alert">{error}</p>}
						{isLoading && !error && <p className="text-center" role="status">Loading shows…</p>}
						{!isLoading && !error && category && !categoryExists && (
							<p className="alert alert-warning">This category is not available in the selected playlist.</p>
						)}
						<div className="text-center">
							<img src="/freetv.png" width="250" alt="FreeTV Logo" title="FreeTV" className="category-view__logo" />
						</div>
					</>
				)}
			</div>
		</section>
	</>
	);
}
