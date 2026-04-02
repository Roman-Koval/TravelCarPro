// --------------------------------------
// TravelCarPro OS — Mini Router
// --------------------------------------

const Router = {
  currentPage: null,

  init() {
    // Находим все страницы
    this.pages = document.querySelectorAll("[data-page]");
    this.show("home"); // стартовая страница
  },

  // Показать страницу
  show(pageName) {
    this.currentPage = pageName;

    this.pages.forEach(page => {
      if (page.dataset.page === pageName) {
        page.style.display = "block";
        page.classList.add("fade-in");
      } else {
        page.style.display = "none";
        page.classList.remove("fade-in");
      }
    });

    // Обновляем URL (не обязательно)
    history.replaceState({}, "", `#${pageName}`);
  },

  // Навигация по ссылкам
  bindLinks() {
    document.querySelectorAll("[data-nav]").forEach(link => {
      link.onclick = () => {
        const target = link.dataset.nav;
        this.show(target);
        scrollToTop();
      };
    });
  }
};

// Делаем доступным глобально
window.Router = Router;

// Инициализация после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  Router.init();
  Router.bindLinks();
});
