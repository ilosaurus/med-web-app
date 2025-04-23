// service-worker.js (fully fixed version with better error handling and extended cache)

const CACHE_NAME = "SEHATIN-CACHE";
const urlsToCache = [
  "https://sehatin.rizcasaur.us/",
  "https://sehatin.rizcasaur.us/index.html",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
  "https://sehatin.rizcasaur.us/assets/images/profil-intan.jpg",
  "https://sehatin.rizcasaur.us/assets/images/profil-jeshica.jpg",
  "https://sehatin.rizcasaur.us/assets/images/profil-dian.jpg",
  "https://sehatin.rizcasaur.us/assets/images/profil-alfia.jpg",
  "https://sehatin.rizcasaur.us/assets/images/web-app-manifest-192x192.png",
  "https://sehatin.rizcasaur.us/assets/images/web-app-manifest-512x512.png",
  "https://sehatin.rizcasaur.us/assets/images/favicon.ico",
  "https://sehatin.rizcasaur.us/assets/images/favicon.svg",
  "https://sehatin.rizcasaur.us/assets/images/favicon-96x96.png",
  "https://sehatin.rizcasaur.us/manifest.json"
];

// Install the service worker and cache the assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching files...");
      return cache.addAll(urlsToCache);
    }).catch((error) => console.error("[SW] Cache addAll error:", error))
  );
});

// Intercept fetch requests
self.addEventListener("fetch", (event) => {
  console.log(`[SW] Fetching: ${event.request.url}`);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log(`[SW] Serving from cache: ${event.request.url}`);
        return cachedResponse;
      }

      return fetch(event.request, { cache: "no-store" })
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === "opaque") {
            console.warn(`[SW] Skipping cache due to bad response: ${event.request.url}`);
            return networkResponse;
          }

          const responseClone = networkResponse.clone();

          if (event.request.url.startsWith("https://sehatin.rizcasaur.us/")) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
              console.log(`[SW] Cached: ${event.request.url}`);
            });
          }

          return networkResponse;
        })
        .catch((error) => {
          console.error(`[SW] Fetch failed: ${event.request.url}`, error);
          return new Response("Service is unavailable while offline", {
            status: 503,
            statusText: "Offline",
            headers: new Headers({ "Content-Type": "text/plain" })
          });
        });
    })
  );
});

// Activate and clean old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
