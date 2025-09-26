import { useEffect, useState } from 'preact/hooks';

/**
 * PWAInstallPrompt - Shows a custom install prompt bar for PWA installation
 * Usage: Place <PWAInstallPrompt /> near the top of your app (e.g. in App.jsx)
 */
export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      // Optionally handle outcome (accepted/dismissed)
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  // Optionally, add iOS detection and show instructions for Safari users
  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  // @ts-ignore: 'standalone' is a non-standard iOS Safari property
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  if (isInStandaloneMode) return null; // Don't show if already installed

  return (
    <>
      {showPrompt && !isIOS && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#222', color: '#fff', padding: '1em', zIndex: 1000, textAlign: 'center' }}>
          <span>Install FreeTV Viewer for a better experience!</span>
          <button style={{ marginLeft: '1em' }} className="btn btn-primary btn-sm" onClick={handleInstallClick}>
            Install
          </button>
          <button style={{ marginLeft: '0.5em' }} className="btn btn-secondary btn-sm" onClick={() => setShowPrompt(false)}>
            Dismiss
          </button>
        </div>
      )}
      {isIOS && !isInStandaloneMode && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#222', color: '#fff', padding: '1em', zIndex: 1000, textAlign: 'center' }}>
          <span>To install FreeTV Viewer, tap <span style={{fontWeight:'bold'}}>Share</span> and then <span style={{fontWeight:'bold'}}>'Add to Home Screen'</span>.</span>
          <button style={{ marginLeft: '1em' }} className="btn btn-secondary btn-sm" onClick={() => setShowPrompt(false)}>
            Dismiss
          </button>
        </div>
      )}
    </>
  );
}
