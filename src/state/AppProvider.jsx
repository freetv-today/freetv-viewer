import { createContext } from 'preact';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { getCatalog } from '../data/catalog';
import { getPlaylists } from '../data/playlists';
import { getSite } from '../data/site';
import { addRecentShow } from '../data/userLists';

const AppContext = createContext(null);
const PLAYLIST_STORAGE_KEY = 'freetv.currentPlaylist';
const CURRENT_VIDEO_STORAGE_KEY = 'freetv.currentVideo';

function readCurrentVideo() {
	try {
		const saved = JSON.parse(localStorage.getItem(CURRENT_VIDEO_STORAGE_KEY) || 'null');
		return saved && typeof saved.identifier === 'string' && typeof saved.title === 'string'
			? saved
			: null;
	} catch {
		return null;
	}
}

export function AppProvider({ children }) {
	const { path } = useLocation();
	const [site, setSite] = useState(null);
	const [playlists, setPlaylists] = useState([]);
	const [currentPlaylist, setCurrentPlaylist] = useState(null);
	const [catalog, setCatalog] = useState(null);
	const [currentVideo, setCurrentVideo] = useState(readCurrentVideo);
	const [isInitializing, setIsInitializing] = useState(true);
	const [isCatalogLoading, setIsCatalogLoading] = useState(false);
	const [initializationError, setInitializationError] = useState('');
	const [catalogError, setCatalogError] = useState('');

	useEffect(() => {
		let cancelled = false;

		Promise.all([getSite(), getPlaylists()])
			.then(([siteData, playlistData]) => {
				if (!Array.isArray(playlistData.playlists)) {
					throw new Error('The playlist index does not contain a playlist list.');
				}

				let savedFilename = '';
				try {
					savedFilename = localStorage.getItem(PLAYLIST_STORAGE_KEY) || '';
				} catch {
					// Storage may be unavailable; use the configured default playlist.
				}

				const selectedPlaylist =
					playlistData.playlists.find((playlist) => playlist.filename === savedFilename) ||
					playlistData.playlists.find((playlist) => playlist.filename === playlistData.default) ||
					playlistData.playlists[0] ||
					null;

				if (!cancelled) {
					setSite(siteData);
					setPlaylists(playlistData.playlists);
					setCurrentPlaylist(selectedPlaylist);
					setIsInitializing(false);
				}
			})
			.catch((error) => {
				if (!cancelled) {
					setInitializationError(error.message || 'Could not load app data.');
					setIsInitializing(false);
				}
			});

		return () => { cancelled = true; };
	}, []);

	useEffect(() => {
		if (!currentPlaylist) return;

		let cancelled = false;
		setCatalog(null);
		setCatalogError('');
		setIsCatalogLoading(true);

		getCatalog(currentPlaylist.filename)
			.then((loadedCatalog) => {
				if (!Array.isArray(loadedCatalog.shows)) {
					throw new Error('The selected catalog does not contain a show list.');
				}
				if (!cancelled) setCatalog(loadedCatalog);
			})
			.catch((error) => {
				if (!cancelled) setCatalogError(error.message || 'Could not load the selected catalog.');
			})
			.finally(() => {
				if (!cancelled) setIsCatalogLoading(false);
			});

		return () => { cancelled = true; };
	}, [currentPlaylist?.filename]);

	useEffect(() => {
		if (path === '/nowplaying' && currentVideo?.title) {
			document.title = `${site?.appName || 'FreeTV'}: ${currentVideo.title}`;
		} else if (site) {
			document.title = site.appTitle || site.appName || 'FreeTV';
		}
	}, [site?.appTitle, site?.appName, path, currentVideo?.title]);

	const categories = useMemo(() => {
		if (!Array.isArray(catalog?.shows)) return [];

		return [...new Set(
			catalog.shows
				.map((show) => show.category)
				.filter((category) => typeof category === 'string' && category.trim() !== '')
		)].sort((a, b) => a.localeCompare(b));
	}, [catalog]);

	function selectPlaylist(filename) {
		const selectedPlaylist = playlists.find((playlist) => playlist.filename === filename);
		if (!selectedPlaylist || selectedPlaylist.filename === currentPlaylist?.filename) return;

		try {
			localStorage.setItem(PLAYLIST_STORAGE_KEY, selectedPlaylist.filename);
		} catch {
			// The selection still works for this session if storage is unavailable.
		}

		setCurrentPlaylist(selectedPlaylist);
	}

	function queueVideo(show) {
		if (!show?.identifier || !show?.title) return false;
		addRecentShow(show);

		const queuedVideo = {
			identifier: show.identifier,
			title: show.title,
			category: show.category || '',
			imdb: show.imdb || '',
		};
		setCurrentVideo(queuedVideo);
		try {
			localStorage.setItem(CURRENT_VIDEO_STORAGE_KEY, JSON.stringify(queuedVideo));
		} catch {
			// Playback still works for this session if storage is unavailable.
		}
		return true;
	}

	const value = {
		site,
		playlists,
		currentPlaylist,
		catalog,
		currentVideo,
		categories,
		isInitializing,
		isCatalogLoading,
		initializationError,
		catalogError,
		selectPlaylist,
		queueVideo,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used inside AppProvider.');
	}
	return context;
}
