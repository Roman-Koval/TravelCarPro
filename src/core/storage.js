/* ============================================================
   TravelCar — Storage Layer (LocalStorage + Versioning)
   ============================================================ */

const STORAGE_VERSION = 1;

const STORAGE_KEY = "travelcar_data";
const VERSION_KEY = "travelcar_version";

/* ============================================================
   Структура данных по умолчанию
   ============================================================ */

const defaultData = {
  trips: [],
  settings: {
    name: "",
    language: "ru",
    darkTheme: false,
    pushEnabled: false,
    cloudSync: false,
    autoExportEmail: ""
  }
};

/* ============================================================
   Загрузка данных
   ============================================================ */

export function loadStorage() {
  try {
    const version = Number(localStorage.getItem(VERSION_KEY) || 0);

    // Если версия изменилась — мигрируем
    if (version !== STORAGE_VERSION) {
      migrate(version, STORAGE_VERSION);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStorage(defaultData);
      return structuredClone(defaultData);
    }

    const parsed = JSON.parse(raw);

    // Гарантия структуры
    return {
      trips: parsed.trips || [],
      settings: { ...defaultData.settings, ...(parsed.settings || {}) }
    };

  } catch (e) {
    console.warn("Ошибка загрузки хранилища:", e);
    saveStorage(defaultData);
    return structuredClone(defaultData);
  }
}

/* ============================================================
   Сохранение данных
   ============================================================ */

export function saveStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION.toString());
  } catch (e) {
    console.error("Ошибка сохранения:", e);
  }
}

/* ============================================================
   Миграции между версиями
   ============================================================ */

function migrate(oldVersion, newVersion) {
  console.log(`Миграция данных: v${oldVersion} → v${newVersion}`);

  let data = null;

  try {
    data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;
  } catch {
    data = defaultData;
  }

  // Пример миграции (если структура изменится в будущем)
  if (oldVersion < 1) {
    // v0 → v1
    data.settings = {
      ...defaultData.settings,
      ...(data.settings || {})
    };
  }

  saveStorage(data);
}

/* ============================================================
   Утилиты
   ============================================================ */

export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(VERSION_KEY);
  saveStorage(defaultData);
}

export function exportStorage() {
  return JSON.stringify(loadStorage(), null, 2);
}
