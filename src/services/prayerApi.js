import { PRAYERS } from "../data/prayers.js";
import { formatTime } from "../utils/prayerTimes.js";
import { fetchJSON } from "./fetchJSON.js";

// Testo sotto gli orari
export const CALCULATION_LABEL = "Calcolo Muslim World League · AlAdhan";

// Funzione per ottenere gli orari di preghiera (API AlAdhan)
// method 3 = Muslim World League
export async function getPrayerTimes(location, day = new Date()) {
  // Data in formato GG-MM-AAAA
  const date = [day.getDate(), day.getMonth() + 1, day.getFullYear()]
    .map((part) => String(part).padStart(2, "0"))
    .join("-");

  const query = new URLSearchParams({
    method: "3",
    school: "0",
    latitudeAdjustmentMethod: "1",
    timezonestring: Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Rome",
    latitude: String(location.latitude),
    longitude: String(location.longitude),
  });

  const result = await fetchJSON(`https://api.aladhan.com/v1/timings/${date}?${query}`);
  if (result.code !== 200 || !result.data?.timings)
    throw new Error("Il servizio non ha restituito gli orari di preghiera.");

  return {
    schedule: PRAYERS.map((prayer) => ({
      ...prayer,
      time: formatTime(result.data.timings[prayer.name]),
    })),
    hijri: result.data.date?.hijri,
  };
}
