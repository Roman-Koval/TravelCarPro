/* ============================================================
   TravelCar — Chart Component (Canvas API)
   Pie Chart + Line Chart
   ============================================================ */

/* ------------------------------------------------------------
   Палитра категорий
   ------------------------------------------------------------ */
const COLORS = {
  "Еда": "#FF7043",
  "Транспорт": "#42A5F5",
  "Жильё": "#66BB6A",
  "Развлечения": "#AB47BC",
  "Другое": "#BDBDBD"
};

/* ------------------------------------------------------------
   Pie Chart — расходы по категориям
   ------------------------------------------------------------ */
export function renderPieChart(canvas, expenses) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const total = expenses.reduce((s, e) => s + (e.amountBase ?? e.amount), 0);
  if (total === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  let start = 0;

  expenses
    .reduce((acc, e) => {
      const key = e.category || "Другое";
      acc[key] = (acc[key] || 0) + (e.amountBase ?? e.amount);
      return acc;
    }, {})
    .entries = Object.entries;

  const grouped = Object.entries(
    expenses.reduce((acc, e) => {
      const key = e.category || "Другое";
      acc[key] = (acc[key] || 0) + (e.amountBase ?? e.amount);
      return acc;
    }, {})
  );

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  grouped.forEach(([category, value]) => {
    const angle = (value / total) * Math.PI * 2;

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = COLORS[category] || "#999";
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      Math.min(canvas.width, canvas.height) / 2 - 10,
      start,
      start + angle
    );
    ctx.fill();

    start += angle;
  });
}

/* ------------------------------------------------------------
   Line Chart — расходы по дням
   ------------------------------------------------------------ */
export function renderLineChart(canvas, expenses) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const byDate = {};

  expenses.forEach(e => {
    const d = e.date.split("T")[0];
    byDate[d] = (byDate[d] || 0) + (e.amountBase ?? e.amount);
  });

  const entries = Object.entries(byDate).sort((a, b) =>
    a[0] > b[0] ? 1 : -1
  );

  if (entries.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const values = entries.map(e => e[1]);
  const max = Math.max(...values);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#42A5F5";
  ctx.lineWidth = 3;
  ctx.beginPath();

  entries.forEach(([date, value], i) => {
    const x = (i / (entries.length - 1)) * (canvas.width - 20) + 10;
    const y =
      canvas.height - (value / max) * (canvas.height - 20) - 10;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();

  // Точки
  ctx.fillStyle = "#1E88E5";
  entries.forEach(([date, value], i) => {
    const x = (i / (entries.length - 1)) * (canvas.width - 20) + 10;
    const y =
      canvas.height - (value / max) * (canvas.height - 20) - 10;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}
