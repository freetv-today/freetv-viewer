import { useEffect, useState } from 'preact/hooks';
import { CategoryLink } from './CategoryLink';

export function CategoryNav() {
	const [categories, setCategories] = useState(null);
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

				const uniqueCategories = [...new Set(
					data.shows
						.map((show) => show.category)
						.filter((category) => typeof category === 'string' && category.trim() !== '')
				)];
				setCategories(uniqueCategories.sort((a, b) => a.localeCompare(b)));
			})
			.catch(() => setError('Could not load categories.'));
	}, []);

	return (
		<nav className="navbar border-bottom border-body" aria-label="Categories">
			<div className="container-fluid justify-content-center flex-wrap gap-1">
				{error && <span className="text-danger" role="alert">{error}</span>}
				{categories === null && !error && <span role="status" className="visually-hidden">Loading categories…</span>}
				{categories?.map((category) => (
					<CategoryLink key={category} category={category} />
				))}
			</div>
		</nav>
	);
}
