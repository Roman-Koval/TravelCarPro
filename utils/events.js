// utils/events.js

const Events = {
  init() {
    this.bindClicks();
  },

  bindClicks() {
    document.addEventListener("click", (e) => {
      const target = e.target;

      // 1) Кнопки с data-action
      if (target.dataset.action) {
        this.handleAction(target.dataset.action);
        return;
      }

      // 2) Нижнее меню
      const nav = target.closest(".nav-item[data-nav]");
      if (nav) {
        Router.show(nav.dataset.nav);
        return;
      }

      // 3) Кнопки на страницах
      const btnNav = target.closest("button[data-nav]");
      if (btnNav) {
        Router.show(btnNav.dataset.nav);
        return;
      }
    });
  },

  handleAction(action) {
    switch (action) {
      case "openHome":
        Router.show("home");
        break;

      case "play":
        if (window.Player && Player.toggle) Player.toggle();
        break;

      default:
        console.warn("Неизвестное действие:", action);
    }
  }
};

Events.init();
