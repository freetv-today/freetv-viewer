import { useLocation } from 'preact-iso';
import { ArchivePlayer } from '../components/player/ArchivePlayer';
import { useAppContext } from '../state/AppProvider';
import { appPath } from '../data/paths';

export function NowPlaying() {
	const { currentVideo } = useAppContext();
	const { route } = useLocation();

	if (!currentVideo) {
		return (
			<section className="ftv-player ftv-player-empty">
				<h1>No show is queued</h1>
				<p>Choose a show from a category to start playback.</p>
				<button type="button" className="btn btn-outline-light" onClick={() => route(appPath())}>FreeTV Home</button>
			</section>
		);
	}

	return <ArchivePlayer video={currentVideo} onBack={() => route(appPath())} />;
}
