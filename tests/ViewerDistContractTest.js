import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
// Node ESM requires this extension; the project lint rule targets browser imports.
// eslint-disable-next-line import/extensions
import { validateViewerDist } from '../scripts/validate-viewer-dist.js';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'freetv-viewer-dist-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'assets'));
  fs.writeFileSync(path.join(root, 'index.html'), '<!doctype html>');
  fs.writeFileSync(path.join(root, 'assets/viewer.js'), 'export {};');
  fs.writeFileSync(path.join(root, 'assets/viewer.css'), 'body {}');
  fs.writeFileSync(path.join(root, 'assets/icon.png'), 'fixture');
  fs.writeFileSync(path.join(root, 'manifest.webmanifest'), JSON.stringify({
    icons: [{ src: 'assets/icon.png' }]
  }));
  fs.writeFileSync(path.join(root, 'service-worker.js'), '/* fixture */');
  return root;
}

test('accepts the Viewer frontend allowlist', (t) => {
  const root = fixture(t);
  assert.equal(validateViewerDist(root).files, 6);
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

test('rejects unresolved manifest icons', (t) => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'manifest.webmanifest'), JSON.stringify({
    icons: [{ src: 'assets/missing.png' }]
  }));
  assert.throws(() => validateViewerDist(root), /manifest icon does not resolve/);
});
