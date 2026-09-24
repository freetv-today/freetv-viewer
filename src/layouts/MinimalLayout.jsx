import { Header } from '../components/Header';

// Full-page layout: keep the navbar and give the page the full content area.
export default function MinimalLayout({ children }) {
	return (
		<>
			<Header />
			<main>{children}</main>
		</>
	);
}
