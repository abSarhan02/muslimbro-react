import { useCallback, useEffect, useRef, useState } from "react";
import { headingFromOrientation } from "../utils/qibla.js";

const INITIAL_STATUS = "Tieni il telefono in piano, poi attiva la bussola.";

// Timeout se la bussola non risponde
const COMPASS_TIMEOUT = 8000;

// =========================
// BUSSOLA
// =========================
// heading: direzione del telefono in gradi
// Su iOS il permesso va chiesto al click
export function useCompass() {
  const [heading, setHeading] = useState(null);
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [buttonLabel, setButtonLabel] = useState("Attiva bussola");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const headingRef = useRef(null);
  const timeoutRef = useRef(null);
  const listeningRef = useRef(false);

  // Chiamata quando il telefono si muove
  const handleOrientation = useCallback((event) => {
    const value = headingFromOrientation(event);
    if (value === null) return;

    headingRef.current = value;
    setHeading(value);

    // Dati arrivati, tolgo il timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setButtonLabel("Bussola attiva");
    setButtonDisabled(true);
    setStatus("Ruota il telefono finché la freccia punta in alto.");
  }, []);

  // Rimuovi i listener
  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("deviceorientationabsolute", handleOrientation);
    },
    [handleOrientation],
  );

  async function enable() {
    // Serve HTTPS
    if (!window.isSecureContext) {
      setStatus("Per attivare la bussola apri il sito tramite HTTPS.");
      return;
    }
    if (typeof DeviceOrientationEvent === "undefined") {
      setStatus("Questo dispositivo non espone una bussola. La direzione da nord resta disponibile.");
      return;
    }

    // Permesso (solo iOS)
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const permission = await DeviceOrientationEvent.requestPermission(true);
        if (permission !== "granted") {
          setStatus("Accesso ai sensori non autorizzato. Puoi usare la direzione indicata da nord.");
          setButtonLabel("Riprova bussola");
          return;
        }
      } catch (error) {
        setStatus("Non è stato possibile attivare i sensori. Verifica le autorizzazioni del browser.");
        console.error("Autorizzazione della bussola non riuscita:", error);
        setButtonLabel("Riprova bussola");
        return;
      }
    }

    // Aggiungi i listener una volta sola
    if (!listeningRef.current) {
      window.addEventListener("deviceorientation", handleOrientation);
      window.addEventListener("deviceorientationabsolute", handleOrientation);
      listeningRef.current = true;
    }

    setButtonLabel("Attendo la bussola…");
    setButtonDisabled(true);
    setStatus("In attesa della bussola. Tieni il telefono in piano.");

    // Se non arriva niente mostra un errore
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      if (headingRef.current !== null) return;
      setButtonDisabled(false);
      setButtonLabel("Riprova bussola");
      setStatus("Non arrivano dati dalla bussola. Verifica il permesso dei sensori e usa il sito tramite HTTPS.");
    }, COMPASS_TIMEOUT);
  }

  return { heading, status, buttonLabel, buttonDisabled, enable };
}
