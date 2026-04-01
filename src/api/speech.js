/* ============================================================
   TravelCar — Speech Recognition API
   Поддержка RU / EN
   Автоматический парсинг суммы, валюты, категории
   ============================================================ */

import { state } from "../core/state.js";
import { parseVoiceExpense } from "../core/utils.js";

/* ------------------------------------------------------------
   Инициализация SpeechRecognition
   ------------------------------------------------------------ */
function createRecognizer() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) return null;

  const rec = new SpeechRecognition();

  rec.lang = state.settings.language === "ru" ? "ru-RU" : "en-US";
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  return rec;
}

/* ------------------------------------------------------------
   Голосовой ввод расхода
   ------------------------------------------------------------ */
export function startVoiceInput({ onStart, onResult, onError, onEnd } = {}) {
  const recognizer = createRecognizer();

  if (!recognizer) {
    onError && onError("Голосовой ввод не поддерживается на этом устройстве");
    return;
  }

  if (onStart) onStart();

  recognizer.onstart = () => {
    if (onStart) onStart();
  };

  recognizer.onerror = event => {
    console.warn("Speech error:", event.error);
    if (onError) onError("Ошибка распознавания речи");
  };

  recognizer.onresult = event => {
    const text = event.results[0][0].transcript;
    const parsed = parseVoiceExpense(text);

    if (!parsed) {
      onError && onError("Не удалось распознать сумму");
      return;
    }

    onResult && onResult(parsed);
  };

  recognizer.onend = () => {
    if (onEnd) onEnd();
  };

  recognizer.start();
}
