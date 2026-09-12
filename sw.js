const CACHE_NAME = 'fitness-her-v10';
const urlsToCache = [
  '.',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',

  // Логотип приложения (PNG)
  'images/logotipt.png',

  // Картинки упражнений
  'images/prisedsgantelgrud.jpg',
  'images/ruminskaitiaga.jpg',
  'images/iagodichnmostiksgant.jpg',
  'images/otchimotopor.jpg',
  'images/tiagasgantelilevaia.jpg',
  'images/tiagasgantelipravaia.jpg',
  'images/chuknaspine.jpg',
  'images/otvedenienogivstoronu.jpg',
  'images/rakuchkalechanaboku.jpg',
  'images/bolgarskisplitprised.jpg',
  'images/sumoprisedsgantel.jpg',
  'images/iagodichnimostiknaodnoinoge.jpg',
  'images/podtiagivaniaprogressia.jpg',
  'images/razvedenieganteleivnaklone.jpg',
  'images/podiomiruky-t-vlechanachiv.jpg',
  'images/planka.jpg'
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
