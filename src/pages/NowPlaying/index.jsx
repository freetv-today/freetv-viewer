import { useEffect } from 'preact/hooks';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { VideoLoader } from '@components/Loaders/VideoLoader';
import { Link } from '@components/Navigation/Link';
import { useDebugLog } from '@hooks/useDebugLog';
import { showVidNavBtnsSignal } from '@signals/showVidNavBtns';
import { logShowEnd } from '@/utils';

export function NowPlaying() {

  const [currentVid] = useLocalStorage('currentVid', null);
  const [embedPlaylist] = useLocalStorage('embedPlaylist', true);
  const log = useDebugLog();

  // Effect to log show end and clear currentVid on unmount
  useEffect(() => {
    return () => {
      if (currentVid && currentVid.imdb) {
        logShowEnd(currentVid.imdb);
      }
      localStorage.removeItem('currentVid');
      showVidNavBtnsSignal.value = false;
    };
  }, []);

  // if user returns to the route and there's no currentVid data
  if (!currentVid) {
    return (
      <div className="container text-center my-5">
        <h2 className="text-danger mb-4">No data for last-watched video</h2>
        <p>You can only return to (or reload) this page while the current video is playing. After you navigate away from the page you'll have to reload the video. Check the <Link href="/recent" className="link-primary">Recent</Link> page for a list of shows that you've recently watched. Click on a show title to re-queue and start playing the video.</p>
        <p className="mt-4"><span className="fs-4">❔</span><br/><img src="/assets/mehface.svg" width="65" /></p>
      </div>
    );
  }

  const { identifier, title } = currentVid;

  useEffect(() => {
    if (title) { document.title = `Free TV: ${title}`; } 
    else { document.title = "Free TV"; }
  }, [title]);

  // // Responsive playlist height based on screen size
  // const getPlaylistHeight = () => {
  //   if (typeof window === 'undefined') return 300;
  //   const width = window.innerWidth;
  //   if (width < 576) return 600; // Extra small screens - larger playlist
  //   if (width < 992) return 450; // Small to medium screens
  //   return 350; // Large screens
  // };

  // const playlistHeight = getPlaylistHeight();
  
  const archiveUrl = embedPlaylist
    ? `https://archive.org/embed/${identifier}?playlist=1`
    : `https://archive.org/embed/${identifier}`;

  return (
    <div className="vidViewWrapper">
        <VideoLoader
          src={archiveUrl}
          title={title}
          onLoad={() => {
            showVidNavBtnsSignal.value = true;
            if (title) log(`Video ${title} loaded`);
          }}
          iframeProps={{ id: 'vidviewer' }}
        />
    </div>
  );
}