import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { render } from 'preact';
import { LocationProvider, ErrorBoundary, Router, lazy } from 'preact-iso';
import DefaultLayout from './layouts/DefaultLayout';
import { Home } from './pages/Home';
import MinimalLayout from './layouts/MinimalLayout';
import './style.css';

const NotFound = lazy(() => import('./pages/_404'));

function HomePage() {
	return (
		<DefaultLayout>
			<Home />
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
					<NotFoundPage default />
				</Router>
			</ErrorBoundary>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
