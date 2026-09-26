import { render } from 'preact';
import { LocationProvider, ErrorBoundary, Router } from 'preact-iso';
import { AppProvider } from './state/AppProvider';
// Navigation
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { Footer } from './components/Footer';
// Pages
import { Home } from './pages/Home';
import { Category } from './pages/Category';
import { Shows } from './pages/Shows';
import { History } from './pages/History';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';
import { NotFound } from './pages/_404';
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
					<CategoryNav />
					<main>
						<Router>
							<Home path="/" />
							<Category path="/category/:name" />
							<History path="/history" />
							<Favorites path="/favorites" />
							<About path="/about" />
							<Shows path="/shows" /> {/* <== Temporary page */}
							<NotFound default /> {/* <== 404 page */}
						</Router>
					</main>
					<Footer />
				</AppProvider>
			</ErrorBoundary>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
