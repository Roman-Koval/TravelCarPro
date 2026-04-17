import { getExpensesByCategory } from '../../core/state.js';
import { generateChartColors } from '../../core/utils.js';

export function renderPieChart(container, expenses) {
  if (!container || !Chart) return;
  
  const categories = {};
  expenses.forEach(e => {
    const cat = e.category || 'Другое';
    const amount = e.amountBase || e.amount;
    categories[cat] = (categories[cat] || 0) + amount;
  });
  
  if (Object.keys(categories).length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-dim)">Нет данных для графика</p>';
    return;
  }
  
  const ctx = container.getContext('2d');
  
  if (container._chart) container._chart.destroy();
  
  container._chart = new Chart(ctx, {
    type: 'doughnut',
     {
      labels: Object.keys(categories),
      datasets: [{
         Object.values(categories),
        backgroundColor: generateChartColors(Object.keys(categories).length),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: getComputedStyle(document.documentElement).getPropertyValue('--text') } }
      }
    }
  });
}

export function renderLineChart(container, expenses) {
  if (!container || !Chart) return;
  
  if (expenses.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-dim)">Нет данных для графика</p>';
    return;
  }
  
  const sorted = [...expenses].sort((a, b) => 
    new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
  );
  
  const ctx = container.getContext('2d');
  
  if (container._chart) container._chart.destroy();
  
  container._chart = new Chart(ctx, {
    type: 'line',
     {
      labels: sorted.map(e => {
        const d = new Date(e.date || e.createdAt);
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      }),
      datasets: [{
        label: 'Расходы',
        data: sorted.map(e => e.amountBase || e.amount),
        borderColor: 'var(--accent)',
        backgroundColor: 'rgba(10, 132, 255, 0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { 
          beginAtZero: true,
          grid: { color: 'var(--border)' },
          ticks: { color: 'var(--text-dim)' }
        },
        x: {
          grid: { display: false },
          ticks: { color: 'var(--text-dim)', maxRotation: 45, minRotation: 45 }
        }
      }
    }
  });
}
