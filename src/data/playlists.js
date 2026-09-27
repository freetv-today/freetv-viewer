import { fetchPublicJson } from './fetchJson';
import { sharedPath } from './paths';

export function getPlaylists() {
	return fetchPublicJson(sharedPath('../playlists/index.json'));
}
