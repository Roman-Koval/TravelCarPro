/* ============================================================
   TravelCar — Geolocation + Reverse Geocode API
   Источник геокодинга: Nominatim (OpenStreetMap)
   ============================================================ */

/*
  Возможности:
  ✔ Получение координат пользователя
  ✔ Reverse geocode → город, страна
  ✔ Fallback при отсутствии сети
  ✔ Интеграция с сервис‑воркером (runtime cache)
*/

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

/* ------------------------------------------------------------
   Получение координат
   ------------------------------------------------------------ */
export function getCurrentPosition() {
  return new Promise(resolve => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
      },
      err => {
        console.warn("Геолокация недоступна:", err);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000
      }
    );
  });
}

/* ------------------------------------------------------------
   Reverse geocode → город, страна
   ------------------------------------------------------------ */
export async function reverseGeocode(lat, lon) {
  if (!lat || !lon) return null;

  const url =
    `${NOMINATIM_URL}?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "TravelCar PWA"
      }
    });

    const data = await res.json();

    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.municipality ||
      "";

    const country = data.address.country || "";

    return { city, country };
  } catch (e) {
    console.warn("Ошибка reverse geocode:", e);
    return null;
  }
}

/* ------------------------------------------------------------
   Полная функция: координаты + город/страна
   ------------------------------------------------------------ */
export async function getLocationFull() {
  const coords = await getCurrentPosition();
  if (!coords) return null;

  const place = await reverseGeocode(coords.lat, coords.lon);

  return {
    lat: coords.lat,
    lon: coords.lon,
    city: place?.city || "",
    country: place?.country || ""
  };
}
