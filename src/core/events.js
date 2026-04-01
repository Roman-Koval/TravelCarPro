/* ============================================================
   TravelCar — Global Event Bus
   ============================================================ */

/*
  Этот модуль нужен для:
  - глобальных событий (например, "expense-added", "trip-updated")
  - подписки UI на события
  - централизованного управления реакциями
*/

const listeners = {};

/* ============================================================
   Подписка на событие
   ============================================================ */

export function on(eventName, callback) {
  if (!listeners[eventName]) {
    listeners[eventName] = [];
  }
  listeners[eventName].push(callback);
}

/* ============================================================
   Отписка
   ============================================================ */

export function off(eventName, callback) {
  if (!listeners[eventName]) return;
  listeners[eventName] = listeners[eventName].filter(fn => fn !== callback);
}

/* ============================================================
   Вызов события
   ============================================================ */

export function emit(eventName, payload = null) {
  if (!listeners[eventName]) return;
  listeners[eventName].forEach(fn => fn(payload));
}

/* ============================================================
   Предопределённые события
   ============================================================ */

export const EVENTS = {
  TRIP_ADDED: "trip-added",
  TRIP_UPDATED: "trip-updated",
  TRIP_DELETED: "trip-deleted",

  EXPENSE_ADDED: "expense-added",
  EXPENSE_UPDATED: "expense-updated",
  EXPENSE_DELETED: "expense-deleted",

  SETTINGS_CHANGED: "settings-changed",

  SCREEN_CHANGED: "screen-changed"
};
