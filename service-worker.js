const CACHE_NAME = "SEHATIN-CACHE";
const urlsToCache = [
  "https://sehatin.rizcasaur.us/",
  "https://sehatin.rizcasaur.us/index.html",
  "https://sehatin.rizcasaur.us/assets/css/bootstrap.min.css",
  "https://sehatin.rizcasaur.us/assets/js/bootstrap.bundle.min.js",
  "https://sehatin.rizcasaur.us/assets/images/profil-intan.jpg", 
  "https://sehatin.rizcasaur.us/assets/images/web-app-manifest-192x192.png", 
  "https://sehatin.rizcasaur.us/assets/images/web-app-manifest-512x512.png"
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
