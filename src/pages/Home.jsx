import largeLogo from '../assets/freetv.png';

export function Home() {
	
	return (
		<section className="container text-center">
			<img src={largeLogo} width="250" alt="FreeTV Logo" title="FreeTV" style={{ marginTop: '10vh' }}/>
			<p className="my-4">View a <a href="/shows">list of FreeTV shows</a></p>
		</section>
	);
}
