// --------------------------------------
// TravelCarPro OS — Global Events System
// --------------------------------------

const Events = {
  init() {
    this.bindClicks();
    this.bindSwipe();
    this.bindButtons();
  },

  // --------------------------------------
  // 1. Глобальные клики
  // --------------------------------------
  bindClicks() {
    document.addEventListener("click", (e) => {
      const target = e.target;

      // Кнопки с data-action
      if (target.dataset.action) {
        this.handleAction(target.dataset.action, target);
      }
    });
  },

  handleAction(action, element) {
    switch (action) {
      case "play":
        Player.toggle();
        break;

      case "scrollTop":
        scrollToTop();
        break;

      case "openAI":
        Router.show("ai");
        break;

      case "openHome":
        Router.show("home");
        break;

      default:
        console.warn("Unknown action:", action);
    }
  },

  // --------------------------------------
  // 2. Свайпы (влево/вправо)
  // --------------------------------------
  bindSwipe() {
    let startX = 0;
    let endX = 0;

    document.addEventListener("touchstart", (e) => {
      startX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].screenX;
      this.detectSwipe(startX, endX);
    });
  },

  detectSwipe(start, end) {
    const diff = end - start;

    if (Math.abs(diff) < 60) return; // минимальная длина свайпа

    if (diff > 0) {
      // свайп вправо
      this.onSwipeRight();
    } else {
      // свайп влево
      this.onSwipeLeft();
    }
  },

  onSwipeLeft() {
    // Пример: переход к AI
    Router.show("ai");
  },

  onSwipeRight() {
    // Пример: переход к Home
    Router.show("home");
  },

  // --------------------------------------
  // 3. Анимация кнопок
  // --------------------------------------
  bindButtons() {
    document.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("mousedown", () => {
        btn.classList.add("click-animate");
      });
      btn.addEventListener("mouseup", () => {
        btn.classList.remove("click-animate");
      });
      btn.addEventListener("mouseleave", () => {
        btn.classList.remove("click-animate");
      });
    });
  }
};

// Делаем доступным глобально
window.Events = Events;

// Инициализация после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  Events.init();
});
