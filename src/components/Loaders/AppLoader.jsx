import { useState, useEffect } from 'preact/hooks';
import { triggerToast } from '@/signals/toastSignal';
import { ConfigProvider } from '@/context/ConfigContext';
import { PlaylistProvider } from '@/context/PlaylistContext';
import { App } from '@components/App';
import { SpinnerLoadingAppData } from '@components/Loaders/SpinnerLoadingAppData';
import { ErrorPage } from '@pages/ErrorPage';
import { shouldUpdateData, enforceMinLoadingTime, formatDateTime } from '@/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEBUG_MODE } from '@/debug';

// Loads config and show data from JSON then loads App and shows default page
export function AppLoader() {

    const infoFile = '/assets/app.nfo';
    const configFile = '/config.json';
    const minLoadingTime = 1200;  // show spinner for 1.2 seconds (minimum)
    const [config, setConfig] = useLocalStorage('configData', null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Listen for service worker update messages
        if ('serviceWorker' in navigator && navigator.serviceWorker) {
            navigator.serviceWorker.addEventListener('message', event => {
                if (event.data && event.data.type === 'DATA_UPDATE_AVAILABLE') {
                    console.error('[AppLoader] Received DATA_UPDATE_AVAILABLE from service worker', { loading, pathname: window.location.pathname });
                }
                if (
                    event.data &&
                    event.data.type === 'DATA_UPDATE_AVAILABLE' &&
                    !loading // Only show toast after initial load
                ) {
                    if (window.location.pathname !== '/nowplaying') {
                        triggerToast('New data is available! The playlist or settings have changed.', 'info');
                        // Optionally, reload or trigger update logic here
                        // window.location.reload();
                    }
                }
            });
        }
        async function loadConfig() {

            // Storage check
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
            } catch {
                let msg = 'Storage test failed! Please enable storage on your device and reload.';
                setError({
                    type: 'Storage Error',
                    message: msg,
                });
                console.error(msg);
                setLoading(false);
                return;
            }

            let configData = config;
            let needsUpdate = false;
            let fetchedConfig = null;
            try {

                // Fetch config data
                // console.log('Fetching config file:', configFile);
                const response = await fetch(configFile);
                if (!response.ok) {
                    // console.error('Config fetch failed:', response.status, response.statusText);
                    throw new Error(`Failed to fetch config file: ${response.status} ${response.statusText}`);
                }
                
                try {
                    fetchedConfig = await response.json();
                    // console.log('Config file loaded successfully');
                } catch (jsonError) {
                    // console.error('Config JSON parse error:', jsonError);
                    throw new Error('Config file contains invalid JSON');
                }
                
                // Fetch app info data
                let fetchedInfo = null
                // console.log('Fetching app info file:', infoFile);
                const appinfo = await fetch(infoFile);
                if (!appinfo.ok) {
                    // console.error('App info fetch failed:', appinfo.status, appinfo.statusText);
                    throw new Error(`Failed to fetch app info file: ${appinfo.status} ${appinfo.statusText}`);
                }
                
                try {
                    fetchedInfo = await appinfo.json();
                    // console.log('App info file loaded successfully');
                } catch (jsonError) {
                    // console.error('App info JSON parse error:', jsonError);
                    throw new Error('App info file contains invalid JSON');
                }
                
                localStorage.setItem('appInfo', JSON.stringify(fetchedInfo));  

                // If no config in storage or config is outdated, update it
                if (!config || shouldUpdateData(config, fetchedConfig)) {
                    needsUpdate = true;
                    configData = fetchedConfig;
                    setConfig(fetchedConfig);

                    // DEV NOTE: use the local flag directly because hooks cannot be called here.
                    if (DEBUG_MODE) {
                        // if debug mode is true, start logging
                        if (fetchedInfo) {
                            console.log(`Welcome to ${fetchedInfo.name} (version ${fetchedInfo.version})`);
                            console.log('DEBUG MODE: %cON', 'font-weight: bold; color: lime;');
                        }
                    } else {
                        // if debug mode is false, show app info in console instead
                        if (fetchedInfo) {
                            console.groupCollapsed(`Application Info`);
                            console.log(`Name: ${fetchedInfo.name}`);
                            console.log(`Version: ${fetchedInfo.version}`);
                            console.log(`Author: ${fetchedInfo.author}`);
                            console.log(`Email: ${fetchedInfo.email}`);
                            console.log(`Last Updated: ${formatDateTime(configData.lastupdated)}`);
                            console.groupEnd();                       
                        }
                    }
                }
            } catch (error) {
                // Log the specific error for developers
                console.error('Configuration loading failed:', error.message);
                console.error('Full error details:', error);
                
                // User-friendly message (same as before)
                let msg = 'Unable to load configuration file. Please try again. If the problem persists, contact: support@freetv.today.';
                setError({
                    type: 'Configuration Error',
                    message: msg,
                });
                console.error('User shown error:', msg);
                setLoading(false);
                return;
            }
            if (needsUpdate) {
                if (DEBUG_MODE) {
                    console.log('Loading configuration data...');
                }
                const startTime = Date.now();
                await enforceMinLoadingTime(startTime, minLoadingTime);
            }
            
            setLoading(false);

            // Handle anchor scrolling for direct URLs (e.g., /help#version)
            if (window.location.hash) {
                setTimeout(() => {
                    const elementId = window.location.hash.substring(1); // Remove the '#'
                    const element = document.getElementById(elementId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100); // Small delay to ensure the DOM is fully rendered
            }
        }
        loadConfig();
    }, []);

    if (loading) return <SpinnerLoadingAppData />;
    if (error) return <ErrorPage type={error.type} message={error.message} />;

    return (
        <ConfigProvider config={config}>
            <PlaylistProvider>
                <App />
            </PlaylistProvider>
        </ConfigProvider>
    );
}
