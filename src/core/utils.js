/* ============================================================
   TravelCar — Utility Functions
   ============================================================ */

/* ------------------------------------------------------------
   Форматирование дат
   ------------------------------------------------------------ */
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

/* ------------------------------------------------------------
   Форматирование суммы
   ------------------------------------------------------------ */
export function formatAmount(amount, currency = "EUR") {
  return `${amount.toFixed(2)} ${currency}`;
}

/* ------------------------------------------------------------
   Сумма расходов
   ------------------------------------------------------------ */
export function sumExpenses(expenses) {
  return expenses.reduce((acc, e) => acc + (e.amountBase ?? e.amount), 0);
}

/* ------------------------------------------------------------
   Определение валюты по стране
   ------------------------------------------------------------ */
export function currencyByCountry(country = "") {
  const c = country.toLowerCase();

  if (c.includes("турция") || c.includes("turkey") || c.includes("türkiye"))
    return "TRY";

  if (c.includes("кипр") || c.includes("cyprus")) {
    // Северный Кипр использует TRY, но часто EUR
    return "TRY";
  }

  // Европа по умолчанию
  return "EUR";
}

/* ------------------------------------------------------------
   Парсинг голосовой команды
   Примеры:
   - "20 евро ужин ресторан"
   - "15 лир такси"
   - "30 lunch food"
   ------------------------------------------------------------ */
export function parseVoiceExpense(text) {
  if (!text) return null;

  const words = text.toLowerCase().trim().split(/\s+/);

  let amount = null;
  let currency = null;
  let rest = [];

  for (const w of words) {
    const num = parseFloat(w.replace(",", "."));
    if (!isNaN(num) && amount === null) {
      amount = num;
      continue;
    }

    if (["eur", "euro", "евро"].includes(w)) {
      currency = "EUR";
      continue;
    }
    if (["lir", "lira", "try", "лир", "лира"].includes(w)) {
      currency = "TRY";
      continue;
    }
    if (["usd", "доллар", "доллара", "dollar"].includes(w)) {
      currency = "USD";
      continue;
    }

    rest.push(w);
  }

  if (amount === null) return null;

  return {
    amount,
    currency: currency || null,
    title: rest.join(" ") || "Голосовой расход",
    category: detectCategory(rest.join(" "))
  };
}

/* ------------------------------------------------------------
   Определение категории по ключевым словам
   ------------------------------------------------------------ */
export function detectCategory(text = "") {
  const t = text.toLowerCase();

  if (t.includes("еда") || t.includes("food") || t.includes("ужин") || t.includes("lunch"))
    return "Еда";

  if (t.includes("такси") || t.includes("taxi") || t.includes("bus") || t.includes("автобус"))
    return "Транспорт";

  if (t.includes("hotel") || t.includes("отель") || t.includes("жиль"))
    return "Жильё";

  if (t.includes("музей") || t.includes("museum") || t.includes("развл"))
    return "Развлечения";

  return "Другое";
}

/* ------------------------------------------------------------
   Debounce
   ------------------------------------------------------------ */
export function debounce(fn, delay = 300) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/* ------------------------------------------------------------
   Throttle
   ------------------------------------------------------------ */
export function throttle(fn, limit = 300) {
  let waiting = false;
  return (...args) => {
    if (waiting) return;
    fn(...args);
    waiting = true;
    setTimeout(() => (waiting = false), limit);
  };
}

/* ------------------------------------------------------------
   Сортировки
   ------------------------------------------------------------ */
export function sortByDateDesc(items, field = "date") {
  return items.slice().sort((a, b) => new Date(b[field]) - new Date(a[field]));
}

export function sortTripsByStartDate(trips) {
  return trips.slice().sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
}

/* ------------------------------------------------------------
   Генерация ID
   ------------------------------------------------------------ */
export function uuid() {
  return "xxxx-4xxx-yxxx-xxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
