import { NavbarVideoPlayback } from '@components/Navigation/NavbarVideoPlayback';
import { useEffect } from 'preact/hooks';

// VidviewLayout.jsx - minimal wrapper that just imports CSS
export function LayoutVidviewer({ children }) {

  useEffect(() => {
    // Set overflow hidden when video player is active
    document.body.style.overflow = 'hidden';
    // Reset to auto when leaving the video player page
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <NavbarVideoPlayback />
      {children}
    </>
  );
}