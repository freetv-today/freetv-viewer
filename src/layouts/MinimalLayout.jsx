import { Header } from '../components/Header';

export default function MinimalLayout({ children }) {
	return (
		<>
			<Header />
			<main>{children}</main>
		</>
	);
}
