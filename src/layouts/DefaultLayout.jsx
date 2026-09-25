import { Header } from '../components/Header';
import { CategoryNav } from '../components/CategoryNav';
import { Footer } from '../components/Footer';

export default function DefaultLayout({ children }) {
	return (
		<>
			<Header />
			<CategoryNav />
			<main>{children}</main>
			<Footer />
		</>
	);
}
