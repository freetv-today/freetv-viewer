import fs from 'node:fs';
import { Buffer } from 'node:buffer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* global process */

const ALLOWED_ROOT_ENTRIES = new Set([
  '.htaccess',
  'assets',
  'index.html',
  'manifest.json',
  'service-worker.js'
]);
const EXPECTED_MANIFEST = Object.freeze({
  id: '/',
  name: 'FreeTV Viewer',
  short_name: 'FreeTV',
  lang: 'en-US',
  start_url: '/',
  scope: '/',
  display: 'standalone'
});
const EXPECTED_ICONS = new Map([
  ['/assets/app-icons/freetv-192x192.png', { width: 192, height: 192, purpose: undefined }],
  ['/assets/app-icons/freetv-512x512.png', { width: 512, height: 512, purpose: 'any' }],
  ['/assets/app-icons/freetv-512x512-maskable.png', { width: 512, height: 512, purpose: 'maskable' }]
]);
const SPA_HTACCESS = `RewriteEngine On
RewriteBase /

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
`;
const ALLOWED_ASSET_EXTENSIONS = new Set([
  '.css',
  '.gif',
  '.html',
  '.jpg',
  '.js',
  '.nfo',
  '.png',
  '.svg',
  '.ttf'
]);
const FORBIDDEN_SEGMENTS = new Set(['admin', 'api', 'logs', 'playlists', 'temp', 'thumbs']);

function walk(directory, relativeDirectory = '') {
  const entries = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relativePath = path.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);
    entries.push({ entry, relativePath, absolutePath });
    if (entry.isDirectory()) entries.push(...walk(absolutePath, relativePath));
  }
  return entries;
}

function requireFile(root, relativePath, errors) {
  const target = path.join(root, relativePath);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    errors.push(`${relativePath} is missing or is not a file`);
  }
}

function validateSpaHtaccess(root, errors) {
  const htaccessPath = path.join(root, '.htaccess');
  if (!fs.existsSync(htaccessPath) || !fs.statSync(htaccessPath).isFile()) return;
  const contents = fs.readFileSync(htaccessPath, 'utf8').replaceAll('\r\n', '\n');
  if (contents !== SPA_HTACCESS) errors.push('.htaccess does not match the Viewer SPA fallback contract');
}

function readPngDimensions(filePath) {
  const data = fs.readFileSync(filePath);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (data.length < 24 || !data.subarray(0, 8).equals(signature)
    || data.subarray(12, 16).toString('ascii') !== 'IHDR') return null;
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

function validateManifest(root, errors) {
  const manifestPath = path.join(root, 'manifest.json');
  if (!fs.existsSync(manifestPath)) return;

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    errors.push('manifest.json is not valid JSON');
    return;
  }

  for (const [field, expected] of Object.entries(EXPECTED_MANIFEST)) {
    if (manifest[field] !== expected) errors.push(`manifest.json ${field} must be ${JSON.stringify(expected)}`);
  }
  if (!Array.isArray(manifest.display_override) || manifest.display_override.length === 0) {
    errors.push('manifest.json must declare display_override');
  }
  if (typeof manifest.description !== 'string' || manifest.description.trim() === '') {
    errors.push('manifest.json must declare a description');
  }

  if (!Array.isArray(manifest.icons) || manifest.icons.length !== EXPECTED_ICONS.size) {
    errors.push('manifest.json must declare the three FreeTV application icons');
    return;
  }

  const declaredIcons = new Set();
  for (const icon of manifest.icons) {
    if (!icon || typeof icon.src !== 'string' || icon.src.length === 0) {
      errors.push('manifest.json contains an icon without a source');
      continue;
    }
    const expected = EXPECTED_ICONS.get(icon.src);
    if (!expected) {
      errors.push(`manifest.json contains an unexpected icon: ${icon.src}`);
      continue;
    }
    declaredIcons.add(icon.src);
    if (icon.type !== 'image/png') errors.push(`manifest icon must declare image/png: ${icon.src}`);
    if (icon.sizes !== `${expected.width}x${expected.height}`) {
      errors.push(`manifest icon declares the wrong size: ${icon.src}`);
    }
    const validPurpose = expected.purpose === undefined
      ? icon.purpose === undefined || icon.purpose === 'any'
      : icon.purpose === expected.purpose;
    if (!validPurpose) errors.push(`manifest icon declares the wrong purpose: ${icon.src}`);
    const relativeIconPath = icon.src.split(/[?#]/u)[0].replace(/^\/+/, '');
    const iconPath = path.resolve(root, relativeIconPath);
    if (!iconPath.startsWith(`${root}${path.sep}`)
      || !fs.existsSync(iconPath)
      || !fs.statSync(iconPath).isFile()) {
      errors.push(`manifest icon does not resolve to a built file: ${icon.src}`);
      continue;
    }
    const dimensions = readPngDimensions(iconPath);
    if (!dimensions || dimensions.width !== expected.width || dimensions.height !== expected.height) {
      errors.push(`manifest icon PNG dimensions do not match ${expected.width}x${expected.height}: ${icon.src}`);
    }
  }
  for (const iconPath of EXPECTED_ICONS.keys()) {
    if (!declaredIcons.has(iconPath)) errors.push(`manifest.json is missing required icon: ${iconPath}`);
  }
}

export function validateViewerDist(distRoot) {
  const resolvedRoot = path.resolve(distRoot);
  const errors = [];

  if (!fs.existsSync(resolvedRoot) || !fs.statSync(resolvedRoot).isDirectory()) {
    throw new Error(`Viewer dist directory is missing: ${resolvedRoot}`);
  }

  for (const entry of fs.readdirSync(resolvedRoot, { withFileTypes: true })) {
    if (!ALLOWED_ROOT_ENTRIES.has(entry.name)) {
      errors.push(`unexpected root entry: ${entry.name}`);
    }
  }

  requireFile(resolvedRoot, '.htaccess', errors);
  requireFile(resolvedRoot, 'index.html', errors);
  requireFile(resolvedRoot, 'manifest.json', errors);
  requireFile(resolvedRoot, 'service-worker.js', errors);

  const assetsPath = path.join(resolvedRoot, 'assets');
  if (!fs.existsSync(assetsPath) || !fs.statSync(assetsPath).isDirectory()) {
    errors.push('assets/ is missing or is not a directory');
  }

  let hasJavaScript = false;
  let hasCss = false;
  for (const { entry, relativePath } of walk(resolvedRoot)) {
    const segments = relativePath.split(path.sep);
    const basename = segments.at(-1).toLowerCase();

    if (entry.isSymbolicLink()) {
      errors.push(`symbolic links are not allowed: ${relativePath}`);
      continue;
    }
    if (segments.some((segment) => FORBIDDEN_SEGMENTS.has(segment.toLowerCase()))) {
      errors.push(`forbidden runtime path: ${relativePath}`);
    }
    if (basename === 'config.json' || basename === '.env' || basename.startsWith('.env.')) {
      errors.push(`forbidden runtime/config file: ${relativePath}`);
    }
    if (basename.endsWith('.key')) {
      errors.push(`credential/key files are not allowed: ${relativePath}`);
    }
    if (entry.isFile() && relativePath.startsWith(`assets${path.sep}`)) {
      const extension = path.extname(basename);
      if (!ALLOWED_ASSET_EXTENSIONS.has(extension)) {
        errors.push(`unsupported Viewer asset type: ${relativePath}`);
      }
      if (extension === '.js') hasJavaScript = true;
      if (extension === '.css') hasCss = true;
    }
  }

  if (!hasJavaScript) errors.push('assets/ does not contain a Viewer JavaScript bundle');
  if (!hasCss) errors.push('assets/ does not contain a Viewer CSS bundle');
  validateSpaHtaccess(resolvedRoot, errors);
  validateManifest(resolvedRoot, errors);

  if (errors.length > 0) {
    throw new Error(`Viewer dist contract validation failed:\n - ${errors.join('\n - ')}`);
  }

  return {
    root: resolvedRoot,
    files: walk(resolvedRoot).filter(({ entry }) => entry.isFile()).length
  };
}

const scriptPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (scriptPath === fileURLToPath(import.meta.url)) {
  const viewerRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  try {
    const result = validateViewerDist(path.join(viewerRoot, 'dist'));
    console.log(`Viewer dist contract validation passed (${result.files} files).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
