import { render } from 'preact';
import { LocationProvider } from 'preact-iso';
import { AppLoader } from '@components/Loaders/AppLoader';
import { triggerAdReload } from '@/signals/adSignal';

// Trigger initial ad load after a short delay
setTimeout(() => triggerAdReload(), 500);

render(
  <LocationProvider>
    <AppLoader />
  </LocationProvider>,
  document.getElementById('app')
);

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      //.then(reg => {
        // console.log('Service worker registered:', reg.scope);
      //})
      //.catch(err => {
        // console.warn('Service worker registration failed:', err);
      //});
  });
}