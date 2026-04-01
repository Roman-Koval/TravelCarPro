/* ============================================================
   TravelCar — Tabs Component
   Вкладки для Trip Details
   ============================================================ */

export function Tabs(active = "list") {
  return `
    <div class="tabs">
      <div class="tab ${active === "list" ? "active" : ""}" data-tab="list">
        Список
      </div>

      <div class="tab ${active === "charts" ? "active" : ""}" data-tab="charts">
        Графики
      </div>

      <div class="tab ${active === "stats" ? "active" : ""}" data-tab="stats">
        Статистика
      </div>
    </div>
  `;
}

/* ============================================================
   Навешиваем события после рендера
   ============================================================ */

export function attachTabsEvents(container, onChange) {
  container.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const name = tab.getAttribute("data-tab");
      onChange && onChange(name);
    });
  });
}
