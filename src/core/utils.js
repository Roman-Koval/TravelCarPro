export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function sortTripsByStartDate(trips) {
  return [...trips].sort((a, b) => 
    new Date(a.startDate) - new Date(b.startDate)
  );
}

export function calculateTripStats(trip) {
  const total = trip.expenses.reduce((s, e) => s + (e.amountBase || e.amount), 0);
  const byCategory = {};
  
  trip.expenses.forEach(e => {
    const cat = e.category || 'Другое';
    const amount = e.amountBase || e.amount;
    byCategory[cat] = (byCategory[cat] || 0) + amount;
  });
  
  return {
    total,
    count: trip.expenses.length,
    byCategory,
    avgPerDay: trip.endDate && trip.startDate 
      ? total / ((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000 + 1)
      : total
  };
}

export function generateChartColors(count) {
  const colors = [
    '#0a84ff', '#30d158', '#ffd60a', '#ff453a', '#bf5af2',
    '#5ac8fa', '#64d2ff', '#40c8e0', '#30b7c2', '#2ca9a0'
  ];
  return colors.slice(0, count);
}
