// Funzioni per orari e countdown
// (testate in tests/prayer-schedule.test.js)

// "05:23 (CET)" -> "05:23"
export function formatTime(value) {
  const time = String(value).split(" ")[0];
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error("Il servizio ha restituito un orario non valido.");
  return time;
}

// Data di oggi come stringa (per capire quando cambia il giorno)
export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// "12:10" -> Date
function buildPrayerDate(time, day = new Date()) {
  const [hours, minutes] = formatTime(time).split(":").map(Number);
  const result = new Date(day);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

// Prossima preghiera (l'alba non conta)
// Dopo l'Isha prende il Fajr di domani
export function getNextPrayer(today, tomorrow, now = new Date()) {
  const next = today.find((prayer) => !prayer.sunrise && buildPrayerDate(prayer.time, now) > now);
  if (next) return { ...next, date: buildPrayerDate(next.time, now), tomorrow: false };

  const fajr = tomorrow.find((prayer) => prayer.name === "Fajr");
  if (!fajr) throw new Error("L'orario del Fajr di domani non è disponibile.");
  const nextDay = new Date(now);
  nextDay.setDate(nextDay.getDate() + 1);
  return { ...fajr, date: buildPrayerDate(fajr.time, nextDay), tomorrow: true };
}

// Countdown HH:MM:SS
export function formatCountdown(target, now = new Date()) {
  const total = Math.max(0, Math.floor((target - now) / 1000));
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}
