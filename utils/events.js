// utils/events.js

const Events = {
  init() {
    this.bindClicks();
  },

  bindClicks() {
    document.addEventListener("click", (e) => {
      const target = e.target;

      // --- 1. Обработка кнопок с data-action ---
      if (target.dataset.action) {
        this.handleAction(target.dataset.action, target);
        return;
      }

      // --- 2. Обработка нижнего меню с data-nav ---
      const nav = target.closest("[data-nav]");
      if (nav) {
        Router.show(nav.dataset.nav);
        return;
      }
    });
  },

  handleAction(action, el) {
    switch (action) {
      case "openHome":
        Router.show("home");
        break;

      case "play":
        Player.toggle();
        break;

      default:
        console.warn("Неизвестное действие:", action);
    }
  }
};

Events.init();
