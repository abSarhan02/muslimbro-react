import { useCallback, useEffect, useRef, useState } from "react";
import { FEATURED_VERSES } from "../data/featuredVerses.js";
import { getVerse } from "../services/verseApi.js";
import { getDailyVerseIndex, getRandomVerseIndex } from "../utils/dailyVerse.js";

// Versetto del giorno
// Cambia a mezzanotte o con il pulsante "Cambia versetto"
export function useDailyVerse() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const indexRef = useRef(null);
  // Per ignorare le risposte vecchie
  const requestRef = useRef(0);

  const load = useCallback(async ({ randomize = false } = {}) => {
    const request = ++requestRef.current;
    setLoading(true);
    setFailed(false);

    const index = randomize ? getRandomVerseIndex(indexRef.current) : (indexRef.current ?? getDailyVerseIndex());
    const reference = FEATURED_VERSES[index];

    try {
      const text = await getVerse(reference);
      if (request !== requestRef.current) return;
      indexRef.current = index;
      setVerse({ ...reference, ...text });
    } catch (error) {
      if (request !== requestRef.current) return;
      setFailed(true);
      console.error("Caricamento del versetto non riuscito:", error);
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // A mezzanotte carica il nuovo versetto
  useEffect(() => {
    let timer;
    const scheduleMidnight = () => {
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(() => {
        indexRef.current = null;
        load();
        scheduleMidnight();
      }, nextDay - now);
    };
    scheduleMidnight();
    return () => clearTimeout(timer);
  }, [load]);

  return {
    verse,
    loading,
    failed,
    retry: () => load(),
    randomize: () => load({ randomize: true }),
  };
}
