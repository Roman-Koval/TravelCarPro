/* ============================================================
   TravelCar — Global Reactive State (MVU Architecture)
   ============================================================ */

export const state = {
  screen: "trips",              // текущий экран
  trips: [],                    // список поездок
  activeTripId: null,           // выбранная поездка
  detailsTab: "list",           // вкладка в деталях поездки
  modal: null,                  // глобальное модальное окно
  loading: false,               // глобальный лоадер
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
   Подписчики (реактивность)
   ============================================================ */

let listeners = [];

export function subscribe(fn) {
  listeners.push(fn);
}

export function unsubscribe(fn) {
  listeners = listeners.filter(l => l !== fn);
}

function notify() {
  listeners.forEach(fn => fn(state));
}

/* ============================================================
   Обновление состояния
   ============================================================ */

export function setState(patch) {
  Object.assign(state, patch);
  notify();
}

export function updateSettings(patch) {
  Object.assign(state.settings, patch);
  saveSettings();
  notify();
}

/* ============================================================
   Работа с поездками
   ============================================================ */

export function addTrip(trip) {
  state.trips.push(trip);
  saveTrips();
  notify();
}

export function updateTrip(id, patch) {
  const trip = state.trips.find(t => t.id === id);
  if (!trip) return;
  Object.assign(trip, patch);
  saveTrips();
  notify();
}

export function deleteTrip(id) {
  state.trips = state.trips.filter(t => t.id !== id);
  saveTrips();
  notify();
}

export function addExpense(tripId, expense) {
  const trip = state.trips.find(t => t.id === tripId);
  if (!trip) return;
  trip.expenses.push(expense);
  saveTrips();
  notify();
}

export function getTrip(id) {
  return state.trips.find(t => t.id === id) || null;
}

/* ============================================================
   LocalStorage
   ============================================================ */

const TRIPS_KEY = "travelcar_trips_v1";
const SETTINGS_KEY = "travelcar_settings_v1";

export function loadState() {
  try {
    const tripsRaw = localStorage.getItem(TRIPS_KEY);
    if (tripsRaw) state.trips = JSON.parse(tripsRaw);
  } catch (e) {
    console.warn("Ошибка загрузки поездок", e);
  }

  try {
    const settingsRaw = localStorage.getItem(SETTINGS_KEY);
    if (settingsRaw) Object.assign(state.settings, JSON.parse(settingsRaw));
  } catch (e) {
    console.warn("Ошибка загрузки настроек", e);
  }
}

export function saveTrips() {
  localStorage.setItem(TRIPS_KEY, JSON.stringify(state.trips));
}

export function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

/* ============================================================
   Утилиты
   ============================================================ */

export function uuid() {
  return "xxxx-4xxx-yxxx-xxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
