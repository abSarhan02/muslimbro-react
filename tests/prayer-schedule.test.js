import test from "node:test";
import assert from "node:assert/strict";
import { getPrayerTimes } from "../src/services/prayerApi.js";
import { getNextPrayer, formatCountdown, formatTime } from "../src/utils/prayerTimes.js";

// Orari di prova
const today = [
  { name: "Fajr", time: "05:20" },
  { name: "Sunrise", time: "06:50", sunrise: true },
  { name: "Dhuhr", time: "12:10" },
  { name: "Asr", time: "15:00" },
  { name: "Maghrib", time: "17:10" },
  { name: "Isha", time: "18:40" },
];
const tomorrow = [{ name: "Fajr", time: "05:23" }];

// Risposta dell'API (mock)
test("leggo l'orario del sorgere del sole dal campo Sunrise del servizio", async (context) => {
  context.mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response(
        JSON.stringify({
          code: 200,
          data: { timings: Object.fromEntries(today.map(({ name, time }) => [name, time])) },
        }),
      ),
  );
  const { schedule } = await getPrayerTimes(
    { latitude: 41.9028, longitude: 12.4964 },
    new Date(2026, 10, 14),
  );
  const sunrise = schedule.find((prayer) => prayer.sunrise);
  assert.equal(schedule.length, 6);
  assert.equal(sunrise.name, "Sunrise");
  assert.equal(sunrise.time, "06:50");
});

// Prossima preghiera
test("l'alba non diventa la prossima preghiera", () => {
  const next = getNextPrayer(today, tomorrow, new Date(2026, 10, 14, 6, 0));
  assert.equal(next.name, "Dhuhr");
});

test("dopo Isha uso il Fajr effettivo del giorno seguente", () => {
  const next = getNextPrayer(today, tomorrow, new Date(2026, 11, 31, 23, 0));
  assert.equal(next.time, "05:23");
  assert.equal(next.date.getFullYear(), 2027);
  assert.equal(next.date.getMonth(), 0);
  assert.equal(next.date.getDate(), 1);
  assert.equal(next.tomorrow, true);
});

test("all'orario esatto passo alla preghiera successiva", () => {
  assert.equal(getNextPrayer(today, tomorrow, new Date(2026, 10, 14, 12, 10)).name, "Asr");
});

// Countdown e formato orari
test("il countdown non diventa negativo", () => {
  assert.equal(formatCountdown(new Date(2026, 10, 14, 12), new Date(2026, 10, 14, 12, 1)), "00:00:00");
});

test("accetto il suffisso del fuso e rifiuto orari impossibili", () => {
  assert.equal(formatTime("05:23 (CET)"), "05:23");
  assert.throws(() => formatTime("25:70"));
});
