const CACHE_NAME = 'certifly-cache-v1.4a';
const ASSETS_TO_CACHE = [
  'v4a.html',
  'v4a.js',
  'js/qr-scanner.umd.min.js',
  'js/qr-scanner-worker.min.js',
  'https://cdn.tailwindcss.com',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'manifest.json'
];

// Install Event: Caches the core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell Assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Cleans up old caches if we update CACHE_NAME
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing Old Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First for static assets, Network-First for API
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip caching Vercel proxy API queries (we always want live pilot database checks)
  if (url.pathname.includes('/api/proxy') || url.hostname.includes('vercel.app')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback response when offline and querying proxy
        return new Response(
          JSON.stringify({ error: "offline", message: "You are currently offline. Live pilot check is unavailable." }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Cache-First, falling back to network strategy for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Dynamically add new successful requests to cache
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
