const APP_BASE = import.meta.env.BASE_URL;

/** Build a URL inside the app, using Vite's configured base path. */
export function appPath(path = '') {
	return `${APP_BASE}${path.replace(/^\/+/, '')}`;
}

/** Build a URL for shared files stored beside the app directory (for example /playlists). */
export function sharedPath(path) {
	return new URL(path, `${window.location.origin}${APP_BASE}`).pathname;
}
