export const state = {
  trips: [],
  activeTripId: null,
  screen: 'trips',
  detailsTab: 'list',
  settings: {
    name: '',
    darkTheme: true
  }
};

export const subscribers = [];

export function subscribe(fn) {
  subscribers.push(fn);
}

export function setState(newState) {
  Object.assign(state, newState);
  notify();
  persistState();
}

export function notify() {
  subscribers.forEach(fn => fn());
}

export function loadState() {
  try {
    const trips = localStorage.getItem('travelcar_trips_v1');
    const settings = localStorage.getItem('travelcar_settings_v1');
    
    if (trips) state.trips = JSON.parse(trips);
    if (settings) {
      const parsed = JSON.parse(settings);
      state.settings = { ...state.settings, ...parsed };
      applyTheme();
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
}

export function persistState() {
  localStorage.setItem('travelcar_trips_v1', JSON.stringify(state.trips));
  localStorage.setItem('travelcar_settings_v1', JSON.stringify(state.settings));
}

export function applyTheme() {
  document.documentElement.setAttribute(
    'data-theme',
    state.settings.darkTheme ? 'dark' : 'light'
  );
}

export function addTrip(trip) {
  state.trips.push({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...trip,
    expenses: []
  });
  persistState();
  notify();
}

export function updateTrip(id, updates) {
  const idx = state.trips.findIndex(t => t.id === id);
  if (idx !== -1) {
    state.trips[idx] = { ...state.trips[idx], ...updates };
    persistState();
    notify();
  }
}

export function deleteTrip(id) {
  state.trips = state.trips.filter(t => t.id !== id);
  if (state.activeTripId === id) state.activeTripId = null;
  persistState();
  notify();
}

export function addExpense(tripId, expense) {
  const trip = state.trips.find(t => t.id === tripId);
  if (trip) {
    trip.expenses.push({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...expense
    });
    persistState();
    notify();
  }
}

export function deleteExpense(tripId, expenseId) {
  const trip = state.trips.find(t => t.id === tripId);
  if (trip) {
    trip.expenses = trip.expenses.filter(e => e.id !== expenseId);
    persistState();
    notify();
  }
}

export function getTrip(id) {
  return state.trips.find(t => t.id === id);
}

export function getTripsSorted() {
  return [...state.trips].sort((a, b) => 
    new Date(b.startDate) - new Date(a.startDate)
  );
}

export function getExpensesByCategory(trip) {
  const categories = {};
  trip.expenses.forEach(e => {
    const cat = e.category || 'Другое';
    const amount = e.amountBase || e.amount;
    categories[cat] = (categories[cat] || 0) + amount;
  });
  return categories;
}

export function getTotalExpenses(trip) {
  return trip.expenses.reduce((sum, e) => sum + (e.amountBase || e.amount), 0);
}
