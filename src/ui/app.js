import { state, subscribe, setState, loadState, applyTheme, addTrip, updateTrip, deleteTrip, addExpense, deleteExpense, getTrip, getTripsSorted, getTotalExpenses, getExpensesByCategory } from '../core/state.js';
import { initRouter, navigate } from '../core/router.js';
import { TripCard, attachTripCardEvents } from './components/TripCard.js';
import { ExpenseCard, attachExpenseEvents } from './components/ExpenseCard.js';
import { Tabs, attachTabsEvents } from './components/Tabs.js';
import { Modal, attachModalEvents } from './components/Modal.js';
import { renderPieChart, renderLineChart } from './components/Chart.js';
import { formatDate, formatCurrency, calculateTripStats } from '../core/utils.js';

window.addEventListener('DOMContentLoaded', () => {
  loadState();
  applyTheme();
  initRouter();
  subscribe(renderApp);
  renderApp();
});

function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  switch (state.screen) {
    case 'trips':
      root.innerHTML = renderTripsScreen();
      attachTripsEvents();
      break;
    case 'trip-details':
      root.innerHTML = renderTripDetailsScreen();
      attachTripDetailsEvents();
      break;
    case 'trip-form':
      root.innerHTML = renderTripFormScreen();
      attachTripFormEvents();
      break;
    case 'expense-add':
      root.innerHTML = renderExpenseAddScreen();
      attachExpenseAddEvents();
      break;
    case 'settings':
      root.innerHTML = renderSettingsScreen();
      attachSettingsEvents();
      break;
    default:
      root.innerHTML = `<div class="container"><p>Неизвестный экран</p><a href="#trips" class="btn">Назад</a></div>`;
  }
}

// === Экран: список поездок ===
function renderTripsScreen() {
  const trips = getTripsSorted();
  
  if (!trips.length) {
    return `
      <div class="container">
        <div class="header">
          <h1>🚗 TravelCarPro</h1>
          <button class="theme-toggle" id="theme-toggle">🌓</button>
        </div>
        <div class="empty-state">
          <div class="icon">🗺️</div>
          <h3>Пока нет поездок</h3>
          <p style="margin:12px 0 20px">Создайте первую поездку, чтобы начать учёт расходов</p>
          <a href="#new-trip" class="btn">+ Новая поездка</a>
        </div>
        <a href="#settings" class="btn btn-small" style="margin-top:20px">⚙️ Настройки</a>
      </div>
    `;
  }

  return `
    <div class="container">
      <div class="header">
        <h1>🚗 Поездки</h1>
        <div style="display:flex;gap:8px">
          <button class="theme-toggle" id="theme-toggle">🌓</button>
          <a href="#settings" class="btn-small">⚙️</a>
        </div>
      </div>
      ${trips.map(t => TripCard(t)).join('')}
    </div>
    <a href="#new-trip" class="fab" title="Новая поездка">+</a>
  `;
}

function attachTripsEvents() {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.onclick = () => {
      state.settings.darkTheme = !state.settings.darkTheme;
      applyTheme();
      import('../core/state.js').then(({ persistState }) => persistState());
    };
  }
  
  attachTripCardEvents(document, (id) => navigate(`#trip/${id}`));
  
  document.querySelectorAll('.delete-trip').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      if (confirm('Удалить поездку и все расходы?')) {
        deleteTrip(btn.dataset.id);
      }
    };
  });
}

// === Экран: детали поездки ===
function renderTripDetailsScreen() {
  const trip = getTrip(state.activeTripId);
  if (!trip) return `<div class="container"><p>Поездка не найдена</p><a href="#trips" class="btn">Назад</a></div>`;

  const stats = calculateTripStats(trip);
  
  return `
    <div class="container">
      <div class="header">
        <a href="#trips" class="btn-small" id="btn-back">←</a>
        <h1 style="flex:1;text-align:center">${escapeHtml(trip.title)}</h1>
        <button class="theme-toggle" id="theme-toggle">🌓</button>
      </div>
      
      <div class="card">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <strong>📍</strong>
          <span>${escapeHtml(trip.city)}, ${escapeHtml(trip.country)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <strong>📅</strong>
          <span>${formatDate(trip.startDate)} — ${formatDate(trip.endDate)}</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <strong>💰 Бюджет</strong>
          <span>${formatCurrency(trip.budget || 0, trip.currency)}</span>
        </div>
        ${trip.budget ? `
          <div style="margin-top:12px">
            <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px">
              <span>Потрачено</span>
              <span>${Math.min(100, Math.round(stats.total / trip.budget * 100))}%</span>
            </div>
            <div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden">
              <div style="height:100%;width:${Math.min(100, stats.total / trip.budget * 100)}%;background:var(--accent);border-radius:4px"></div>
            </div>
          </div>
        ` : ''}
      </div>
      
      ${Tabs(state.detailsTab)}
      
      <div id="tab-content">
        ${renderTripTabContent(trip, stats)}
      </div>
      
      <a href="#add-expense" class="btn" id="btn-add-expense" style="margin:20px 0">+ Добавить расход</a>
    </div>
  `;
}

function renderTripTabContent(trip, stats) {
  if (state.detailsTab === 'list') {
    if (!trip.expenses.length) {
      return `<div class="empty-state"><div class="icon">💸</div><p>Нет расходов</p></div>`;
    }
    return trip.expenses.map(e => ExpenseCard(e, trip.currency)).join('');
  }
  
  if (state.detailsTab === 'charts') {
    return `
      <div class="card">
        <h4 style="margin-bottom:16px">По категориям</h4>
        <canvas id="pie-chart" class="chart-container"></canvas>
      </div>
      <div class="card">
        <h4 style="margin-bottom:16px">Динамика расходов</h4>
        <canvas id="line-chart" class="chart-container"></canvas>
      </div>
    `;
  }
  
  if (state.detailsTab === 'stats') {
    return `
      <div class="card">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;text-align:center">
          <div>
            <div style="font-size:24px;font-weight:600;color:var(--accent)">${formatCurrency(stats.total, trip.currency)}</div>
            <div style="font-size:13px;color:var(--text-dim)">Всего</div>
          </div>
          <div>
            <div style="font-size:24px;font-weight:600">${stats.count}</div>
            <div style="font-size:13px;color:var(--text-dim)">Расходов</div>
          </div>
          <div>
            <div style="font-size:24px;font-weight:600">${formatCurrency(stats.avgPerDay || 0, trip.currency)}</div>
            <div style="font-size:13px;color:var(--text-dim)">В день</div>
          </div>
          <div>
            <div style="font-size:24px;font-weight:600">${trip.budget ? formatCurrency(trip.budget - stats.total, trip.currency) : '—'}</div>
            <div style="font-size:13px;color:var(--text-dim)">Остаток</div>
          </div>
        </div>
      </div>
      ${Object.entries(stats.byCategory).length ? `
        <div class="card">
          <h4 style="margin-bottom:12px">По категориям</h4>
          ${Object.entries(stats.byCategory).map(([cat, amount]) => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
              <span>${escapeHtml(cat)}</span>
              <strong>${formatCurrency(amount, trip.currency)}</strong>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  }
  
  return '';
}

function attachTripDetailsEvents() {
  document.getElementById('btn-back')?.addEventListener('click', () => navigate('#trips'));
  document.getElementById('btn-add-expense')?.addEventListener('click', () => navigate('#add-expense'));
  
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.onclick = () => {
      state.settings.darkTheme = !state.settings.darkTheme;
      applyTheme();
      import('../core/state.js').then(({ persistState }) => persistState());
    };
  }
  
  attachTabsEvents(document, (tab) => {
    setState({ detailsTab: tab });
    setTimeout(() => {
      if (tab === 'charts') {
        const trip = getTrip(state.activeTripId);
        renderPieChart(document.getElementById('pie-chart'), trip?.expenses || []);
        renderLineChart(document.getElementById('line-chart'), trip?.expenses || []);
      }
    }, 100);
  });
  
  attachExpenseEvents(document, state.activeTripId, deleteExpense);
  
  if (state.detailsTab === 'charts') {
    setTimeout(() => {
      const trip = getTrip(state.activeTripId);
      renderPieChart(document.getElementById('pie-chart'), trip?.expenses || []);
      renderLineChart(document.getElementById('line-chart'), trip?.expenses || []);
    }, 100);
  }
}

// === Экран: создание поездки ===
function renderTripFormScreen() {
  const trip = state.activeTripId ? getTrip(state.activeTripId) : null;
  
  return `
    <div class="container">
      <div class="header">
        <a href="#trips" class="btn-small" id="btn-back">←</a>
        <h1 style="flex:1;text-align:center">${trip ? 'Редактировать' : 'Новая поездка'}</h1>
        <button class="theme-toggle" id="theme-toggle">🌓</button>
      </div>
      
      <form id="trip-form" class="card" style="margin-top:16px">
        <div class="form-group">
          <label>Название *</label>
          <input type="text" id="title" value="${escapeAttr(trip?.title || '')}" required placeholder="Например: Отпуск в Италии">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label>Город *</label>
            <input type="text" id="city" value="${escapeAttr(trip?.city || '')}" required placeholder="Рим">
          </div>
          <div class="form-group">
            <label>Страна *</label>
            <input type="text" id="country" value="${escapeAttr(trip?.country || '')}" required placeholder="Италия">
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group">
            <label>Начало *</label>
            <input type="date" id="start" value="${trip?.startDate || ''}" required>
          </div>
          <div class="form-group">
            <label>Окончание *</label>
            <input type="date" id="end" value="${trip?.endDate || ''}" required>
          </div>
        </div>
        <div class="form-group">
          <label>Бюджет (опционально)</label>
          <input type="number" id="budget" step="0.01" value="${trip?.budget || ''}" placeholder="1000">
        </div>
        <div class="form-group">
          <label>Валюта</label>
          <select id="currency">
            <option value="EUR" ${trip?.currency === 'EUR' ? 'selected' : ''}>EUR — Евро</option>
            <option value="USD" ${trip?.currency === 'USD' ? 'selected' : ''}>USD — Доллар</option>
            <option value="RUB" ${trip?.currency === 'RUB' ? 'selected' : ''}>RUB — Рубль</option>
            <option value="GBP" ${trip?.currency === 'GBP' ? 'selected' : ''}>GBP — Фунт</option>
          </select>
        </div>
        <button type="submit" class="btn" id="btn-save" style="margin-top:8px">💾 Сохранить</button>
      </form>
    </div>
  `;
}

function attachTripFormEvents() {
  document.getElementById('btn-back')?.addEventListener('click', () => navigate('#trips'));
  
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.onclick = () => {
      state.settings.darkTheme = !state.settings.darkTheme;
      applyTheme();
      import('../core/state.js').then(({ persistState }) => persistState());
    };
  }
  
  document.getElementById('trip-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const tripData = {
      title: document.getElementById('title').value.trim(),
      city: document.getElementById('city').value.trim(),
      country: document.getElementById('country').value.trim(),
      startDate: document.getElementById('start').value,
      endDate: document.getElementById('end').value,
      budget: document.getElementById('budget').value ? parseFloat(document.getElementById('budget').value) : null,
      currency: document.getElementById('currency').value
    };
    
    if (state.activeTripId) {
      updateTrip(state.activeTripId, tripData);
    } else {
      addTrip(tripData);
    }
    
    navigate('#trips');
  });
}

// === Экран: добавление расхода ===
function renderExpenseAddScreen() {
  const trip = getTrip(state.activeTripId);
  if (!trip) return `<div class="container"><p>Поездка не найдена</p><a href="#trips" class="btn">Назад</a></div>`;

  return `
    <div class="container">
      <div class="header">
        <a href="#trip/${trip.id}" class="btn-small" id="btn-back">←</a>
        <h1 style="flex:1;text-align:center">Новый расход</h1>
        <button class="theme-toggle" id="theme-toggle">🌓</button>
      </div>
      
      <form id="expense-form" class="card" style="margin-top:16px">
        <div class="form-group">
          <label>Название *</label>
          <input type="text" id="title" required placeholder="Например: Обед в ресторане">
        </div>
        <div class="form-group">
          <label>Сумма *</label>
          <input type="number" id="amount" step="0.01" required placeholder="25.50">
        </div>
        <div class="form-group">
          <label>Категория</label>
          <select id="category">
            <option value="Еда">🍽️ Еда</option>
            <option value="Транспорт">🚗 Транспорт</option>
            <option value="Жильё">🏨 Жильё</option>
            <option value="Развлечения">🎭 Развлечения</option>
            <option value="Покупки">🛍️ Покупки</option>
            <option value="Другое">📦 Другое</option>
          </select>
        </div>
        <div class="form-group">
          <label>Дата</label>
          <input type="date" id="date" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <button type="submit" class="btn" id="btn-save" style="margin-top:8px">💾 Добавить</button>
      </form>
    </div>
  `;
}

function attachExpenseAddEvents() {
  document.getElementById('btn-back')?.addEventListener('click', () => navigate(`#trip/${state.activeTripId}`));
  
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.onclick = () => {
      state.settings.darkTheme = !state.settings.darkTheme;
      applyTheme();
      import('../core/state.js').then(({ persistState }) => persistState());
    };
  }
  
  document.getElementById('expense-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    addExpense(state.activeTripId, {
      title: document.getElementById('title').value.trim(),
      amount: parseFloat(document.getElementById('amount').value),
      category: document.getElementById('category').value,
      date: document.getElementById('date').value || new Date().toISOString(),
      currency: getTrip(state.activeTripId)?.currency || 'EUR'
    });
    
    navigate(`#trip/${state.activeTripId}`);
  });
}

// === Экран: настройки ===
function renderSettingsScreen() {
  return `
    <div class="container">
      <div class="header">
        <a href="#trips" class="btn-small" id="btn-back">←</a>
        <h1 style="flex:1;text-align:center">Настройки</h1>
      </div>
      
      <form id="settings-form" class="card" style="margin-top:16px">
        <div class="form-group">
          <label>Ваше имя</label>
          <input type="text" id="name" value="${escapeAttr(state.settings.name || '')}" placeholder="Роман">
        </div>
        <div class="form-group" style="display:flex;align-items:center;justify-content:space-between">
          <label for="dark-theme" style="margin:0">Тёмная тема</label>
          <input type="checkbox" id="dark-theme" ${state.settings.darkTheme ? 'checked' : ''}>
        </div>
        <button type="submit" class="btn" style="margin-top:16px">💾 Сохранить</button>
      </form>
      
      <div class="card" style="margin-top:16px">
        <h4 style="margin-bottom:12px">Данные приложения</h4>
        <button class="btn btn-small btn-danger" id="btn-clear" style="width:100%">🗑️ Очистить все данные</button>
      </div>
      
      <div class="card" style="margin-top:16px;text-align:center;color:var(--text-dim);font-size:13px">
        <p>TravelCarPro v1.0</p>
        <p style="margin-top:4px">© ${new Date().getFullYear()} Роман Коваль</p>
      </div>
    </div>
  `;
}

function attachSettingsEvents() {
  document.getElementById('btn-back')?.addEventListener('click', () => navigate('#trips'));
  
  document.getElementById('settings-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.settings.name = document.getElementById('name').value.trim();
    state.settings.darkTheme = document.getElementById('dark-theme').checked;
    applyTheme();
    import('../core/state.js').then(({ persistState }) => persistState());
    navigate('#trips');
  });
  
  document.getElementById('dark-theme')?.addEventListener('change', (e) => {
    state.settings.darkTheme = e.target.checked;
    applyTheme();
  });
  
  document.getElementById('btn-clear')?.addEventListener('click', () => {
    if (confirm('⚠️ Вы уверены? Все поездки и расходы будут удалены безвозвратно.')) {
      localStorage.removeItem('travelcar_trips_v1');
      state.trips = [];
      import('../core/state.js').then(({ notify }) => notify());
      navigate('#trips');
    }
  });
}

// === Утилиты ===
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(text) {
  return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
