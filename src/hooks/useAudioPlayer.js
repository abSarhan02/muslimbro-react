import { useCallback, useEffect, useRef, useState } from "react";

// Stato iniziale (nessuna traccia)
const IDLE = { id: null, playing: false, progress: 0, time: "0:00", error: false };

// Formatta i secondi in m:ss
function formatAudioTime(seconds) {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

// =========================
// AUDIO PLAYER
// =========================
// Un solo audio alla volta
// Ogni traccia ha un id (es. "surah-2", "ayah-255")
export function useAudioPlayer() {
  const [state, setState] = useState(IDLE);
  const audioRef = useRef(null);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      // Ferma anche il download
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    }
    setState(IDLE);
  }, []);

  // Stop audio quando esco dalla pagina
  useEffect(() => stop, [stop]);

  const play = useCallback((audio, id) => {
    setState((current) => ({ ...current, playing: true, error: false }));
    audio.play().catch(() => {
      if (audioRef.current !== audio) return;
      setState((current) => ({ ...current, id, playing: false, error: true }));
    });
  }, []);

  // Play/pausa
  const toggle = useCallback(
    (id, url) => {
      const active = audioRef.current;

      // Stessa traccia: pausa o riprendi
      if (active && state.id === id) {
        if (active.paused) {
          play(active, id);
        } else {
          active.pause();
          setState((current) => ({ ...current, playing: false }));
        }
        return;
      }

      // Nuova traccia
      stop();
      const audio = new Audio(url);
      audioRef.current = audio;
      // Ignora gli eventi delle tracce vecchie
      const isCurrent = () => audioRef.current === audio;

      audio.addEventListener("timeupdate", () => {
        if (!isCurrent()) return;
        const progress =
          Number.isFinite(audio.duration) && audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0;
        setState((value) => ({ ...value, progress, time: formatAudioTime(audio.currentTime) }));
      });
      audio.addEventListener("ended", () => {
        if (isCurrent()) setState((value) => ({ ...value, playing: false, progress: 0, time: "0:00" }));
      });
      audio.addEventListener("error", () => {
        if (isCurrent()) setState((value) => ({ ...value, playing: false, error: true }));
      });

      setState({ ...IDLE, id });
      play(audio, id);
    },
    [state.id, play, stop],
  );

  // Barra di avanzamento (0-100)
  const seek = useCallback(
    (id, value) => {
      const audio = audioRef.current;
      if (!audio || state.id !== id || !Number.isFinite(audio.duration)) return;
      audio.currentTime = (Math.max(0, Math.min(100, Number(value))) / 100) * audio.duration;
    },
    [state.id],
  );

  // Stato di una traccia
  const trackState = useCallback((id) => (state.id === id ? state : IDLE), [state]);

  return { toggle, stop, seek, trackState };
}
