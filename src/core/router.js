/* ============================================================
   TravelCar — Simple Hash Router
   ============================================================ */

import { state, setState } from "./state.js";
import { getTrip } from "./state.js";

/* ============================================================
   Маршруты приложения
   ============================================================ */

const routes = {
  "#trips": () => setState({ screen: "trips" }),

  "#new-trip": () => setState({ screen: "trip-form", activeTripId: null }),

  "#settings": () => setState({ screen: "settings" }),

  "#add-expense": () => {
    // Shortcut: добавить расход в последнюю поездку
    const last = state.trips[state.trips.length - 1];
    if (last) {
      setState({ screen: "expense-add", activeTripId: last.id });
    } else {
      setState({ screen: "trips" });
    }
  },

  "#last-trip": () => {
    const last = state.trips[state.trips.length - 1];
    if (last) {
      setState({ screen: "trip-details", activeTripId: last.id });
    } else {
      setState({ screen: "trips" });
    }
  }
};

/* ============================================================
   Основной обработчик маршрутов
   ============================================================ */

export function handleRoute() {
  const hash = location.hash || "#trips";

  // Если маршрут содержит ID поездки
  if (hash.startsWith("#trip/")) {
    const id = hash.replace("#trip/", "");
    const trip = getTrip(id);
    if (trip) {
      setState({ screen: "trip-details", activeTripId: id });
    } else {
      setState({ screen: "trips" });
    }
    return;
  }

  // Если маршрут известен
  if (routes[hash]) {
    routes[hash]();
    return;
  }

  // Фолбэк
  setState({ screen: "trips" });
}

/* ============================================================
   Инициализация роутера
   ============================================================ */

export function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}
