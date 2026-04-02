// ------------------------------
// TravelCarPro OS — Player Module
// ------------------------------

const Player = {
  audio: null,
  currentTrack: null,
  isPlaying: false,

  init() {
    this.audio = new Audio();
    this.audio.preload = "auto";

    // Обработчики событий
    this.audio.onended = () => {
      this.isPlaying = false;
      Player.updateUI();
    };
  },

  load(trackName) {
    this.currentTrack = `/tracks/${trackName}`;
    this.audio.src = this.currentTrack;
  },

  play() {
    if (!this.currentTrack) {
      alert("Нет выбранного трека. Добавьте файлы в /tracks/");
      return;
    }

    this.audio.play();
    this.isPlaying = true;
    this.updateUI();
  },

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateUI();
  },

  toggle() {
    if (this.isPlaying) this.pause();
    else this.play();
  },

  updateUI() {
    const btn = document.querySelector(".player-bar button");
    if (!btn) return;

    btn.textContent = this.isPlaying ? "⏸" : "▶️";
  }
};

// Инициализация плеера
Player.init();

// Делаем доступным глобально
window.Player = Player;
