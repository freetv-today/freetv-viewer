const METADATA_URL = 'https://archive.org/metadata';
const DOWNLOAD_URL = 'https://archive.org/download';

const FORMAT_RANK = new Map([
	['h.264 ia', 1],
	['mpeg4', 2],
	['h.264', 3],
	['mpeg4 (mobile)', 4],
	['webm', 5],
	['ogg video', 6],
]);

function fileType(name) {
	const extension = name.split('.').pop()?.toLowerCase();
	if (extension === 'webm') return 'video/webm';
	if (extension === 'ogv' || extension === 'ogg') return 'video/ogg';
	return 'video/mp4';
}

function baseName(name) {
	return name.replace(/\.[^/.]+$/, '').replace(/\.ia$/i, '').split('/').pop();
}

export function formatDuration(seconds) {
	if (!Number.isFinite(Number(seconds))) return '';
	const total = Math.round(Number(seconds));
	const hours = Math.floor(total / 3600);
	const minutes = Math.floor((total % 3600) / 60);
	const remainder = String(total % 60).padStart(2, '0');
	return hours
		? `${hours}:${String(minutes).padStart(2, '0')}:${remainder}`
		: `${minutes}:${remainder}`;
}

export async function fetchArchivePlaylist(identifier, { signal } = {}) {
	const response = await fetch(`${METADATA_URL}/${encodeURIComponent(identifier)}`, { signal });
	if (!response.ok) throw new Error(`Internet Archive metadata request failed (${response.status}).`);

	const data = await response.json();
	if (data.error) throw new Error(data.error);
	if (!Array.isArray(data.files)) throw new Error('Internet Archive did not return a file list for this item.');

	const candidates = data.files
		.filter((file) => FORMAT_RANK.has(String(file.format || '').toLowerCase()) && Number(file.size) > 0 && file.name)
		.map((file) => {
			const name = String(file.name);
			const encodedName = name.split('/').map(encodeURIComponent).join('/');
			return {
				name,
				base: baseName(name),
				rank: FORMAT_RANK.get(String(file.format).toLowerCase()),
				size: Number(file.size),
				duration: Number.parseFloat(file.length) || 0,
				title: file.title || '',
				source: `${DOWNLOAD_URL}/${encodeURIComponent(identifier)}/${encodedName}`,
				type: fileType(name),
			};
		});

	// Prefer IA's normalized playback copy over the uploaded original.
	const preferredFiles = new Map();
	for (const file of candidates) {
		const current = preferredFiles.get(file.base);
		if (!current || file.rank < current.rank || (file.rank === current.rank && file.size > current.size)) {
			preferredFiles.set(file.base, file);
		}
	}

	const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
	const episodes = [...preferredFiles.values()]
		.sort((a, b) => collator.compare(a.name, b.name))
		.map((file) => ({
			title: file.title || file.base.replace(/^[Ss]\d+\s*EP\s*\d*[-.]?\s*/i, '') || file.base,
			url: file.source,
			type: file.type,
			duration: file.duration ? formatDuration(file.duration) : '',
		}));

	if (episodes.length === 0) throw new Error('No playable video files were found in this Internet Archive item.');

	return {
		episodes,
		thumbnail: `${DOWNLOAD_URL}/${encodeURIComponent(identifier)}/${encodeURIComponent(identifier)}.thumb`,
	};
}
