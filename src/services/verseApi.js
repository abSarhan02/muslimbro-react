import { fetchJSON } from "./fetchJSON.js";

// Recupera un versetto in arabo e italiano
export async function getVerse({ surah, ayah }) {
  const result = await fetchJSON(
    `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,it.piccardo`,
  );
  const [arabic, italian] = result.data || [];

  // Controlla che sia il versetto giusto
  const matches = (edition) => edition?.text && edition.surah?.number === surah && edition.numberInSurah === ayah;
  if (result.code !== 200 || !matches(arabic) || !matches(italian))
    throw new Error("Il servizio non ha restituito il versetto selezionato.");

  return { arabic: arabic.text, italian: italian.text };
}
