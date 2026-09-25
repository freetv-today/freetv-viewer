import { useEffect, useState } from 'preact/hooks';

export function Shows() {
	const [shows, setShows] = useState(null);
	const [error, setError] = useState('');

	useEffect(() => {
		fetch('/freetv.json')
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Request failed (${response.status})`);
				}
				return response.json();
			})
			.then((data) => {
				if (!Array.isArray(data.shows)) {
					throw new Error('The catalog does not contain a show list.');
				}
				setShows(data.shows);
			})
			.catch(() => setError('Could not load the show catalog. Please try again later.'));
	}, []);

	return (
		<section className="container-fluid p-4">
			<h2 className="mb-4 text-secondary">FreeTV Shows</h2>

			{error && <p className="alert alert-danger" role="alert">{error}</p>}
			{shows === null && !error && <p role="status">Loading shows…</p>}

			{shows && (
				<div className="table-responsive">
					<table className="table table-striped table-hover align-middle text-start">
						<thead>
							<tr>
								<th scope="col">Title</th>
								<th scope="col">Category</th>
								<th scope="col">Years</th>
								<th scope="col">Description</th>
							</tr>
						</thead>
						<tbody>
							{shows.map((show) => (
								<tr key={show.identifier}>
									<th scope="row">{show.title}</th>
									<td className="text-capitalize">{show.category}</td>
									<td>{show.start}{show.end && show.end !== show.start ? `–${show.end}` : ''}</td>
									<td>{show.desc}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
}
