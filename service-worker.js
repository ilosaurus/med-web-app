// service-worker.js (updated with full list and robust error handling)

const CACHE_NAME = "SEHATIN-CACHE";
const urlsToCache = [
  "https://sehatin.rizcasaur.us/",
  "https://sehatin.rizcasaur.us/index.html",
  "https://sehatin.rizcasaur.us/profile.html",
  "https://sehatin.rizcasaur.us/monitoring.html",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
  "https://sehatin.rizcasaur.us/assets/images/category-consulting.svg",
  "https://sehatin.rizcasaur.us/assets/images/category-dentist.svg",
  "https://sehatin.rizcasaur.us/assets/images/category-cardiologist.svg",
  "https://sehatin.rizcasaur.us/assets/images/category-hospital.svg",
  "https://sehatin.rizcasaur.us/assets/images/category-emergency.svg",
  "https://sehatin.rizcasaur.us/assets/images/category-laboratory.svg",
  "https://sehatin.rizcasaur.us/assets/images/profil-intan.jpg",
  "https://sehatin.rizcasaur.us/assets/images/profil-helen.jpg",
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
  try {
    await cache.put(request, response.clone());
  } catch (err) {
    console.error("[SW] Failed to cache:", request.url, err);
  }
};

const cacheFirst = async ({ request, fallbackUrl }) => {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const networkResponse = await fetch(request);
    if (
      networkResponse &&
      networkResponse.status === 200 &&
      networkResponse.type === "basic"
    ) {
      putInCache(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    console.warn("[SW] Network failed for:", request.url);
    const fallback = await caches.match(fallbackUrl);
    return fallback || new Response("Offline and no fallback", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

self.addEventListener("install", (event) => {
  console.log("[SW] Installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  console.log("[SW] Fetching:", event.request.url);
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: "https://sehatin.rizcasaur.us/index.html",
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("[SW] Deleting cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
