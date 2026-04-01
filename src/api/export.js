/* ============================================================
   TravelCar — Export API
   Экспорт CSV / JSON
   Авто‑экспорт на email
   ============================================================ */

import { state } from "../core/state.js";

/* ------------------------------------------------------------
   Экспорт JSON
   ------------------------------------------------------------ */
export function exportJSON() {
  const data = {
    exportedAt: new Date().toISOString(),
    trips: state.trips,
    settings: state.settings
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8"
  });

  downloadBlob(blob, "travelcar-export.json");
}

/* ------------------------------------------------------------
   Экспорт CSV
   ------------------------------------------------------------ */
export function exportCSV() {
  const rows = [
    [
      "tripTitle",
      "tripCity",
      "tripCountry",
      "date",
      "category",
      "title",
      "amountOriginal",
      "currencyOriginal",
      "amountConverted",
      "tripCurrency",
      "locationCity",
      "locationCountry"
    ]
  ];

  state.trips.forEach(trip => {
    trip.expenses.forEach(e => {
      rows.push([
        `"${trip.title}"`,
        `"${trip.city}"`,
        `"${trip.country}"`,
        `"${e.date}"`,
        `"${e.category}"`,
        `"${e.title}"`,
        e.amount,
        `"${e.currency}"`,
        e.amountBase ?? e.amount,
        `"${trip.currency}"`,
        `"${e.city}"`,
        `"${e.country}"`
      ]);
    });
  });

  const csv = rows.map(r => r.join(",")).join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8"
  });

  downloadBlob(blob, "travelcar-export.csv");
}

/* ------------------------------------------------------------
   Авто‑экспорт на email
   (через mailto — без сервера)
   ------------------------------------------------------------ */
export function autoExportEmail() {
  const email = state.settings.autoExportEmail;
  if (!email) {
    alert("Укажите email в настройках");
    return;
  }

  const subject = encodeURIComponent("TravelCar — экспорт данных");
  const body = encodeURIComponent(
    "Экспорт данных выполнен.\n\n" +
      "JSON-файл прикреплён вручную.\n" +
      "CSV можно экспортировать в приложении."
  );

  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

/* ------------------------------------------------------------
   Вспомогательная функция скачивания
   ------------------------------------------------------------ */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
