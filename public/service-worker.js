// Temporary migration worker for installations of the v3 Viewer.
// It removes v3's app-shell cache and unregisters itself after activation.
const LEGACY_VIEWER_CACHE = 'freetv-static-v4';

self.addEventListener('install', (event) => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
		await caches.delete(LEGACY_VIEWER_CACHE);
		await self.clients.claim();
		await self.registration.unregister();
	})());
});
