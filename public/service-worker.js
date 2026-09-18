/** @type {ServiceWorkerGlobalScope} */
// @ts-nocheck
/* eslint-env serviceworker */
const CACHE_NAME = 'freetv-static-v2';
const CACHE_PREFIX = 'freetv-';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/app-icons/freetv-192x192.png',
  '/assets/app-icons/freetv-512x512.png',
  '/assets/app-icons/freetv-512x512-maskable.png',
];
const MUTABLE_PATH_PREFIXES = ['/playlists/', '/thumbs/', '/api/', '/admin/'];

function isMutablePath(pathname) {
  return pathname === '/config.json'
    || MUTABLE_PATH_PREFIXES.some((prefix) => pathname === prefix.slice(0, -1) || pathname.startsWith(prefix));
}

function isViewerStaticPath(pathname) {
  return pathname === '/'
    || pathname === '/index.html'
    || pathname === '/manifest.json'
    || pathname.startsWith('/assets/');
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isMutablePath(url.pathname)) {
    event.respondWith(fetch(request));
    return;
  }

  if (!isViewerStaticPath(url.pathname)) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then((networkResponse) => {
        if (networkResponse.ok && networkResponse.type === 'basic') {
          return caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, networkResponse.clone()))
            .then(() => networkResponse);
        }
        return networkResponse;
      });
    }),
  );
});
