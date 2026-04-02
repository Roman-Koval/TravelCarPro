// ------------------------------
// TravelCarPro OS — Main Script
// ------------------------------

const root = document.getElementById("root");

// ------------------------------
// Данные (пример)
// ------------------------------

const trips = [
  {
    name: "Ireland Roadtrip",
    country: "Ireland",
    distance: 820,
    days: 5,
    weather: "rain",
    roadType: "mixed",
    startTime: "08:00",
    cities: [
      { name: "Dublin", type: "city" },
      { name: "Galway", type: "city" },
      { name: "Cliffs of Moher", type: "nature" }
    ],
    stats: {
      avgSpeed: 85,
      stops: 3,
      accelerations: 5,
      brakings: 4
    }
  }
];

let currentTrip = trips[0];

// ------------------------------
// UI Helpers
// ------------------------------

function clear() {
  root.innerHTML = "";
}

function create(tag, attrs = {}, children = "") {
  const el = document.createElement(tag);
  for (const key in attrs) el.setAttribute(key, attrs[key]);
  el.innerHTML = children;
  return el;
}

// ------------------------------
// Screens
// ------------------------------

function showHome() {
  clear();

  const title = create("h1", {}, "TravelCarPro OS");
  title.style.textAlign = "center";
  title.style.marginTop = "20px";

  const btnTrips = create("button", { class: "btn" }, "Мои поездки");
  btnTrips.onclick = showTrips;

  const btnAI = create("button", { class: "btn" }, "AI Центр");
  btnAI.onclick = showAICenter;

  root.append(title, btnTrips, btnAI, createPlayerBar());
}

function showTrips() {
  clear();

  const title = create("h2", {}, "Мои поездки");

  const list = create("div");

  trips.forEach(t => {
    const card = create("div", { class: "card" });
    card.innerHTML = `
      <h3>${t.name}</h3>
      <p>${t.distance} км • ${t.days} дней</p>
      <button class="btn-small">Открыть</button>
    `;
    card.querySelector("button").onclick = () => {
      currentTrip = t;
      showTripDetails();
    };
    list.appendChild(card);
  });

  root.append(title, list, createPlayerBar());
}

function showTripDetails() {
  clear();

  const t = currentTrip;

  const title = create("h2", {}, t.name);

  const info = create("div", { class: "card" }, `
    <p>Страна: ${t.country}</p>
    <p>Дистанция: ${t.distance} км</p>
    <p>Длительность: ${t.days} дней</p>
  `);

  const btnAI = create("button", { class: "btn" }, "AI Аналитика");
  btnAI.onclick = showAICenter;

  root.append(title, info, btnAI, createPlayerBar());
}

function showAICenter() {
  clear();

  const title = create("h2", {}, "AI Центр");

  const card = create("div", { class: "card" }, `
    <h3>Профиль путешественника</h3>
    <p>Всего поездок: ${trips.length}</p>
    <p>Любимая страна: Ireland</p>
    <p>Стиль: Исследователь</p>
  `);

  root.append(title, card, createPlayerBar());
}

// ------------------------------
// Player
// ------------------------------

function createPlayerBar() {
  const bar = create("div", { class: "player-bar" }, `
    <span>🎵 Плеер</span>
    <button class="btn-small">▶️</button>
  `);

  return bar;
}

// ------------------------------
// Start App
// ------------------------------

showHome();
