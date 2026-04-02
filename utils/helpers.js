// --------------------------------------
// TravelCarPro OS — Helper Utilities
// --------------------------------------

// Безопасная загрузка JSON-файлов
async function loadJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error("Ошибка загрузки: " + path);
    return await response.json();
  } catch (err) {
    console.error("loadJSON error:", err);
    return null;
  }
}

// Форматирование расстояния
function formatDistance(km) {
  return `${km} км`;
}

// Форматирование топлива
function formatFuel(liters) {
  return `${liters.toFixed(1)} л`;
}

// Форматирование времени
function formatTime(time) {
  return time || "—";
}

// Безопасный вызов функции
function safeCall(fn, ...args) {
  try {
    return fn(...args);
  } catch (err) {
    console.error("safeCall error:", err);
    return null;
  }
}

// Генерация случайного ID
function uid() {
  return Math.random().toString(36).substring(2, 10);
}

// Плавный скролл
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Делаем доступным глобально
window.loadJSON = loadJSON;
window.formatDistance = formatDistance;
window.formatFuel = formatFuel;
window.formatTime = formatTime;
window.safeCall = safeCall;
window.uid = uid;
window.scrollToTop = scrollToTop;
