// service-worker.js

const CACHE_NAME = "tcp-v2";
const ASSETS = [
  "/T/",
  "/T/index.html",
  "/T/style.css",
  "/T/manifest.json",

  "/T/ui/theme.css",
  "/T/ui/fonts.css",
  "/T/ui/components.css",
  "/T/ui/layout.css",
  "/T/ui/animations.css",
  "/T/ui/icons.css",
  "/T/ui/nav.css",
  "/T/ui/pages.css",
  "/T/ui/app.css",

  "/T/utils/helpers.js",
  "/T/utils/storage.js",
  "/T/utils/router.js",
  "/T/utils/events.js",

  "/T/player/player.js",
  "/T/player/player-ui.js",

  "/T/ai/ai-core.js",
  "/T/ai/ai-ui.js"
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
