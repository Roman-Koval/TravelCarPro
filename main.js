// main.js

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/TravelCarPro/service-worker.js");
  });
}
