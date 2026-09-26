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

const ignoredSearchWords = new Set(['a', 'and', 'the', 'or', 'but']);

export function getSearchValidationError(query) {
	const trimmed = String(query || '').trim();
	if (!trimmed) return 'Please enter a search term.';

	const terms = getSearchTerms(trimmed);
	if (terms.length > 0 && terms.every((term) => ignoredSearchWords.has(term.toLowerCase()))) {
		return "Your search query only contains common words (such as 'the', 'and', 'a', 'or', and 'but'). Please include a more specific search term.";
	}

	if (trimmed.replace(/\s/g, '').length < 3) {
		return 'Your search query must be at least 3 characters long.';
	}
	if (terms.length === 0) return 'Please enter a search term containing letters or numbers.';
	return '';
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
