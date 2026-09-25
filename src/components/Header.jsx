import { useEffect, useState } from 'preact/hooks';
import { NavbarButton } from './NavbarButton';

export function Header() {
	const [config, setConfig] = useState({
		appName: 'FreeTV',
		appTitle: 'FreeTV',
		smallLogo: '/freetv-small.png',
		navbar: [],
		showNavLabels: true,
	});
	const logoSrc = config.smallLogo
		? (/^(?:https?:)?\/\//.test(config.smallLogo) || config.smallLogo.startsWith('data:')
			? config.smallLogo
			: `${import.meta.env.BASE_URL}${config.smallLogo.replace(/^\/+/, '')}`)
		: undefined;

	useEffect(() => {
		let cancelled = false;

		fetch(`${import.meta.env.BASE_URL}whitelabel.config.json`)
			.then((response) => {
				if (!response.ok) throw new Error(`Could not load viewer config (${response.status})`);
				return response.json();
			})
			.then((loadedConfig) => {
				if (!cancelled) setConfig(loadedConfig);
			})
			.catch((error) => console.error(error));

		return () => { cancelled = true; };
	}, []);

	useEffect(() => {
		document.title = config.appTitle || config.appName || 'FreeTV';
	}, [config.appTitle, config.appName]);

	return (
		<header>
			<nav className="navbar fixed-top navbar-dark bg-dark" aria-label="Main navigation">
				<div className="container-fluid" style={{ minHeight: '50px' }}>

					{/* Branding */}
					<a className="navbar-brand" href="/" title={config.appName}>
						<img src={logoSrc} height="30" alt={config.appName} className="d-inline-block me-2 pb-1"/>
						<span className="pt-5 text-secondary">{config.appName}</span>
					</a>

					{/* Navbar Buttons */}
					<div className="me-auto">
						{config.navbar?.map((item) => (
							<NavbarButton
								key={item.url}
								url={item.url}
								label={item.label}
								title={item.title}
								icon={item.icon}
								showNavLabel={config.showNavLabels}
							/>
						))}
					</div>

					{/* Search Form */}
					<form className="d-flex me-auto" role="search">
						<input className="form-control form-control-sm me-1" type="search" placeholder="Search" aria-label="Search"/>
						<button className="btn btn-sm btn-outline-secondary" type="submit">Go</button>
					</form>

					{/* Playlist Selector */}
					<div className="dropdown me-4">
						<button className="btn btn-sm btn-outline-secondary playlist-selector dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							Select Playlist
						</button>
						<ul className="dropdown-menu dropdown-menu-dark">
							<li><a className="dropdown-item active" href="#">Default Playlist</a></li>
							<li><a className="dropdown-item" href="#">Holiday Playlist</a></li>
							<li><a className="dropdown-item" href="#">British TV Playlist</a></li>
							<li><a className="dropdown-item" href="#">Movies Playlist</a></li>
						</ul>
					</div>

				</div>
			</nav>
		</header>
	);
}
