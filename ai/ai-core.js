// --------------------------------------
// TravelCarPro OS — AI Core
// --------------------------------------

const AICore = {
  trips: [],

  init(initialTrips) {
    this.trips = initialTrips || [];
  },

  // Профиль путешественника
  getTravelerProfile() {
    if (this.trips.length === 0) {
      return {
        totalTrips: 0,
        favoriteCountry: "—",
        style: "—"
      };
    }

    const countries = {};
    this.trips.forEach(t => {
      countries[t.country] = (countries[t.country] || 0) + 1;
    });

    const favoriteCountry = Object.entries(countries).sort((a, b) => b[1] - a[1])[0][0];

    return {
      totalTrips: this.trips.length,
      favoriteCountry,
      style: this.detectStyle()
    };
  },

  // Определение стиля путешественника
  detectStyle() {
    let nature = 0;
    let cities = 0;

    this.trips.forEach(t => {
      t.cities.forEach(c => {
        if (c.type === "nature") nature++;
        if (c.type === "city") cities++;
      });
    });

    if (nature > cities) return "Исследователь природы";
    if (cities > nature) return "Городской исследователь";
    return "Смешанный стиль";
  },

  // Аналитика поездки
  analyzeTrip(trip) {
    return {
      risk: this.calculateRisk(trip),
      fuel: this.estimateFuel(trip),
      tips: this.generateTips(trip)
    };
  },

  // Пример оценки риска
  calculateRisk(trip) {
    let risk = 0;

    if (trip.weather === "rain") risk += 20;
    if (trip.roadType === "mountain") risk += 30;
    if (trip.distance > 500) risk += 10;

    return Math.min(risk, 100);
  },

  // Пример оценки топлива
  estimateFuel(trip) {
    const avgConsumption = 7.5; // л/100км
    return (trip.distance / 100) * avgConsumption;
  },

  // Советы
  generateTips(trip) {
    const tips = [];

    if (trip.weather === "rain") tips.push("Будь осторожен на мокрой дороге.");
    if (trip.distance > 600) tips.push("Делай перерывы каждые 2–3 часа.");
    if (trip.roadType === "mixed") tips.push("Следи за изменением покрытия.");

    if (tips.length === 0) tips.push("Поездка выглядит безопасной.");

    return tips;
  }
};

// Делаем доступным глобально
window.AICore = AICore;
