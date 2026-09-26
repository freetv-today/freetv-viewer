import { CategoryNav } from '../components/CategoryNav';

export function Home() {
	
	return (
		<>
			<CategoryNav />
			<section className="container text-center">
				<img src="/freetv.png" width="250" alt="FreeTV Logo" title="FreeTV" style={{ marginTop: '10vh' }}/>
				<p className="my-4">View a <a href="/shows">list of FreeTV shows</a></p>
			</section>
		</>
	);
}
