const CACHE_NAME = 'ironplan-v23';
const urlsToCache = [
  '.',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  // Картинки для упражнений. Если каких-то файлов нет — просто пропустятся.
  'icons/prisedansgantel.jpg',            // гоблет-присед
  'icons/rumynskatyaga.jpg',              // румынская тяга
  'icons/otchimania.jpg',                 // отжимания от опоры
  'icons/greblavnaklon.jpg',              // тяга гантели в наклоне
  'icons/godicnmostik.jpg',               // ягодичный мост
  'icons/podtiagivaniechirokim.jpg',      // вис на турнике
  'icons/planka.jpg',                     // планка
  'icons/bolgarskisplitpris.jpg',         // болгарский сплит-присед
  'icons/mostiknaodnounage.jpg',          // ягодичный мост одной ногой
  'icons/chimgantelnadgolov.jpg',         // жим гантелей стоя/сидя
  'icons/podemgantelvstoronu.jpg',        // разведения в наклоне
  'icons/podtiagivaniaobratnimhvat.jpg',  // негативы подтягиваний
  'icons/clamshell.jpg',                  // разведение коленей лёжа
  'icons/csuknaspine.jpg'                 // dead bug / птица-собака
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
