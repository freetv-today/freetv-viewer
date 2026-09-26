import { fetchPublicJson } from './fetchJson';

export function getSite() {
	return fetchPublicJson('whitelabel.config.json');
}
