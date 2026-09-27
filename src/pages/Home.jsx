import { CategoryNav } from '../components/CategoryNav';
import { appPath } from '../data/paths';

export function Home() {
	
	return (
		<>
			<CategoryNav />
			<section className="container text-center">
				<img src={appPath('freetv.png')} width="250" alt="FreeTV Logo" title="FreeTV" style={{ marginTop: '10vh' }}/>
				<p className="my-4">View a list of <a href={appPath('/shows')}>all shows</a> on the currently selected playlist</p>
			</section>
		</>
	);
}
