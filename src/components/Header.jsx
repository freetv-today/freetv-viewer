import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { NavbarButton } from './NavbarButton';
import { useAppContext } from '../state/AppProvider';
import { getSearchValidationError } from '../data/search';

export function Header() {
	const { site, playlists, currentPlaylist, isInitializing, selectPlaylist } = useAppContext();
	const { query, route } = useLocation();
	const [searchText, setSearchText] = useState(query.q || '');
	const appName = site?.appName || 'FreeTV';
	const smallLogo = site?.smallLogo || '/freetv-small.png';
	const logoSrc = /^(?:https?:)?\/\//.test(smallLogo) || smallLogo.startsWith('data:')
		? smallLogo
		: `${import.meta.env.BASE_URL}${smallLogo.replace(/^\/+/, '')}`;

	useEffect(() => {
		setSearchText(query.q || '');
	}, [query.q]);

	function handleSearch(event) {
		event.preventDefault();
		const trimmed = searchText.trim();
		const validationError = getSearchValidationError(trimmed);
		if (validationError) {
			window.alert(validationError);
			document.getElementById('query')?.focus();
			return;
		}
		route(`/search?q=${encodeURIComponent(trimmed)}`);
	}

	return (
		<header>
			<nav className="navbar fixed-top navbar-dark bg-dark" aria-label="Main navigation">
				<div className="container-fluid" style={{ minHeight: '50px' }}>

					{/* Branding */}
					<a className="navbar-brand" href="/" title={appName}>
						<img src={logoSrc} height="30" alt={appName} className="d-inline-block me-2 pb-1"/>
						<span className="pt-5 text-secondary noselect">{appName}</span>
					</a>

					{/* Navbar Buttons */}
					<div className="me-auto">
						{site?.navbar?.map((item) => (
							<NavbarButton
								key={item.url}
								url={item.url}
								label={item.label}
								title={item.title}
								icon={item.icon}
								showNavLabel={site.showNavLabels}
							/>
						))}
					</div>

					{/* Search Form */}
					<form className="d-flex me-auto" role="search" onSubmit={handleSearch}>
						<input
							id="query"
							className="form-control form-control-sm me-1"
							type="search"
							placeholder="Search"
							aria-label="Search shows"
							value={searchText}
							onInput={(event) => setSearchText(event.currentTarget.value)}
						/>
						<button className="btn btn-sm btn-outline-secondary" type="submit">Go</button>
					</form>

					{/* Playlist Selector */}
					<div className="dropdown me-2" title="Current Playlist">
						<button className="btn btn-sm btn-outline-secondary playlist-selector dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" disabled={isInitializing}>
							{currentPlaylist?.dbtitle || 'Select Playlist'}
						</button>
						<ul className="dropdown-menu dropdown-menu-dark">
							{playlists.map((playlist) => (
								<li key={playlist.filename}>
									<button
										class={`dropdown-item${playlist.filename === currentPlaylist?.filename ? ' active' : ''}`}
										type="button"
										onClick={() => selectPlaylist(playlist.filename)}
									>
										{playlist.dbtitle}
									</button>
								</li>
							))}
						</ul>
					</div>

				</div>
			</nav>
		</header>
	);
}
