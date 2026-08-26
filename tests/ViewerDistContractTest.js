import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
// Node ESM requires this extension; the project lint rule targets browser imports.
// eslint-disable-next-line import/extensions
import { validateViewerDist } from '../scripts/validate-viewer-dist.js';

const SPA_HTACCESS = `RewriteEngine On
RewriteBase /

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
`;

function pngFixture(width, height) {
  const data = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(data);
  data.writeUInt32BE(13, 8);
  data.write('IHDR', 12, 'ascii');
  data.writeUInt32BE(width, 16);
  data.writeUInt32BE(height, 20);
  return data;
}

function manifestFixture() {
  return {
    id: '/',
    name: 'FreeTV Viewer',
    short_name: 'FreeTV',
    lang: 'en-US',
    description: 'Stream classic TV and movies from the Internet Archive.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    icons: [
      { src: '/assets/app-icons/freetv-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/app-icons/freetv-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/assets/app-icons/freetv-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'freetv-viewer-dist-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'assets'));
  fs.writeFileSync(path.join(root, '.htaccess'), SPA_HTACCESS);
  fs.writeFileSync(path.join(root, 'index.html'), '<!doctype html>');
  fs.writeFileSync(path.join(root, 'assets/viewer.js'), 'export {};');
  fs.writeFileSync(path.join(root, 'assets/viewer.css'), 'body {}');
  fs.mkdirSync(path.join(root, 'assets/app-icons'));
  fs.writeFileSync(path.join(root, 'assets/app-icons/freetv-192x192.png'), pngFixture(192, 192));
  fs.writeFileSync(path.join(root, 'assets/app-icons/freetv-512x512.png'), pngFixture(512, 512));
  fs.writeFileSync(path.join(root, 'assets/app-icons/freetv-512x512-maskable.png'), pngFixture(512, 512));
  fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify(manifestFixture()));
  fs.writeFileSync(path.join(root, 'service-worker.js'), '/* fixture */');
  return root;
}

test('accepts the Viewer frontend allowlist', (t) => {
  const root = fixture(t);
  assert.equal(validateViewerDist(root).files, 9);
});

test('rejects the retired manifest.webmanifest name', (t) => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'manifest.webmanifest'), '{}');
  assert.throws(() => validateViewerDist(root), /unexpected root entry: manifest.webmanifest/);
});

test('requires the Viewer SPA .htaccess', (t) => {
  const root = fixture(t);
  fs.rmSync(path.join(root, '.htaccess'));
  assert.throws(() => validateViewerDist(root), /.htaccess is missing or is not a file/);
});

test('rejects a changed Viewer SPA rewrite contract', (t) => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, '.htaccess'), 'RewriteEngine Off\n');
  assert.throws(() => validateViewerDist(root), /.htaccess does not match the Viewer SPA fallback contract/);
});

test('rejects local playlist data', (t) => {
  const root = fixture(t);
  fs.mkdirSync(path.join(root, 'playlists'));
  assert.throws(() => validateViewerDist(root), /forbidden runtime path|unexpected root entry/);
});

test('rejects local config data', (t) => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'config.json'), '{}');
  assert.throws(() => validateViewerDist(root), /forbidden runtime\/config file|unexpected root entry/);
});

test('rejects local thumbnail data', (t) => {
  const root = fixture(t);
  fs.mkdirSync(path.join(root, 'thumbs'));
  assert.throws(() => validateViewerDist(root), /forbidden runtime path|unexpected root entry/);
});

test('rejects unexpected root files', (t) => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'developer-notes.txt'), 'fixture');
  assert.throws(() => validateViewerDist(root), /unexpected root entry/);
});

test('rejects credential key files inside assets', (t) => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'assets/credentials.key'), 'not-a-real-key');
  assert.throws(() => validateViewerDist(root), /credential\/key files are not allowed/);
});

test('rejects symbolic links', (t) => {
  const root = fixture(t);
  fs.symlinkSync(path.join(root, 'assets/icon.png'), path.join(root, 'assets/icon-link.png'));
  assert.throws(() => validateViewerDist(root), /symbolic links are not allowed/);
});

test('rejects invalid manifest identity', (t) => {
  const root = fixture(t);
  const manifest = manifestFixture();
  manifest.id = '/other-app';
  fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify(manifest));
  assert.throws(() => validateViewerDist(root), /manifest.json id must be "\/"/);
});

test('rejects manifest icon dimension mismatches', (t) => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'assets/app-icons/freetv-192x192.png'), pngFixture(191, 192));
  assert.throws(() => validateViewerDist(root), /PNG dimensions do not match 192x192/);
});

test('requires the maskable icon purpose', (t) => {
  const root = fixture(t);
  const manifest = manifestFixture();
  delete manifest.icons[2].purpose;
  fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify(manifest));
  assert.throws(() => validateViewerDist(root), /declares the wrong purpose/);
});
