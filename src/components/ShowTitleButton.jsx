export function ShowTitleButton({ title = 'Show Title' }) {
	return (
        <div className="btn-group dropend mb-1">
            <button type="button" className="btn btn-outline-secondary" title={title}>
                {title}
            </button>
            <button type="button" className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                <span className="visually-hidden">Toggle Menu</span>
            </button>
            <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">About this show</a></li>
                <li><a className="dropdown-item" href="#">Add to Favorites</a></li>
                <li><a className="dropdown-item link-danger" href="#">Report a problem</a></li>
                <li><a className="dropdown-item" href="#">Download files</a></li>
            </ul>
        </div>
	);
}
