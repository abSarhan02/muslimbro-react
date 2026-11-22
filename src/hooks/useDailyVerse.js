import { useCallback, useEffect, useRef, useState } from "react";
import { FEATURED_VERSES } from "../data/featuredVerses.js";
import { getVerse } from "../services/quranApi.js";
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

  // Scarica il versetto numero index della lista
  const fetchVerse = useCallback((index) => {
    const request = ++requestRef.current;
    const isCurrent = () => request === requestRef.current;

    getVerse(FEATURED_VERSES[index])
      .then((text) => {
        if (!isCurrent()) return;
        indexRef.current = index;
        setVerse({ ...FEATURED_VERSES[index], ...text });
      })
      .catch((error) => {
        if (!isCurrent()) return;
        setFailed(true);
        console.error("Caricamento del versetto non riuscito:", error);
      })
      .finally(() => {
        if (isCurrent()) setLoading(false);
      });
  }, []);

  // Mostra il caricamento e scarica
  const load = useCallback(
    (index) => {
      setLoading(true);
      setFailed(false);
      fetchVerse(index);
    },
    [fetchVerse],
  );

  // Primo caricamento
  useEffect(() => {
    fetchVerse(getDailyVerseIndex());
  }, [fetchVerse]);

  // A mezzanotte carica il nuovo versetto
  useEffect(() => {
    let timer;
    const scheduleMidnight = () => {
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(() => {
        load(getDailyVerseIndex());
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
    retry: () => load(indexRef.current ?? getDailyVerseIndex()),
    randomize: () => load(getRandomVerseIndex(indexRef.current)),
  };
}
