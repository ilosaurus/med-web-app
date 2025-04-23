const CACHE_NAME = "SEHATIN-CACHE";
const urlsToCache = [
  "https://sehatin.rizcasaur.us/",
  "https://sehatin.rizcasaur.us/index.html",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
  "https://sehatin.rizcasaur.us/assets/images/profil-intan.jpg", 
  "https://sehatin.rizcasaur.us/assets/images/web-app-manifest-192x192.png", 
  "https://sehatin.rizcasaur.us/assets/images/web-app-manifest-512x512.png",
  "https://sehatin.rizcasaur.us/manifest.json"
];

// Install the service worker and cache the assets
self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching files...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercept fetch requests and serve cached content if available
self.addEventListener("fetch", (event) => {
  console.log(`Fetching: ${event.request.url}`);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        // Optionally, cache the new response for future use
        if (event.request.url.startsWith('https://sehatin.rizcasaur.us/')) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse);
          });
        }
        return networkResponse;
      });
    })
  );
});

// Clean up old caches and activate the service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]; // Array of cache versions to retain
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});
