// main.js

// Инициализация приложения
document.addEventListener("DOMContentLoaded", () => {
  // Можно добавить что-то ещё при старте
});

// Регистрация service worker для PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/Triplogs/service-worker.js")
      .catch((err) => console.warn("SW registration failed:", err));
  });
}
