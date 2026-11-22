import { DEFAULT_RECITER } from "../data/reciters.js";
import { fetchJSON } from "./fetchJSON.js";

const BASE_URL = "https://api.alquran.cloud/v1";

// Cache, così non riscarico le sure
let surahListCache = null;
const surahCache = new Map();

// Lista delle sure
export function getSurahs() {
  if (!surahListCache) {
    surahListCache = fetchJSON(`${BASE_URL}/surah`)
      .then((result) => {
        if (result.code !== 200 || !Array.isArray(result.data)) throw new Error("La lista delle sure non è disponibile.");
        return result.data;
      })
      .catch((error) => {
        // Se fallisce svuota la cache
        surahListCache = null;
        throw error;
      });
  }
  return surahListCache;
}

// Testo della sura: arabo, italiano e traslitterazione
export function getSurah(number) {
  if (!Number.isInteger(number) || number < 1 || number > 114)
    return Promise.reject(new Error("Numero della sura non valido."));

  if (!surahCache.has(number)) {
    const request = fetchJSON(`${BASE_URL}/surah/${number}/editions/quran-uthmani,it.piccardo,en.transliteration`)
      .then((result) => {
        if (result.code !== 200 || !Array.isArray(result.data)) throw new Error("Il testo della sura non è disponibile.");
        const [arabic, italian, transliteration] = result.data;
        const isValid = (edition) => edition?.number === number && Array.isArray(edition.ayahs);
        if (!isValid(arabic) || !isValid(italian) || !isValid(transliteration))
          throw new Error("Il testo della sura non è disponibile.");
        return { arabic, italian, transliteration };
      })
      .catch((error) => {
        surahCache.delete(number);
        throw error;
      });
    surahCache.set(number, request);
  }
  return surahCache.get(number);
}

// Un versetto in arabo e italiano (versetto del giorno)
export async function getVerse({ surah, ayah }) {
  const result = await fetchJSON(`${BASE_URL}/ayah/${surah}:${ayah}/editions/quran-uthmani,it.piccardo`);
  const [arabic, italian] = result.data || [];

  // Controlla che sia il versetto giusto
  const matches = (edition) => edition?.text && edition.surah?.number === surah && edition.numberInSurah === ayah;
  if (result.code !== 200 || !matches(arabic) || !matches(italian))
    throw new Error("Il servizio non ha restituito il versetto selezionato.");

  return { arabic: arabic.text, italian: italian.text };
}

// Audio della sura (numero a 3 cifre: 001, 002...)
export function surahAudioUrl(number, reciter = DEFAULT_RECITER) {
  return `https://download.quranicaudio.com/quran/${reciter.folder}/${String(number).padStart(3, "0")}.mp3`;
}

// Audio del versetto (numero globale)
export function ayahAudioUrl(globalNumber) {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNumber}.mp3`;
}
