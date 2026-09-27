import { fetchPublicJson } from './fetchJson';

export function getCatalog(filename) {
	if (!filename) {
		return Promise.reject(new Error('No playlist catalog was selected.'));
	}

	return fetchPublicJson(`/playlists/${encodeURIComponent(filename)}`);
}
