/* ============================================================
   TravelCar — TripCard Component
   Карточка поездки на главном экране
   ============================================================ */

import { formatDate, sumExpenses } from "../../core/utils.js";

export function TripCard(trip, onClick) {
  const total = sumExpenses(trip.expenses || []);
  const budget = trip.budget || 0;

  const progress =
    budget > 0 ? Math.min(100, (total / budget) * 100) : 0;

  return `
    <div class="trip-card card card-clickable fade-in" data-id="${trip.id}">
      <div class="trip-card-header">
        <div class="trip-card-title">${trip.title}</div>
        <div class="trip-card-currency">${trip.currency}</div>
      </div>

      <div class="trip-card-dates">
        ${formatDate(trip.startDate)} — ${formatDate(trip.endDate)}
      </div>

      <div class="trip-card-location">
        ${trip.city ? trip.city + ", " : ""}${trip.country || ""}
      </div>

      <div class="trip-card-summary">
        <div class="trip-card-total">
          <div class="label">Потрачено</div>
          <div class="value">${total.toFixed(2)} ${trip.currency}</div>
        </div>

        ${
          budget > 0
            ? `
          <div class="trip-card-budget">
            <div class="label">Бюджет</div>
            <div class="value">${budget.toFixed(2)} ${trip.currency}</div>
          </div>
        `
            : ""
        }
      </div>

      <div class="trip-card-progress">
        <div class="trip-card-progress-fill" style="width:${progress}%"></div>
      </div>
    </div>
  `;
}

/* ============================================================
   Навешиваем обработчики кликов после рендера
   ============================================================ */
export function attachTripCardEvents(container, onClick) {
  container.querySelectorAll(".trip-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      onClick && onClick(id);
    });
  });
}
