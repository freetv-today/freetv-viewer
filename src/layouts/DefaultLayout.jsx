import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function DefaultLayout({ children }) {
	return (
		<>
			<Header />
			<nav className="border-bottom bg-light" aria-label="Categories">
				<div className="container-fluid py-2">Categories</div>
			</nav>
			<main>{children}</main>
			<Footer />
		</>
	);
}
