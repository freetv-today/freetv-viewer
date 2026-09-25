import smallLogo from '../assets/freetv-small.png';

export function Header() {
	return (
		<header>
			<nav className="navbar fixed-top navbar-dark bg-dark" aria-label="Main navigation">
				<div className="container-fluid" style={{ minHeight: '50px' }}>

					{/* Branding */}
					<a className="navbar-brand" href="/" title="FreeTV">
						<img src={smallLogo} height="30" alt="FreeTV" className="d-inline-block me-2 pb-1"/>
						<span className="pt-5 text-success">FreeTV</span>
					</a>

					{/* Nav Buttons */}
					<div>
						<button class="btn btn-outline-success me-2" type="button">History</button>
						<button class="btn btn-outline-success me-2" type="button">Favorites</button>
						<button class="btn btn-outline-success me-2" type="button">About</button>
					</div>

					{/* Search Form */}
					<form className="d-flex" role="search">
						<input className="form-control form-control-sm me-1" type="search" placeholder="Search" aria-label="Search"/>
						<button className="btn btn-sm btn-outline-success" type="submit">Go</button>
					</form>

					{/* Playlist Selector */}
					<div className="dropdown me-4">
						<button className="btn btn-sm btn-outline-success playlist-selector dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
