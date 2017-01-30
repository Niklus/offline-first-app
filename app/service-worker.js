var cacheName = 'my-static-cache-1';
var filesToCache = [
  '/',
  '/images/touch/apple-touch-icon.png',
  '/images/touch/chrome-touch-icon-192x192.png',
  '/images/touch/icon-128x128.png',
  '/images/touch/ms-touch-icon-144x144-precomposed.png',
  '/scripts/app.js',
  '/scripts/main.js',
  '/scripts/libs/localforage.min.js',
  '/scripts/libs/vue-material.js',
  '/scripts/libs/vue.min.js',
  '/styles/libs/vue-material.css',
  '/styles/libs/main.css',
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(cacheName)
    .then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );  
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
