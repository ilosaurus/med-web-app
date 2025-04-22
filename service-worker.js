const CACHE_NAME = "medical-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/assets/css/bootstrap.min.css",
  "/assets/js/bootstrap.bundle.min.js",
  "/assets/images/profil-intan.jpg", 
  "/assets/images/web-app-manifest-192x192.png", 
  "/assets/images/web-app-manifest-512x512.png"
];

// Install the service worker and cache the assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercept fetch requests and serve cached content if available
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
