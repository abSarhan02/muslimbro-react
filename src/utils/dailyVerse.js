import { FEATURED_VERSES } from "../data/featuredVerses.js";

// Versetto del giorno (cambia a mezzanotte)
export function getDailyVerseIndex(date = new Date()) {
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  const count = FEATURED_VERSES.length;
  return (((dayNumber * 997 + 1729) % count) + count) % count;
}

// Versetto casuale diverso da quello attuale
export function getRandomVerseIndex(currentIndex) {
  const count = FEATURED_VERSES.length;
  const index = Math.floor(Math.random() * count);
  if (index !== currentIndex) return index;
  return (index + 1 + Math.floor(Math.random() * (count - 1))) % count;
}
