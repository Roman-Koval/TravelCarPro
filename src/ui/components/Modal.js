/* ============================================================
   TravelCar — Modal Component
   Универсальное модальное окно
   ============================================================ */

export function Modal({ title = "", content = "", buttons = [] }) {
  return `
    <div class="modal-overlay fade-in" id="modal-overlay">
      <div class="modal-window slide-up">
        
        ${title ? `<div class="modal-title">${title}</div>` : ""}

        <div class="modal-content">
          ${content}
        </div>

        <div class="modal-buttons">
          ${buttons
            .map(
              b => `
            <button class="btn ${b.type || "primary"}" data-action="${b.action}">
              ${b.label}
            </button>
          `
            )
            .join("")}
        </div>

      </div>
    </div>
  `;
}

/* ============================================================
   Навешиваем события после рендера
   ============================================================ */

export function attachModalEvents(onAction, onClose) {
  const overlay = document.getElementById("modal-overlay");
  if (!overlay) return;

  // Закрытие по клику вне окна
  overlay.addEventListener("click", e => {
    if (e.target.id === "modal-overlay") {
      onClose && onClose();
    }
  });

  // Кнопки
  overlay.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      onAction && onAction(action);
    });
  });
}
