import { formatDate, formatCurrency } from '../../core/utils.js';

export function TripCard(trip) {
  const total = trip.expenses.reduce((s, e) => s + (e.amountBase || e.amount), 0);
  
  return `
    <div class="card" data-trip-id="${trip.id}">
      <div class="card-header">
        <div>
          <div class="card-title">${escapeHtml(trip.title)}</div>
          <div class="card-subtitle">${escapeHtml(trip.city)}, ${escapeHtml(trip.country)}</div>
        </div>
        <button class="btn-small trip-actions" data-id="${trip.id}">⋮</button>
      </div>
      <div style="display:flex;justify-content:space-between;margin:12px 0;font-size:14px">
        <span>📅 ${formatDate(trip.startDate)} — ${formatDate(trip.endDate)}</span>
        <span>💰 ${formatCurrency(total, trip.currency)}</span>
      </div>
      <div style="display:flex;gap:8px">
        <a href="#trip/${trip.id}" class="btn btn-small" style="flex:1">Детали</a>
        <button class="btn btn-small btn-danger delete-trip" data-id="${trip.id}">✕</button>
      </div>
    </div>
  `;
}

export function attachTripCardEvents(container, onSelect) {
  container.querySelectorAll('.card[data-trip-id]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-small')) {
        const id = card.dataset.tripId;
        onSelect(id);
      }
    });
  });
  
  container.querySelectorAll('.delete-trip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Удалить эту поездку?')) {
        import('../../core/state.js').then(({ deleteTrip }) => {
          deleteTrip(btn.dataset.id);
        });
      }
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
