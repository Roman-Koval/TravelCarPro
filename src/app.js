/* ============================================================
   TravelCar — Main Application File
   Инициализация, рендер, роутер, события
   ============================================================ */

import { state, subscribe, setState, loadState } from "./core/state.js";
import { initRouter } from "./core/router.js";

import { TripCard, attachTripCardEvents } from "./ui/components/TripCard.js";
import { ExpenseCard } from "./ui/components/ExpenseCard.js";
import { Tabs, attachTabsEvents } from "./ui/components/Tabs.js";
import { SkeletonList } from "./ui/components/Skeleton.js";
import { Modal, attachModalEvents } from "./ui/components/Modal.js";

import { renderPieChart, renderLineChart } from "./ui/components/Chart.js";

import { sortTripsByStartDate } from "./core/utils.js";

/* ============================================================
   Инициализация приложения
   ============================================================ */

window.addEventListener("DOMContentLoaded", () => {
  loadState();
  initRouter();
  subscribe(renderApp);
  renderApp();
  registerServiceWorker();
});

/* ============================================================
   Главный рендер
   ============================================================ */

function renderApp() {
  const root = document.getElementById("app");
  if (!root) return;

  switch (state.screen) {
    case "trips":
      root.innerHTML = renderTripsScreen();
      attachTripsEvents();
      break;

    case "trip-details":
      root.innerHTML = renderTripDetailsScreen();
      attachTripDetailsEvents();
      break;

    case "trip-form":
      root.innerHTML = renderTripFormScreen();
      attachTripFormEvents();
      break;

    case "expense-add":
      root.innerHTML = renderExpenseAddScreen();
      attachExpenseAddEvents();
      break;

    case "settings":
      root.innerHTML = renderSettingsScreen();
      attachSettingsEvents();
      break;

    default:
      root.innerHTML = "<div>Неизвестный экран</div>";
  }
}

/* ============================================================
   Экран: список поездок
   ============================================================ */

function renderTripsScreen() {
  if (!state.trips.length) {
    return `
      <div class="empty">
        <p>Пока нет поездок</p>
        <button class="btn primary" id="btn-new-trip">Создать поездку</button>
      </div>
    `;
  }

  const trips = sortTripsByStartDate(state.trips);

  return `
    <div class="screen-header">
      <h1>Поездки</h1>
      <button class="btn primary" id="btn-new-trip">+</button>
    </div>

    <div id="trip-list">
      ${trips.map(t => TripCard(t)).join("")}
    </div>
  `;
}

function attachTripsEvents() {
  document.getElementById("btn-new-trip").onclick = () => {
    location.hash = "#new-trip";
  };

  attachTripCardEvents(document, id => {
    location.hash = `#trip/${id}`;
  });
}

/* ============================================================
   Экран: детали поездки
   ============================================================ */

function renderTripDetailsScreen() {
  const trip = state.trips.find(t => t.id === state.activeTripId);
  if (!trip) return "<div>Поездка не найдена</div>";

  return `
    <div class="screen-header">
      <button class="btn back" id="btn-back">←</button>
      <h1>${trip.title}</h1>
      <button class="btn primary" id="btn-add-expense">+</button>
    </div>

    ${Tabs(state.detailsTab)}

    <div id="tab-content">
      ${renderTripTabContent(trip)}
    </div>
  `;
}

function renderTripTabContent(trip) {
  if (state.detailsTab === "list") {
    if (!trip.expenses.length) {
      return `<div class="empty">Нет расходов</div>`;
    }
    return trip.expenses.map(e => ExpenseCard(e)).join("");
  }

  if (state.detailsTab === "charts") {
    return `
      <canvas id="pie" width="300" height="300"></canvas>
      <canvas id="line" width="300" height="200"></canvas>
    `;
  }

  if (state.detailsTab === "stats") {
    const total = trip.expenses.reduce(
      (s, e) => s + (e.amountBase ?? e.amount),
      0
    );
    return `
      <div class="stats-box">
        <div class="stats-item">
          <div class="label">Всего расходов</div>
          <div class="value">${total.toFixed(2)} ${trip.currency}</div>
        </div>
      </div>
    `;
  }

  return "";
}

function attachTripDetailsEvents() {
  document.getElementById("btn-back").onclick = () => {
    location.hash = "#trips";
  };

  document.getElementById("btn-add-expense").onclick = () => {
    setState({ screen: "expense-add" });
  };

  attachTabsEvents(document, tab => {
    setState({ detailsTab: tab });
  });

  if (state.detailsTab === "charts") {
    const trip = state.trips.find(t => t.id === state.activeTripId);
    const expenses = trip.expenses;

    renderPieChart(document.getElementById("pie"), expenses);
    renderLineChart(document.getElementById("line"), expenses);
  }
}

/* ============================================================
   Экран: создание поездки
   ============================================================ */

function renderTripFormScreen() {
  return `
    <div class="screen-header">
      <button class="btn back" id="btn-back">←</button>
      <h1>Новая поездка</h1>
    </div>

    <div class="form">
      <input id="title" placeholder="Название" />
      <input id="city" placeholder="Город" />
      <input id="country" placeholder="Страна" />
      <input id="start" type="date" />
      <input id="end" type="date" />
      <input id="budget" type="number" placeholder="Бюджет" />
      <button class="btn primary" id="btn-save">Сохранить</button>
    </div>
  `;
}

function attachTripFormEvents() {
  document.getElementById("btn-back").onclick = () => {
    location.hash = "#trips";
  };

  document.getElementById("btn-save").onclick = () => {
    const trip = {
      id: crypto.randomUUID(),
      title: title.value,
      city: city.value,
      country: country.value,
      startDate: start.value,
      endDate: end.value,
      budget: Number(budget.value),
      currency: "EUR",
      expenses: []
    };

    state.trips.push(trip);
    localStorage.setItem("travelcar_trips_v1", JSON.stringify(state.trips));

    location.hash = "#trips";
  };
}

/* ============================================================
   Экран: добавление расхода
   ============================================================ */

function renderExpenseAddScreen() {
  return `
    <div class="screen-header">
      <button class="btn back" id="btn-back">←</button>
      <h1>Новый расход</h1>
    </div>

    <div class="form">
      <input id="title" placeholder="Описание" />
      <input id="amount" type="number" placeholder="Сумма" />
      <input id="category" placeholder="Категория" />
      <button class="btn primary" id="btn-save">Добавить</button>
    </div>
  `;
}

function attachExpenseAddEvents() {
  document.getElementById("btn-back").onclick = () => {
    location.hash = `#trip/${state.activeTripId}`;
  };

  document.getElementById("btn-save").onclick = () => {
    const trip = state.trips.find(t => t.id === state.activeTripId);
    if (!trip) return;

    trip.expenses.push({
      id: crypto.randomUUID(),
      title: title.value,
      amount: Number(amount.value),
      currency: trip.currency,
      category: category.value || "Другое",
      date: new Date().toISOString()
    });

    localStorage.setItem("travelcar_trips_v1", JSON.stringify(state.trips));

    location.hash = `#trip/${trip.id}`;
  };
}

/* ============================================================
   Экран: настройки
   ============================================================ */

function renderSettingsScreen() {
  return `
    <div class="screen-header">
      <button class="btn back" id="btn-back">←</button>
      <h1>Настройки</h1>
    </div>

    <div class="form">
      <label>Имя</label>
      <input id="name" value="${state.settings.name}" />

      <label>Тёмная тема</label>
      <input id="dark" type="checkbox" ${state.settings.darkTheme ? "checked" : ""} />

      <button class="btn primary" id="btn-save">Сохранить</button>
    </div>
  `;
}

function attachSettingsEvents() {
  document.getElementById("btn-back").onclick = () => {
    location.hash = "#trips";
  };

  document.getElementById("btn-save").onclick = () => {
    state.settings.name = name.value;
    state.settings.darkTheme = dark.checked;

    localStorage.setItem(
      "travelcar_settings_v1",
      JSON.stringify(state.settings)
    );

    location.hash = "#trips";
  };
}

/* ============================================================
   Service Worker
   ============================================================ */

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }
}
