/* ============================================================
   TravelCar — Currency API
   Автоконвертация EUR / TRY / USD
   Источник: https://api.exchangerate.host
   ============================================================ */

import { state } from "../core/state.js";

/* ------------------------------------------------------------
   Получение курса валют
   ------------------------------------------------------------ */
export async function getRate(from, to) {
  if (!from || !to || from === to) return 1;

  const url = `https://api.exchangerate.host/latest?base=${from}&symbols=${to}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.rates && data.rates[to]) {
      return data.rates[to];
    }

    return 1;
  } catch (e) {
    console.warn("Ошибка получения курса валют:", e);
    return 1;
  }
}

/* ------------------------------------------------------------
   Конвертация суммы
   ------------------------------------------------------------ */
export async function convertAmount(amount, from, to) {
  if (!amount || !from || !to || from === to) return amount;

  const rate = await getRate(from, to);
  return amount * rate;
}

/* ------------------------------------------------------------
   Автоматическая конвертация расхода в валюту поездки
   ------------------------------------------------------------ */
export async function convertExpense(expense, tripCurrency) {
  const from = expense.currency || tripCurrency;
  const to = tripCurrency;

  const converted = await convertAmount(expense.amount, from, to);

  return {
    ...expense,
    amountBase: converted
  };
}

/* ------------------------------------------------------------
   Определение валюты по ключевым словам
   (используется в голосовом вводе)
   ------------------------------------------------------------ */
export function detectCurrencyFromText(text = "") {
  const t = text.toLowerCase();

  if (t.includes("евро") || t.includes("eur") || t.includes("euro")) return "EUR";
  if (t.includes("лир") || t.includes("lira") || t.includes("try")) return "TRY";
  if (t.includes("usd") || t.includes("доллар")) return "USD";

  return null;
}

/* ------------------------------------------------------------
   Валюта по стране
   ------------------------------------------------------------ */
export function currencyByCountry(country = "") {
  const c = country.toLowerCase();

  if (c.includes("турция") || c.includes("turkey") || c.includes("türkiye"))
    return "TRY";

  if (c.includes("кипр") || c.includes("cyprus"))
    return "TRY"; // Северный Кипр

  return "EUR"; // Европа по умолчанию
}
