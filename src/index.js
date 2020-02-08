import './components/tile';
import './components/game-manager';
import './assets/css/style.css';
import './assets/images/bomb.png';
import './assets/images/time.png';
import './assets/images/icons/icon-72x72.png';
import './assets/images/icons/icon-96x96.png';
import './assets/images/icons/icon-128x128.png';
import './assets/images/icons/icon-144x144.png';
import './assets/images/icons/icon-152x152.png';
import './assets/images/icons/icon-192x192.png';
import './assets/images/icons/icon-384x384.png';
import './assets/images/icons/icon-512x512.png';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
