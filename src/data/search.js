function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSearchTerms(query) {
	return query
		.trim()
		.split(/\s+/)
		.map((term) => term.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
		.filter(Boolean);
}

function containsWholeWord(value, term) {
	if (value == null || value === '') return false;
	const normalized = String(value).normalize('NFKC');
	const matcher = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegex(term)}(?=$|[^\\p{L}\\p{N}])`, 'iu');
	return matcher.test(normalized);
}

export function searchShows(shows, query) {
	const terms = getSearchTerms(query);
	if (terms.length === 0 || !Array.isArray(shows)) return [];

	return shows.filter((show) => {
		if (show.status && show.status !== 'active') return false;
		const fields = [show.title, show.category, show.start, show.end, show.year, show.imdb, show.desc];
		return terms.every((term) => fields.some((field) => containsWholeWord(field, term)));
	});
}
