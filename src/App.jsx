import { render } from 'preact';
import { LocationProvider, ErrorBoundary, Router } from 'preact-iso';
import { AppProvider } from './state/AppProvider';
// Navigation
import { Header } from './components/Header';
import { Footer } from './components/Footer';
// Pages
import { Home } from './pages/Home';
import { Category } from './pages/Category';
import { Shows } from './pages/Shows';
import { History } from './pages/History';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';
import { SearchResults } from './pages/SearchResults';
import { NowPlaying } from './pages/NowPlaying';
import { NotFound } from './pages/_404';
import { appPath } from './data/paths';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Custom styles
import './style.css';

export function App() {

	return (
		<LocationProvider>
			<ErrorBoundary>
				<AppProvider>
					<Header />
					<main>
						<Router>
							<Home path={appPath()} />
							<Category path={appPath('/category/:name')} />
							<History path={appPath('/history')} />
							<SearchResults path={appPath('/search')} />
							<Favorites path={appPath('/favorites')} />
							<About path={appPath('/about')} />
							<NowPlaying path={appPath('/nowplaying')} />
							<Shows path={appPath('/shows')} />
							<NotFound default />
						</Router>
					</main>
					<Footer />
				</AppProvider>
			</ErrorBoundary>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
