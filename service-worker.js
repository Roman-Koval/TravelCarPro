// service-worker.js

const CACHE_NAME = "tcp-triplogs-v1";

const ASSETS = [
  "/Triplogs/",
  "/Triplogs/index.html",
  "/Triplogs/style.css",
  "/Triplogs/manifest.json",

  "/Triplogs/ui/theme.css",
  "/Triplogs/ui/fonts.css",
  "/Triplogs/ui/components.css",
  "/Triplogs/ui/layout.css",
  "/Triplogs/ui/animations.css",
  "/Triplogs/ui/icons.css",
  "/Triplogs/ui/nav.css",
  "/Triplogs/ui/pages.css",
  "/Triplogs/ui/app.css",

  "/Triplogs/utils/helpers.js",
  "/Triplogs/utils/storage.js",
  "/Triplogs/utils/router.js",
  "/Triplogs/utils/events.js",

  "/Triplogs/player/player.js",
  "/Triplogs/player/player-ui.js",

  "/Triplogs/ai/ai-core.js",
  "/Triplogs/ai/ai-ui.js",

  "/Triplogs/icons/icon-192.png",
  "/Triplogs/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          return cached;
        })
      );
    })
  );
});
