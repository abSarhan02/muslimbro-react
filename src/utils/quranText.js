import { SURAH_NAMES_IT } from "../data/surahNames.js";

export const BASMALA = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
export const BASMALA_TRANSLITERATION = "Bismillaahir Rahmaanir Raheem";

// Nome italiano della sura
export function surahTitle(surah) {
  return SURAH_NAMES_IT[surah.number] || surah.englishName || `Sura ${surah.number}`;
}

// Toglie i segni diacritici per confrontare i testi
function normalizedArabic(text) {
  return text.replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, "").replace(/ٱ/g, "ا");
}

// Toglie il basmala dal primo versetto
// (è già nell'intestazione, tranne Fatiha e sura 9)
export function verseText(text, surahNumber, ayahNumber) {
  if (surahNumber === 1 || surahNumber === 9 || ayahNumber !== 1) return text;
  const words = text.trim().split(/\s+/);
  if (normalizedArabic(words.slice(0, 4).join(" ")) !== normalizedArabic(BASMALA)) return text;
  return words.slice(4).join(" ");
}

// Basmala iniziale tranne sura 1 e 9
export function hasOpeningBasmala(surahNumber) {
  return surahNumber !== 1 && surahNumber !== 9;
}

// Numeri arabi (12 -> ١٢)
export function arabicNumber(number) {
  return String(number).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
}

// Filtro della ricerca
export function filterSurahs(surahs, query) {
  const term = query.trim().toLocaleLowerCase("it");
  return surahs.filter((surah) =>
    [surah.name, surahTitle(surah), String(surah.number)].some((text) => text.toLocaleLowerCase("it").includes(term)),
  );
}

// Controlla che il versetto esista
export function validAyah(surah, ayah) {
  return Number.isInteger(ayah) && ayah >= 1 && ayah <= surah.numberOfAyahs ? ayah : null;
}
