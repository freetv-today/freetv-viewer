import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { NavbarButton } from './NavbarButton';
import { useAppContext } from '../state/AppProvider';
import { getSearchValidationError } from '../data/search';
import { appPath } from '../data/paths';

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
		route(appPath(`/search?q=${encodeURIComponent(trimmed)}`));
		closeMobileMenu();
	}

	function closeMobileMenu() {
		if (!window.matchMedia('(max-width: 767.98px)').matches) return;
		const menu = document.getElementById('primary-navigation');
		if (menu?.classList.contains('show')) {
			document.getElementById('primary-navigation-toggle')?.click();
		}
	}

	return (
		<header>
			<nav className="navbar fixed-top navbar-dark bg-dark" aria-label="Main navigation">
				<div className="container-fluid header__container">

					{/* Branding */}
					<a className="navbar-brand mb-0" href={appPath()} title={appName}>
						<img src={logoSrc} height="30" alt={appName} className="d-inline-block me-2 pb-1"/>
						<span className="pt-5 text-secondary noselect">{appName}</span>
					</a>
					<button
						id="primary-navigation-toggle"
						className="navbar-toggler d-md-none"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#primary-navigation"
						aria-controls="primary-navigation"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon" />
					</button>

					<div id="primary-navigation" className="collapse header__menu d-md-flex">
						{/* Navbar Buttons */}
						<div className="header__nav-links order-2 order-md-1">
							{site?.navbar?.map((item) => (
								<NavbarButton
									key={item.url}
									url={appPath(item.url)}
									label={item.label}
									title={item.title}
									icon={item.icon}
									showNavLabel={site.showNavLabels}
									onClick={closeMobileMenu}
								/>
							))}
						</div>

						{/* Search Form */}
						<form className="header__search order-3 order-md-2" role="search" onSubmit={handleSearch}>
							<input
								id="query"
								className="form-control form-control-sm"
								type="search"
								placeholder="Search"
								aria-label="Search shows"
								value={searchText}
								onInput={(event) => setSearchText(event.currentTarget.value)}
							/>
							<button className="btn btn-sm btn-outline-secondary" type="submit">Go</button>
						</form>

						{/* Playlist Selector */}
						<div className="dropdown header__playlist order-1 order-md-3" title="Current Playlist">
							<button className="btn btn-sm btn-outline-secondary playlist-selector dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" disabled={isInitializing}>
								{currentPlaylist?.dbtitle || 'Select Playlist'}
							</button>
							<ul className="dropdown-menu dropdown-menu-dark">
								{playlists.map((playlist) => (
									<li key={playlist.filename}>
										<button
											class={`dropdown-item${playlist.filename === currentPlaylist?.filename ? ' active' : ''}`}
											type="button"
											onClick={() => {
											selectPlaylist(playlist.filename);
											closeMobileMenu();
										}}
										>
											{playlist.dbtitle}
										</button>
									</li>
								))}
							</ul>
						</div>
					</div>

				</div>
			</nav>
		</header>
	);
}
