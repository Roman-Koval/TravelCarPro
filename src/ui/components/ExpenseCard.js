import { formatDate, formatCurrency } from '../../core/utils.js';

export function ExpenseCard(expense, tripCurrency = 'EUR') {
  return `
    <div class="expense-item" data-expense-id="${expense.id}">
      <div class="expense-info">
        <h4>${escapeHtml(expense.title)}</h4>
        <p>${escapeHtml(expense.category || 'Другое')} • ${formatDate(expense.date || expense.createdAt)}</p>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <span class="expense-amount">${formatCurrency(expense.amountBase || expense.amount, expense.currency || tripCurrency)}</span>
        <button class="btn-small btn-danger delete-expense" data-id="${expense.id}">✕</button>
      </div>
    </div>
  `;
}

export function attachExpenseEvents(container, tripId, onDelete) {
  container.querySelectorAll('.delete-expense').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Удалить этот расход?')) {
        onDelete(tripId, btn.dataset.id);
      }
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
