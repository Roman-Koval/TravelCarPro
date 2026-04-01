/* ============================================================
   TravelCar — Skeleton Loading Component
   Скелет‑загрузка для списков
   ============================================================ */

export function SkeletonTripCard() {
  return `
    <div class="skeleton-card fade-in">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-subtitle"></div>
      <div class="skeleton skeleton-subtitle short"></div>
      <div class="skeleton skeleton-progress"></div>
    </div>
  `;
}

export function SkeletonExpenseCard() {
  return `
    <div class="skeleton-expense fade-in">
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line short"></div>
    </div>
  `;
}

/* ============================================================
   Генерация нескольких скелетов
   ============================================================ */

export function SkeletonList(count = 3, type = "trip") {
  let html = "";
  for (let i = 0; i < count; i++) {
    html += type === "trip" ? SkeletonTripCard() : SkeletonExpenseCard();
  }
  return html;
}
