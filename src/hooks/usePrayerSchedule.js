import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentLocation } from "../services/locationService.js";
import { getPrayerTimes } from "../services/prayerApi.js";
import { getNextPrayer, localDateKey } from "../utils/prayerTimes.js";

const INITIAL_STATE = {
  status: "loading", // "loading" | "ready" | "error"
  locating: true,
  location: null,
  today: [],
  tomorrow: [],
  hijri: null,
  date: null,
  dayKey: "",
  error: "",
};

// =========================
// ORARI DI PREGHIERA
// =========================
// 1. posizione
// 2. orari di oggi e domani (Fajr di domani)
// 3. countdown ogni secondo
export function usePrayerSchedule() {
  const [state, setState] = useState(INITIAL_STATE);
  const [now, setNow] = useState(() => new Date());
  const loadingRef = useRef(false);
  const locationRef = useRef(null);

  // reuseLocation: a mezzanotte riusa la posizione
  const load = useCallback(async ({ reuseLocation = false } = {}) => {
    if (loadingRef.current) return; // Evita doppi caricamenti
    loadingRef.current = true;

    const locating = !reuseLocation || !locationRef.current;
    setState((current) => ({ ...current, status: "loading", locating, error: "" }));

    try {
      if (locating) locationRef.current = await getCurrentLocation();
      const location = locationRef.current;

      // Mostra subito la posizione (serve alla Qibla)
      setState((current) => ({ ...current, location, locating: false }));

      const day = new Date();
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const [todayTimes, tomorrowTimes] = await Promise.all([
        getPrayerTimes(location, day),
        getPrayerTimes(location, nextDay),
      ]);

      setState({
        status: "ready",
        locating: false,
        location,
        today: todayTimes.schedule,
        tomorrow: tomorrowTimes.schedule,
        hijri: todayTimes.hijri ?? null,
        date: day,
        dayKey: localDateKey(day),
        error: "",
      });
      setNow(new Date());
    } catch (error) {
      setState((current) => ({
        ...current,
        status: "error",
        locating: false,
        location: locationRef.current,
        today: [],
        tomorrow: [],
        error: `${error.message} Controlla la connessione e riprova.`,
      }));
    } finally {
      loadingRef.current = false;
    }
  }, []);

  // Primo caricamento
  useEffect(() => {
    load();
  }, [load]);

  // Aggiorna l'ora ogni secondo
  // e quando torno sulla scheda del browser
  const ready = state.status === "ready";
  useEffect(() => {
    if (!ready) return;
    const tick = () => setNow(new Date());
    const interval = setInterval(tick, 1000);
    const onVisibilityChange = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [ready]);

  // A mezzanotte ricarica gli orari
  const dayChanged = ready && localDateKey(now) !== state.dayKey;
  useEffect(() => {
    if (dayChanged) load({ reuseLocation: true });
  }, [dayChanged, load]);

  const next = state.today.length && !dayChanged ? getNextPrayer(state.today, state.tomorrow, now) : null;

  return { ...state, now, next, reload: load };
}
