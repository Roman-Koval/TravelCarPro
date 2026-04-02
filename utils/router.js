// utils/router.js

const Router = {
  current: "home",

  show(page) {
    this.current = page;

    document.querySelectorAll("[data-page]").forEach((p) => {
      p.style.display = p.dataset.page === page ? "block" : "none";
    });

    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.nav === page);
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  Router.show("home");
});
