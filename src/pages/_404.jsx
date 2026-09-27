import { appPath } from '../data/paths';

export function NotFound() {
	return (
		<section className="text-center mt-5">
			<h1>404: Page Not Found</h1>
			<p className="my-5">The page you're looking for could not be found. Check the URL and try again.</p>
			<p className="mt-5"><a href={appPath()}>Home</a></p>
		</section>
	);
}
