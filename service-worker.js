const CACHE = "travelcarpro-v1";

const ASSETS = [
  "index.html",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "main.js"
];

// Установка SW и кэширование базовых файлов
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

// Очистка старых кэшей
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE && caches.delete(key))
      )
    )
  );
});

// Перехват запросов
self.addEventListener("fetch", event => {
  const request = event.request;

  // Кэширование музыки
  if (request.url.includes("/tracks/")) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Стандартное поведение: cache → network
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});
