import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { render } from 'preact';
import { LocationProvider, ErrorBoundary, Router, lazy } from 'preact-iso';
import DefaultLayout from './layouts/DefaultLayout';
import MinimalLayout from './layouts/MinimalLayout';
import { Home } from './pages/Home';
import { Shows } from './pages/Shows';
import { NotFound } from './pages/_404';
import './style.css';

function HomePage() {
	return (
		<DefaultLayout>
			<Home />
		</DefaultLayout>
	);
}

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
					<ShowsPage path="/shows" />
					<NotFoundPage default />
				</Router>
			</ErrorBoundary>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
