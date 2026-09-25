import largeLogo from '../assets/freetv.png';

export function Home() {
	
	return (
		<section className="container text-center">
			<img src={largeLogo} width="250" alt="FreeTV Logo" title="FreeTV" style={{ marginTop: '10vh' }}/>
		</section>
	);
}
