// Ally’s Pup Café service worker: caches the game so it works offline
const CACHE = 'pupcafe-1.0.0.20261124.1628';
const FILES = ['./', 'index.html', 'css/style.css', 'js/version.js', 'js/data.js', 'js/plush.js', 'js/dogs.js', 'js/scenes.js', 'js/audio.js', 'js/suggest.js', 'js/game.js',
  'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
// Network first so updates arrive, cache as the offline fallback
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('version.json')) return;
  e.respondWith(fetch(e.request).then((r) => {
    const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
