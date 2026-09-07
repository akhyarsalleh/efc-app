// CertiFly™ Service Worker v1.4a
const CACHE_NAME = 'certifly-cache-v1.4a';

// ASSET LIST: All local dependencies needed to run the app offline
const ASSETS_TO_CACHE = [
  'index.html',
  'app.js',
  'css/style.css',
  'manifest.json',
  'js/qr-scanner.umd.min.js',
  'js/qr-scanner-worker.min.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  //'icons/splash-1179x2556.png',
  //'icons/splash-1290x2796.png',
  //'icons/splash-1125x2436.png'
];

// INSTALL: Pre-cache the App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('CertiFly: Pre-caching App Shell assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Force the waiting service worker to become the active one
  self.skipWaiting();
});

// ACTIVATE: Clean up old versions of the cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('CertiFly: Clearing old cache version...', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Immediately take control of all open client tabs
  return self.clients.claim();
});

// FETCH: The Core Logic (Plan A, B, and C)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Plan A: Try to find the file in the local device cache
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Plan B: If not in cache, try to fetch it from the network
      return fetch(event.request).then((networkResponse) => {
        // Optional: Cache new successful requests on the fly
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Plan C: THE FALLBACK
      // If network fails (offline) and not in cache, serve the main App Shell
      // This prevents the "Safari can't open page" alert on iOS
      if (event.request.mode === 'navigate') {
        return caches.match('index.html');
      }
    })
  );
});
