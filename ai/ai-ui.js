// --------------------------------------
// TravelCarPro OS — AI UI Module
// --------------------------------------

function renderTravelerProfile(container) {
  const profile = AICore.getTravelerProfile();

  container.innerHTML = `
    <div class="card">
      <h3>Профиль путешественника</h3>
      <p><strong>Всего поездок:</strong> ${profile.totalTrips}</p>
      <p><strong>Любимая страна:</strong> ${profile.favoriteCountry}</p>
      <p><strong>Стиль:</strong> ${profile.style}</p>
    </div>
  `;
}

function renderTripAnalysis(container, trip) {
  const analysis = AICore.analyzeTrip(trip);

  container.innerHTML = `
    <div class="card">
      <h3>Аналитика поездки</h3>
      <p><strong>Риск:</strong> ${analysis.risk}%</p>
      <p><strong>Расход топлива:</strong> ${analysis.fuel.toFixed(1)} л</p>
      <h4>Советы:</h4>
      <ul>
        ${analysis.tips.map(t => `<li>${t}</li>`).join("")}
      </ul>
    </div>
  `;
}

function initAIUI() {
  console.log("AI UI initialized");
}

// Делаем доступным глобально
window.renderTravelerProfile = renderTravelerProfile;
window.renderTripAnalysis = renderTripAnalysis;
window.initAIUI = initAIUI;
