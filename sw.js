const CACHE_NAME = 'certifly-v1.4a';
const APP_SHELL = 'index.html';
const ASSETS = [
  'index.html',
  'app.js',
  'css/style.css',
  'js/qr-scanner.umd.min.js',
  'js/qr-scanner-worker.min.js',
  'https://cdn.tailwindcss.com',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Handle API/Proxy requests: Network only, no caching
  if (url.pathname.includes('/api/proxy')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. Navigation Fallback: If opening the app while offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Network failed (offline), return the cached App Shell
        return caches.match(APP_SHELL);
      })
    );
    return;
  }

  // 3. Static Assets: Cache-first strategy
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
})
