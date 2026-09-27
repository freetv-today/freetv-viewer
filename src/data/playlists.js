import { fetchPublicJson } from './fetchJson';

export function getPlaylists() {
	return fetchPublicJson('/playlists/index.json');
}
