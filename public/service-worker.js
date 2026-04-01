/* ============================================================
   TravelCar — Production Service Worker
   Features:
   - App Shell caching
   - Runtime caching (currency API, geocode API)
   - Offline fallback
   - Auto-update
   - Versioned cache
   ============================================================ */

const CACHE_VERSION = "v1.0.0";
const APP_CACHE = `travelcar-app-${CACHE_VERSION}`;
const RUNTIME_CACHE = `travelcar-runtime-${CACHE_VERSION}`;

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./sw-update.js",

  // Icons
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",

  // Styles
  "../styles/base.css",
  "../styles/components.css",
  "../styles/screens.css",
  "../styles/animations.css",
  "../styles/dark.css",

  // App
  "../src/ui/app.js",
  "../src/core/state.js",
  "../src/core/router.js",
  "../src/core/storage.js",
  "../src/core/events.js",
  "../src/core/utils.js",

  "../src/api/currency.js",
  "../src/api/geolocation.js",
  "../src/api/speech.js",
  "../src/api/export.js",

  "../src/ui/components/TripCard.js",
  "../src/ui/components/ExpenseCard.js",
  "../src/ui/components/Modal.js",
  "../src/ui/components/Tabs.js",
  "../src/ui/components/Skeleton.js",
  "../src/ui/components/Chart.js",

  "../src/ui/screens/TripsScreen.js",
  "../src/ui/screens/TripFormScreen.js",
  "../src/ui/screens/TripDetailsScreen.js",
  "../src/ui/screens/SettingsScreen.js",
  "../src/ui/screens/ExpenseAddScreen.js"
];

/* ============================================================
   INSTALL — Cache App Shell
   ============================================================ */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(APP_CACHE).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

/* ============================================================
   ACTIVATE — Clean old caches
   ============================================================ */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== APP_CACHE && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ============================================================
   FETCH — App Shell + Runtime caching
   ============================================================ */
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Ignore non-GET
  if (event.request.method !== "GET") return;

  // Currency API caching
  if (url.hostname.includes("exchangerate.host")) {
    event.respondWith(currencyCache(event.request));
    return;
  }

  // Reverse geocode caching
  if (url.hostname.includes("nominatim.openstreetmap.org")) {
    event.respondWith(geoCache(event.request));
    return;
  }

  // App Shell (cache-first)
  if (APP_SHELL.some(path => url.pathname.endsWith(path.replace("./", "")))) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Default: network-first
  event.respondWith(networkFirst(event.request));
});

/* ============================================================
   STRATEGIES
   ============================================================ */

async function cacheFirst(request) {
  const cache = await caches.open(APP_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match("./index.html");
  }
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || caches.match("./index.html");
  }
}

async function currencyCache(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response(JSON.stringify({ rates: {} }), { status: 200 });
  }
}

async function geoCache(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response(JSON.stringify({ address: {} }), { status: 200 });
  }
}
