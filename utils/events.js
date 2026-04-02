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
        this.handleAction(target.dataset.action, target);
        return;
      }

      // 2) Нижнее меню с data-nav (клик по иконке, тексту или самому блоку)
      const nav = target.closest(".nav-item[data-nav]");
      if (nav) {
        const page = nav.dataset.nav;
        Router.show(page);
        return;
      }

      // 3) Кнопки на главной с data-nav
      const btnNav = target.closest("button[data-nav]");
      if (btnNav) {
        const page = btnNav.dataset.nav;
        Router.show(page);
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
        if (typeof Player !== "undefined" && Player.toggle) {
          Player.toggle();
        }
        break;

      default:
        console.warn("Неизвестное действие:", action);
    }
  }
};

Events.init();
