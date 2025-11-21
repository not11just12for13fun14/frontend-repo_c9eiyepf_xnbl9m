/* Simple PWA Service Worker for Vite app */
const CACHE_VERSION = 'v1.0.0';
const APP_CACHE = `app-cache-${CACHE_VERSION}`;
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== APP_CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

// Network-first for API, stale-while-revalidate for others
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith('/auth') || url.pathname.startsWith('/uploads') || url.pathname.startsWith('/sync')) {
    // Don't cache auth or upload routes
    return;
  }

  if (url.origin !== self.location.origin) return; // only handle same-origin

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const cloned = networkResponse.clone();
          caches.open(APP_CACHE).then((cache) => cache.put(request, cloned));
        }
        return networkResponse;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
