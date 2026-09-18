import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath, URL } from 'node:url';

const viewerRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(viewerRoot, 'public/service-worker.js'), 'utf8');

function loadWorker() {
  const handlers = new Map();
  const calls = { cacheDelete: [], cacheMatch: 0, cacheOpen: 0, claim: 0, fetch: 0 };
  const cachedResponse = { source: 'cache' };
  const networkResponse = { clone: () => networkResponse, ok: true, source: 'network', type: 'basic' };
  const cache = { addAll: async () => {}, put: async () => {} };
  const context = {
    URL,
    caches: {
      delete: async (key) => calls.cacheDelete.push(key),
      keys: async () => ['freetv-static-v1', 'freetv-thumbs-v1', 'freetv-static-v2', 'other-app-cache'],
      match: async () => {
        calls.cacheMatch += 1;
        return cachedResponse;
      },
      open: async () => {
        calls.cacheOpen += 1;
        return cache;
      }
    },
    fetch: async () => {
      calls.fetch += 1;
      return networkResponse;
    },
    self: {
      addEventListener: (type, handler) => handlers.set(type, handler),
      clients: { claim: async () => { calls.claim += 1; } },
      location: { origin: 'https://freetv.today' },
      skipWaiting: () => {}
    }
  };
  vm.runInNewContext(source, context, { filename: 'service-worker.js' });
  return { calls, cachedResponse, handlers };
}

async function dispatchFetch(worker, pathname, method = 'GET', origin = 'https://freetv.today') {
  let responsePromise;
  worker.handlers.get('fetch')({
    request: { method, url: `${origin}${pathname}` },
    respondWith: (promise) => { responsePromise = promise; }
  });
  return responsePromise ? responsePromise : null;
}

for (const pathname of [
  '/config.json',
  '/playlists/index.json',
  '/thumbs/tt0108903.jpg',
  '/api/report-problem.php',
  '/admin/index.html'
]) {
  test(`${pathname} bypasses the Cache API`, async () => {
    const worker = loadWorker();
    const response = await dispatchFetch(worker, pathname);
    assert.equal(response.source, 'network');
    assert.equal(worker.calls.fetch, 1);
    assert.equal(worker.calls.cacheMatch, 0);
    assert.equal(worker.calls.cacheOpen, 0);
  });
}

test('Viewer static assets may use cache-first handling', async () => {
  const worker = loadWorker();
  const response = await dispatchFetch(worker, '/assets/app-icons/freetv-192x192.png');
  assert.equal(response, worker.cachedResponse);
  assert.equal(worker.calls.cacheMatch, 1);
  assert.equal(worker.calls.fetch, 0);
});

test('non-GET and cross-origin requests bypass service-worker handling', async () => {
  const worker = loadWorker();
  assert.equal(await dispatchFetch(worker, '/assets/app.js', 'POST'), null);
  assert.equal(await dispatchFetch(worker, '/assets/app.js', 'GET', 'https://cdn.example'), null);
  assert.equal(worker.calls.cacheMatch, 0);
  assert.equal(worker.calls.fetch, 0);
});

test('activation removes obsolete FreeTV caches and claims clients', async () => {
  const worker = loadWorker();
  let activation;
  worker.handlers.get('activate')({ waitUntil: (promise) => { activation = promise; } });
  await activation;
  assert.deepEqual(worker.calls.cacheDelete.sort(), ['freetv-static-v1', 'freetv-thumbs-v1']);
  assert.equal(worker.calls.claim, 1);
});

test('legacy data-update logic and the old cache version are absent', () => {
  assert.doesNotMatch(source, /PLAYLIST_INDEX_URL|CONFIG_URL|lastPlaylistUpdated|lastConfigUpdated/u);
  assert.doesNotMatch(source, /fetchPlaylistLastUpdated|fetchConfigLastUpdated|checkForUpdatesAndNotify/u);
  assert.doesNotMatch(source, /periodicSync|periodicsync|GET_PLAYLIST_NAME|DATA_UPDATE_AVAILABLE/u);
  assert.doesNotMatch(source, /const CACHE_NAME = 'freetv-static-v1'/u);
  assert.match(source, /const CACHE_NAME = 'freetv-static-v2'/u);
});
