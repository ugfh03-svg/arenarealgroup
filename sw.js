/* Partner Dubai PWA service worker (cache-first) */
const CACHE_NAME = 'arena-real-group-pwa-v4';
const ASSETS = [
  './',
  './index.html',
  './ads.html',
  './sitemap.xml',
  './robots.txt',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon.png'
  './assets/area_downtown.png',
  './assets/area_marina.png',
  './assets/area_palm.png',
  './assets/area_jbr.png',
  './assets/area_business_bay.png',
  './assets/area_difc.png',
  './assets/area_jumeirah.png',
  './assets/area_bluewaters.png',
  './assets/area_dubai_hills.png',
  './assets/area_arabian_ranches.png',
  './assets/area_emirates_hills.png',
  './assets/area_jvc.png',
  './assets/area_jlt.png',
  './assets/area_creek_harbour.png',
  './assets/property_1.png',
  './assets/property_2.png',
  './assets/property_3.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        try {
          const url = new URL(req.url);
          if (url.origin === self.location.origin) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
        } catch(e) {}
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
