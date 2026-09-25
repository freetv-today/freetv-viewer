import { render } from 'preact';
import { LocationProvider, ErrorBoundary, Router, lazy } from 'preact-iso';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DefaultLayout from './layouts/DefaultLayout';
import MinimalLayout from './layouts/MinimalLayout';
import { Home } from './pages/Home';
import { Shows } from './pages/Shows';
import { History } from './pages/History';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';
import { NotFound } from './pages/_404';
import './style.css';

function HomePage() {
	return (
		<DefaultLayout>
			<Home />
		</DefaultLayout>
	);
}

function HistoryPage() {
	return (
		<MinimalLayout>
			<History />
		</MinimalLayout>
	);
}

function FavoritesPage() {
	return (
		<MinimalLayout>
			<Favorites />
		</MinimalLayout>
	);
}

function AboutPage() {
	return (
		<MinimalLayout>
			<About />
		</MinimalLayout>
	);
}

// A temporary page to demonstrate fetching catalog data
function ShowsPage() {
	return (
		<DefaultLayout>
			<Shows />
		</DefaultLayout>
	);
}

function NotFoundPage() {
	return (
		<MinimalLayout>
			<NotFound />
		</MinimalLayout>
	);
}

export function App() {
	return (
		<LocationProvider>
			<ErrorBoundary>
				<Router>
					<HomePage path="/" />
					<HistoryPage path="/history" />
					<FavoritesPage path="/favorites" />
					<AboutPage path="/about" />
					<ShowsPage path="/shows" /> {/* <== Temporary page */}
					<NotFoundPage default /> {/* <== 404 page */}
				</Router>
			</ErrorBoundary>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
