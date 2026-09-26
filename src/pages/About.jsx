export function About() {
	const version = import.meta.env.VITE_APP_VERSION;
	return (
		<section className="container my-5">
			<h1>About FreeTV</h1>
			<p className="my-5">
				FreeTV is an open-source platform for curating, publishing, browsing, and watching hand-picked television shows and movies from the <a href="https://archive.org" rel="noopener noreferrer" target="_blank">Internet Archive</a>. The Internet Archive is a non-profit library of millions of free texts, movies, software, music, websites, and more. They host 17+ million videos and their entire catalog uses 200+ <b>Petabytes</b> of server space! This enormous collection of public-domain and classic media is great but, finding all the high quality video content you want to watch can be difficult. It's like trying to find a needle in a haystack. This is where <b>FreeTV</b> comes in. We sift through the millions of videos available and organize them into topical playlists sorted by category. The videos themselves are all hosted and streamed from the Internet Archive but, we make them easy to find. Pick a playlist, click a category, and click a title and you're instantly watching great content.</p>
			<h2>Support</h2>
			<p className="mt-3">
				Check out the FreeTV Support website at: <a href="https://support.freetv.today" className="fw-bold" rel="noopener noreferrer" target="_blank">https://support.freetv.today</a>
			</p>
			<p>
				There you can find a Quick Start Guide, Frequently Asked Questions, troubleshooting tips, and answers to a lot of questions. If you can't find what you are looking for, open a Suppport Ticket and a human being will get back to you. If you are having problems playing videos on FreeTV you should <a href="https://support.freetv.today/knowledgebase.php?article=16" rel="noopener noreferrer" target="_blank">check the network status of the Internet Archive</a>. FreeTV is dependent on the Internet Archive to stream video content. If they are having problems with their network it will effect video playback for us too. The best thing to do is try again later.
			</p>
			<p className="my-5 text-center">
				<a href="https://support.freetv.today" role="button" class="btn btn-lg btn-outline-dark" rel="noopener noreferrer" target="_blank"><i class="bi bi-patch-question"></i> Visit FreeTV Support</a>
			</p>
			<h2>Developers</h2>
			<p className="mt-3">
				If you are a software developer or system administrator you can download the software used to run FreeTV. The application uses NodeJS and was created using Preact. The back end uses PHP and MariaDB. You can find the <a href="https://github.com/freetv-today" rel="noopener noreferrer" target="_blank">FreeTV Today organization site on Github</a>. There you will find all the code repositories and detailed instructions on how to get FreeTV running locally on your machine. You're also free to fork the code, make changes, and use it however you want.
			</p>
			<p>
				We are working to make it easier to customize and run your own instance of FreeTV with your own custom viewer (which points to your server instead of ours). Right now this all has to be done manually in the code. But, we are working towards a white label initiative would should provide a simple and easy way to do this. We are also working on better tooling for developers to make it easier to get your environment set up so you can customize the code. Stay tuned for these features in future releases. We also welcome bug reports and new features. Just fork the appropriate repo, create a new git branch, make your code changes, then open a pull request on Github to submit your modifications.
			</p>
			<p className="my-5 text-center">
				<a href="https://github.com/freetv-today" role="button" class="btn btn-lg btn-outline-primary" rel="noopener noreferrer" target="_blank"><i class="bi bi-github"></i> Find Us on Github</a>
			</p>
			<h2>License</h2>
			<p className="mt-3">
				FreeTV is licensed under the <a href="https://opensource.org/license/GPL-3.0" rel="noopener noreferrer" target="_blank">GNU General Public License version 3</a>.
			</p>
			<p className="mb-5">
				GPL v3 Requirements:
				<ol>
					<li>Anyone can copy, modify and distribute this software.</li>
					<li>You have to include the license and copyright notice with each and every distribution.</li>
					<li>You can use this software privately.</li>
					<li>You can use this software for commercial purposes.</li>
					<li>If you modify it, you have to indicate changes made to the code.</li>
					<li>Any modifications of this code base must be distributed with the same license: GPLv3.</li>
					<li>This software is provided without warranty.</li>
					<li>The software author or license can not be held liable for any damages.</li>
				</ol>
			</p>
			<h2>Version Info</h2>
			<p className="mt-3 mb-5">
				FreeTV Viewer version {version}
			</p>
		</section>
	);
}
