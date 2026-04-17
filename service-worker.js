const CACHE_NAME = 'travelcar-v1';
const ASSETS = [
  '/TravelCarPro/',
  '/TravelCarPro/index.html',
  '/TravelCarPro/style.css',
  '/TravelCarPro/main.js',
  '/TravelCarPro/src/ui/app.js',
  '/TravelCarPro/src/core/state.js',
  '/TravelCarPro/src/core/router.js',
  '/TravelCarPro/src/core/utils.js',
  '/TravelCarPro/src/ui/components/TripCard.js',
  '/TravelCarPro/src/ui/components/ExpenseCard.js',
  '/TravelCarPro/src/ui/components/Tabs.js',
  '/TravelCarPro/src/ui/components/Modal.js',
  '/TravelCarPro/src/ui/components/Chart.js',
  '/TravelCarPro/src/ui/components/Skeleton.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});
