// --------------------------------------
// TravelCarPro OS — Player UI Controller
// --------------------------------------

function initPlayerUI() {
  const bar = document.querySelector(".player-bar");
  if (!bar) return;

  const btn = bar.querySelector("button");
  if (!btn) return;

  // Кнопка ▶️ / ⏸
  btn.onclick = () => {
    Player.toggle();
  };

  // Обновляем UI при загрузке
  Player.updateUI();
}

// Запуск UI после загрузки DOM
document.addEventListener("DOMContentLoaded", initPlayerUI);

// Делаем доступным глобально
window.initPlayerUI = initPlayerUI;
