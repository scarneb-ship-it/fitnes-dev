const CACHE_NAME = 'ironplan-v24';
const urlsToCache = [
  '.',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  // Картинки для упражнений. Если каких-то файлов нет — просто пропустятся.
  'icons/prisedansgantel.jpg',
  'icons/rumynskatyaga.jpg',
  'icons/otchimania.jpg',
  'icons/greblavnaklon.jpg',
  'icons/godicnmostik.jpg',
  'icons/podtiagivaniechirokim.jpg',
  'icons/planka.jpg',
  'icons/bolgarskisplitpris.jpg',
  'icons/mostiknaodnounage.jpg',
  'icons/chimgantelnadgolov.jpg',
  'icons/podemgantelvstoronu.jpg',
  'icons/podtiagivaniaobratnimhvat.jpg',
  'icons/clamshell.jpg',
  'icons/csuknaspine.jpg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        urlsToCache.map(url => cache.add(url).catch(() => {}))
      )
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
