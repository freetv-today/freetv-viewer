/** @type {ServiceWorkerGlobalScope} */
// @ts-nocheck
/* eslint-env serviceworker */
/* global self, caches, clients, fetch */

// Basic Service Worker for FreeTV Viewer PWA


const CACHE_NAME = 'freetv-static-v1';
// const THUMB_CACHE = 'freetv-thumbs-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/freetv.png',
  // Add more static assets as needed
];

const PLAYLIST_INDEX_URL = '/playlists/index.json';
const CONFIG_URL = '/config.json';
let lastPlaylistUpdated = null;
let lastConfigUpdated = null;


// Helper: fetch and get lastupdated for config.json (top-level) or for the current playlist from index.json
async function fetchConfigLastUpdated(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.lastupdated || null;
  } catch {
    return null;
  }
}

// Helper: fetch and get lastupdated for the current playlist from index.json
async function fetchPlaylistLastUpdated(indexUrl) {
  try {
    // Get current playlist from localStorage (may be quoted)
    let playlistName = null;
    try {
      playlistName = await self.clients.matchAll({ includeUncontrolled: true })
        .then(clients => {
          for (const client of clients) {
            try {
              // Try to read localStorage from the client via postMessage/request
              // But service workers can't directly access localStorage, so we rely on a workaround
              // We'll use the first client and send a message to request the playlist name
              // The client should respond with the playlist name
              // We'll use a Promise to wait for the response
              return new Promise(resolve => {
                const channel = new MessageChannel();
                channel.port1.onmessage = event => {
                  resolve(event.data && event.data.playlist);
                };
                client.postMessage({ type: 'GET_PLAYLIST_NAME' }, [channel.port2]);
                // Timeout fallback
                setTimeout(() => resolve(null), 1000);
              });
            } catch {}
          }
          return null;
        });
    } catch {}
    // Fallback: try to read from IndexedDB (not implemented here), or use default
    const res = await fetch(indexUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    let playlistToFind = null;
    if (playlistName && typeof playlistName === 'string') {
      // Remove quotes if present
      playlistToFind = playlistName.replace(/^"|"$/g, '');
    } else if (data.default) {
      playlistToFind = data.default;
    } else if (data.playlists && data.playlists[0] && data.playlists[0].filename) {
      playlistToFind = data.playlists[0].filename;
    }
    if (!playlistToFind) return null;
    const entry = (data.playlists || []).find(p => p.filename === playlistToFind);
    return entry && entry.lastupdated ? entry.lastupdated : null;
  } catch {
    return null;
  }
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Thumbnail caching: /thumbs/*.jpg
  // if (url.pathname.startsWith('/thumbs/') && url.pathname.endsWith('.jpg')) {
  //   event.respondWith(
  //     caches.open(THUMB_CACHE).then(cache =>
  //       cache.match(event.request).then(response => {
  //         if (response) return response;
  //         return fetch(event.request).then(networkRes => {
  //           if (networkRes && networkRes.status === 200) {
  //             cache.put(event.request, networkRes.clone());
  //           }
  //           return networkRes;
  //         }).catch(() => caches.match('/assets/vintage-tv.png'));
  //       })
  //     )
  //   );
  //   return;
  // }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});

// Periodic update check (fallback to setInterval if periodicSync not available)
async function checkForUpdatesAndNotify() {
  console.log('[SW] checkForUpdatesAndNotify called');
  const [playlistUpdated, configUpdated] = await Promise.all([
    fetchPlaylistLastUpdated(PLAYLIST_INDEX_URL),
    fetchConfigLastUpdated(CONFIG_URL)
  ]);
  console.log('[SW] Fetched lastupdated:', { playlistUpdated, configUpdated, lastPlaylistUpdated, lastConfigUpdated });
  let updated = false;
  if (playlistUpdated && playlistUpdated !== lastPlaylistUpdated) {
    lastPlaylistUpdated = playlistUpdated;
    updated = true;
    console.log('[SW] Playlist update detected');
  }
  if (configUpdated && configUpdated !== lastConfigUpdated) {
    lastConfigUpdated = configUpdated;
    updated = true;
    console.log('[SW] Config update detected');
  }
  if (updated) {
    // Notify all clients
    const allClients = await self.clients.matchAll({ includeUncontrolled: true });
    console.log(`[SW] Notifying ${allClients.length} clients of update`);
    allClients.forEach(client => {
      client.postMessage({ type: 'DATA_UPDATE_AVAILABLE' });
    });
  } else {
    console.log('[SW] No update detected');
  }
}

// Try to use periodicSync, fallback to setInterval
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    if ('periodicSync' in self.registration) {
      try {
        await self.registration.periodicSync.register('check-updates', { minInterval: 10 * 60 * 1000 });
      } catch {}
    }
    // Initial check
    checkForUpdatesAndNotify();
  })());
});

self.addEventListener('periodicsync', event => {
  if (event.tag === 'check-updates') {
    event.waitUntil(checkForUpdatesAndNotify());
  }
});