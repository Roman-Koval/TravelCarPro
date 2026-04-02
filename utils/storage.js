// --------------------------------------
// TravelCarPro OS — Local Storage Module
// --------------------------------------

const Storage = {
  prefix: "tcp_",

  // Сохранение значения
  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (err) {
      console.error("Storage.set error:", err);
    }
  },

  // Загрузка значения
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.error("Storage.get error:", err);
      return fallback;
    }
  },

  // Удаление значения
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (err) {
      console.error("Storage.remove error:", err);
    }
  },

  // Очистка всех данных TravelCarPro OS
  clearAll() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(this.prefix))
        .forEach(k => localStorage.removeItem(k));
    } catch (err) {
      console.error("Storage.clearAll error:", err);
    }
  },

  // Специальные методы
  saveLastTrack(trackName) {
    this.set("lastTrack", trackName);
  },

  loadLastTrack() {
    return this.get("lastTrack", null);
  },

  saveVolume(volume) {
    this.set("volume", volume);
  },

  loadVolume() {
    return this.get("volume", 0.8);
  },

  saveSettings(settings) {
    this.set("settings", settings);
  },

  loadSettings() {
    return this.get("settings", null);
  }
};

// Делаем доступным глобально
window.Storage = Storage;
