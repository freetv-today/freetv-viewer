const FAVORITES_KEY = 'freetv.favorites';
const RECENT_HISTORY_KEY = 'freetv.recentHistory';
const MAX_RECENT_SHOWS = 25;

function saveableShow(show) {
	if (!show?.identifier || !show?.title) return null;
	return {
		identifier: String(show.identifier),
		title: String(show.title),
		category: show.category || '',
		desc: show.desc || '',
		start: show.start || '',
		end: show.end || '',
		imdb: show.imdb || '',
		group: show.group || '',
	};
}

function readList(key) {
	try {
		const saved = JSON.parse(localStorage.getItem(key) || '[]');
		return Array.isArray(saved)
			? saved.filter((show) => show && typeof show.identifier === 'string' && typeof show.title === 'string')
			: [];
	} catch {
		return [];
	}
}

function writeList(key, shows) {
	try {
		localStorage.setItem(key, JSON.stringify(shows));
	} catch {
		// Keep the current interaction usable if browser storage is unavailable.
	}
}

export function getFavoriteShows() {
	return readList(FAVORITES_KEY);
}

export function isFavoriteShow(show) {
	return Boolean(show?.identifier && getFavoriteShows().some((item) => item.identifier === show.identifier));
}

export function toggleFavoriteShow(show) {
	const savedShow = saveableShow(show);
	if (!savedShow) return { shows: getFavoriteShows(), isFavorite: false };

	const current = getFavoriteShows();
	const isFavorite = current.some((item) => item.identifier === savedShow.identifier);
	const shows = isFavorite
		? current.filter((item) => item.identifier !== savedShow.identifier)
		: [savedShow, ...current];
	writeList(FAVORITES_KEY, shows);
	return { shows, isFavorite: !isFavorite };
}

export function getRecentShows() {
	return readList(RECENT_HISTORY_KEY);
}

export function addRecentShow(show) {
	const savedShow = saveableShow(show);
	if (!savedShow) return getRecentShows();

	const shows = [
		savedShow,
		...getRecentShows().filter((item) => item.identifier !== savedShow.identifier),
	].slice(0, MAX_RECENT_SHOWS);
	writeList(RECENT_HISTORY_KEY, shows);
	return shows;
}
