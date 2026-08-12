import { useDebugLog } from '@/hooks/useDebugLog';
import { useConfig } from '@/context/ConfigContext';
import { useEffect, useState } from 'preact/hooks';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { adReloadSignal, triggerAdReload } from '@/signals/adSignal';

export function AdBar() {

    const [showAdMsg, setShowAdMsg] = useLocalStorage('showAdMsg', 0);
    const log = useDebugLog();
    const { show_ads } = useConfig();
    const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 767.98px)').matches);

    // Listen for screen size changes (modern API only)
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767.98px)');
        const handleResize = () => {
            setIsMobile(mediaQuery.matches);
            setTimeout(() => triggerAdReload(), 100);
        };
        mediaQuery.addEventListener('change', handleResize);
        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, []);

    // Show ad message once
    useEffect(() => {
        if (show_ads && !showAdMsg) {
            log(`Ads are enabled.`);
            setShowAdMsg(1);
        }
    }, [show_ads, showAdMsg]);

    // Use adReloadSignal to force re-render
    if (!show_ads) {
        return null;
    }

    // Select ad file and dimensions
    const adFile = isMobile ? '/assets/ads/small-ad.html' : '/assets/ads/large-ad.html';
    const adWidth = isMobile ? 468 : 728;
    const adHeight = isMobile ? 60 : 90;
    const adClass = isMobile ? 'smallAd' : 'largeAd';

    return (
        <div className="container-fluid text-center mt-2 mb-3">
            <div className="row">
                <div className="col d-flex justify-content-center">
                    <iframe
                        key={adReloadSignal.value}
                        data-timestamp={adReloadSignal.value}
                        className={adClass}
                        src={adFile}
                        title="Adsterra Banner"
                        width={adWidth}
                        height={adHeight}
                        style={{ border: 'none', background: '#fafafa', display: 'block' }}
                    />
                </div>
            </div>
        </div>
    );
}