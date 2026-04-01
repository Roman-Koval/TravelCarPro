/* ============================================================
   TravelCar — ExpenseCard Component
   Карточка расхода в списке
   ============================================================ */

import { formatDate } from "../../core/utils.js";

export function ExpenseCard(expense) {
  return `
    <div class="expense-card fade-in">
      <div class="expense-card-left">
        <div class="expense-category">${expense.category}</div>
        <div class="expense-title">${expense.title}</div>

        <div class="expense-meta">
          <span>${formatDate(expense.date)}</span>
          ${
            expense.city || expense.country
              ? `<span>• ${expense.city ? expense.city + ", " : ""}${expense.country || ""}</span>`
              : ""
          }
        </div>
      </div>

      <div class="expense-card-right">
        <div class="expense-amount">
          ${expense.amount.toFixed(2)} ${expense.currency}
        </div>

        ${
          expense.amountBase && expense.amountBase !== expense.amount
            ? `
          <div class="expense-converted">
            ${expense.amountBase.toFixed(2)} (конв.)
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;
}
