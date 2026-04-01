/* ============================================================
   TravelCar — SW Auto‑Update Handler
   ============================================================ */

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // Когда новый SW активирован — перезагружаем приложение
    window.location.reload();
  });

  navigator.serviceWorker.getRegistration().then(reg => {
    if (!reg) return;

    // Проверяем обновления каждые 30 секунд
    setInterval(() => {
      reg.update();
    }, 30000);

    // Если найден новый SW — предлагаем обновить
    reg.addEventListener("updatefound", () => {
      const newWorker = reg.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          showUpdateToast();
        }
      });
    });
  });
}

/* ============================================================
   UI уведомление о доступном обновлении
   ============================================================ */

function showUpdateToast() {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#FFB74D";
  toast.style.color = "#000";
  toast.style.padding = "12px 18px";
  toast.style.borderRadius = "12px";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  toast.style.fontSize = "14px";
  toast.style.fontWeight = "600";
  toast.style.zIndex = "9999";
  toast.style.cursor = "pointer";
  toast.textContent = "Доступно обновление — нажми, чтобы обновить";

  toast.onclick = () => {
    toast.remove();
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg && reg.waiting) {
        reg.waiting.postMessage({ action: "skipWaiting" });
      }
    });
  };

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 8000);
}
