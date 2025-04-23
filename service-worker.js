// service-worker.js (simplified and robust version using async/await pattern)

const CACHE_NAME = "SEHATIN-CACHE";
const urlsToCache = [
  "https://sehatin.rizcasaur.us/",
  "https://sehatin.rizcasaur.us/index.html",
  "https://sehatin.rizcasaur.us/profile.html",
  "https://sehatin.rizcasaur.us/monitoring.html",
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

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, fallbackUrl }) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    console.warn("[SW] Network request failed for:", request.url);
    const fallbackResponse = await caches.match(fallbackUrl);
    return fallbackResponse || new Response("Offline and no fallback found", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: "https://sehatin.rizcasaur.us/index.html",
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
