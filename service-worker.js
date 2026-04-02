// service-worker.js

const CACHE = "tcp-v1";

const ASSETS = [
  "/TravelCarPro/",
  "/TravelCarPro/index.html",
  "/TravelCarPro/style.css",

  "/TravelCarPro/ui/nav.css",
  "/TravelCarPro/ui/app.css",

  "/TravelCarPro/utils/router.js",
  "/TravelCarPro/utils/events.js",
  "/TravelCarPro/main.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
