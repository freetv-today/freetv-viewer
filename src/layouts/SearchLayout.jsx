import { Header } from '../components/Header';

// Search pages keep the navbar but do not show the Categories strip.

export default function SearchLayout({ children }) {
	return (
		<>
			<Header />
			<main>{children}</main>
		</>
	);
}
