import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* global process */

const ALLOWED_ROOT_ENTRIES = new Set([
  'assets',
  'index.html',
  'manifest.webmanifest',
  'service-worker.js'
]);
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

function validateManifestIcons(root, errors) {
  const manifestPath = path.join(root, 'manifest.webmanifest');
  if (!fs.existsSync(manifestPath)) return;

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    errors.push('manifest.webmanifest is not valid JSON');
    return;
  }

  if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
    errors.push('manifest.webmanifest does not declare any icons');
    return;
  }

  for (const icon of manifest.icons) {
    if (!icon || typeof icon.src !== 'string' || icon.src.length === 0) {
      errors.push('manifest.webmanifest contains an icon without a source');
      continue;
    }
    const relativeIconPath = icon.src.split(/[?#]/u)[0].replace(/^\/+/, '');
    const iconPath = path.resolve(root, relativeIconPath);
    if (!iconPath.startsWith(`${root}${path.sep}`)
      || !fs.existsSync(iconPath)
      || !fs.statSync(iconPath).isFile()) {
      errors.push(`manifest icon does not resolve to a built file: ${icon.src}`);
    }
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

  requireFile(resolvedRoot, 'index.html', errors);
  requireFile(resolvedRoot, 'manifest.webmanifest', errors);
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
  validateManifestIcons(resolvedRoot, errors);

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
