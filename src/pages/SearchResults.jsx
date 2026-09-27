import { useMemo } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { capitalizeFirstLetter } from '../components/CategoryLabel';
import { searchShows } from '../data/search';
import { useAppContext } from '../state/AppProvider';
import { appPath } from '../data/paths';

const titleCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

function yearRange(show) {
	const start = show.start || show.year || '';
	const end = show.end || '';
	return start && end && end !== start ? `${start}–${end}` : start || end;
}

function compareByYear(a, b) {
	const yearA = Number.parseInt(a.start || a.year, 10);
	const yearB = Number.parseInt(b.start || b.year, 10);
	if (Number.isNaN(yearA) && !Number.isNaN(yearB)) return 1;
	if (!Number.isNaN(yearA) && Number.isNaN(yearB)) return -1;
	return (yearA || 0) - (yearB || 0) || titleCollator.compare(a.title, b.title);
}

export function SearchResults() {
	const { query, route } = useLocation();
	const { catalog, isInitializing, isCatalogLoading, initializationError, catalogError, queueVideo } = useAppContext();
	const searchQuery = query.q || '';
	const error = initializationError || catalogError;
	const isLoading = isInitializing || isCatalogLoading;
	const results = useMemo(() => {
		return searchShows(catalog?.shows, searchQuery).sort(compareByYear);
	}, [catalog, searchQuery]);

	function playShow(show) {
		if (queueVideo(show)) route(appPath('/nowplaying'));
	}

	return (
		<section className="container-fluid my-4">
			{searchQuery && <h1 className="h3 text-center mb-4">Search results for “{searchQuery}”</h1>}
			{error && <p className="alert alert-danger" role="alert">{error}</p>}
			{isLoading && !error && <p className="text-center" role="status">Loading shows…</p>}
			{!isLoading && !error && !searchQuery && (
				<p className="text-center text-secondary">Enter one or more words in the search box above.</p>
			)}
			{!isLoading && !error && searchQuery && results.length === 0 && (
				<p className="text-center text-secondary" role="status">No results found.</p>
			)}
			{!isLoading && !error && searchQuery && results.length > 0 && (
				<>
					<p className="text-muted">Showing {results.length} {results.length === 1 ? 'result' : 'results'}.</p>
					<div className="table-responsive">
						<table className="table table-striped table-hover align-middle">
							<thead>
								<tr>
									<th scope="col">Title</th>
									<th scope="col">Category</th>
									<th scope="col">Years</th>
									<th scope="col">Description</th>
									<th scope="col"><span className="visually-hidden">Play</span></th>
								</tr>
							</thead>
							<tbody>
								{results.map((show) => (
									<tr key={show.identifier}>
										<th scope="row" className="fw-semibold" style={{ minWidth: '200px' }}>{show.title}</th>
										<td><span className="badge bg-secondary">{capitalizeFirstLetter(show.category || '')}</span></td>
										<td className="text-muted text-nowrap">{yearRange(show)}</td>
										<td>{show.desc}</td>
										<td>
											<button
												type="button"
												className="btn btn-sm btn-primary text-nowrap"
												title={`Watch ${show.title}`}
												onClick={() => playShow(show)}
											>
												Watch <span aria-hidden="true">▶</span>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			)}
		</section>
	);
}
