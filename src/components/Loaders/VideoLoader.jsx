import { useEffect, useState, useRef } from 'preact/hooks';
import { SpinnerLoadingVideo } from '@components/Loaders/SpinnerLoadingVideo';
import { Link } from '@components/Navigation/Link';

/**
 * VideoLoader - Generic video loader with spinner, timeout, and error message
 * Props:
 *   src: string (iframe src)
 *   title: string (video title)
 *   onLoad: function (optional, called when iframe loads)
 *   iframeProps: object (optional, extra props for iframe)
 *   timeoutMs: number (timeout in ms, default 90000)
 */

export function VideoLoader({
  src,
  title,
  onLoad: onLoadProp,
  iframeProps = {},
  timeoutMs = 90000,  // 90 seconds
}) {

  const [loading, setLoading] = useState(true);
  const [timeoutError, setTimeoutError] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (loading && !timeoutError) {
      timeoutRef.current = setTimeout(() => {
        setTimeoutError(true);
        setLoading(false);
      }, timeoutMs);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loading, timeoutError, timeoutMs]);

  const handleIframeLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoading(false);
    setTimeoutError(false);
    if (onLoadProp) onLoadProp();
  };

  if (timeoutError) {
    return (
      <div className="container text-center my-5 p-4 timeouterr">
        <h2 className="text-danger mb-4">Timeout Error: video failed to load!</h2>
        <p className="text-danger">
          The Internet Archive server did not respond within {timeoutMs / 1000} seconds. Please <b>check your internet connection</b> and reload the page to try again. If you keep having problems, check out the <Link href="/help" className="primary-link">Help</Link> page for more troubleshooting tips.
        </p>
        <p className="my-4 opacity-75"><img src="/assets/clock.svg" width="65" alt="clock" title="Timeout Error!" /></p>
      </div>
    );
  }

  console.log(`Archive URL is: ${src}`);

  return (
    <>
      {loading && <SpinnerLoadingVideo title={title.replace(/_/g, ' ')} />}
      <iframe
        src={src}
        width="640"
        height="480"
        style={{ 
          display: loading ? 'none' : 'block'
        }}
        onLoad={handleIframeLoad}
        title={title}
        {...iframeProps}
      />
    </>
  );
}
