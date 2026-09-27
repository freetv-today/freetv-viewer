import { fetchPublicJson } from './fetchJson';
import { sharedPath } from './paths';

export function getCatalog(filename) {
	if (!filename) {
		return Promise.reject(new Error('No playlist catalog was selected.'));
	}

	return fetchPublicJson(sharedPath(`../playlists/${encodeURIComponent(filename)}`));
}
