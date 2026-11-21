import { useCallback, useEffect, useRef, useState } from "react";
import { angleDifference, headingFromOrientation, smoothAngle } from "../utils/qibla.js";

const INITIAL_STATUS = "Tieni il telefono in piano, poi attiva la bussola.";

// Timeout se la bussola non risponde
const COMPASS_TIMEOUT = 8000;

// Sopra questi gradi di errore (iOS) consiglio la calibrazione
const POOR_ACCURACY = 20;

// Rotazione dello schermo (0 in verticale, 90/270 in orizzontale)
function screenAngle() {
  return screen.orientation?.angle ?? window.orientation ?? 0;
}

// =========================
// BUSSOLA
// =========================
// heading: direzione del telefono in gradi (0-360)
// rotation: lo stesso angolo ma senza salti 359 -> 0 (per le animazioni CSS)
// Su iOS il permesso va chiesto al click
export function useCompass() {
  const [heading, setHeading] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [buttonLabel, setButtonLabel] = useState("Attiva bussola");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [poorAccuracy, setPoorAccuracy] = useState(false);

  const headingRef = useRef(null);
  const rotationRef = useRef(0);
  const timeoutRef = useRef(null);
  const frameRef = useRef(0);
  const listeningRef = useRef(false);
  const absoluteRef = useRef(false); // arrivano eventi "deviceorientationabsolute"

  // Chiamata quando il telefono si muove
  const handleOrientation = useCallback((event) => {
    // Se il browser manda gli eventi assoluti uso solo quelli (sono più affidabili)
    if (event.type === "deviceorientationabsolute") absoluteRef.current = true;
    else if (absoluteRef.current && !Number.isFinite(event.webkitCompassHeading)) return;

    const value = headingFromOrientation(event, screenAngle());
    if (value === null) return;

    const firstReading = headingRef.current === null;
    const previous = headingRef.current;
    headingRef.current = smoothAngle(previous, value);
    rotationRef.current = firstReading ? headingRef.current : rotationRef.current + angleDifference(previous, headingRef.current);

    // Aggiorno React al massimo una volta per frame
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = 0;
        setHeading(headingRef.current);
        setRotation(rotationRef.current);
      });
    }

    // iOS dice quanto è precisa la lettura (in gradi, -1 = non affidabile)
    if (Number.isFinite(event.webkitCompassAccuracy)) {
      const accuracy = event.webkitCompassAccuracy;
      setPoorAccuracy(accuracy < 0 || accuracy > POOR_ACCURACY);
    }

    if (firstReading) {
      // Dati arrivati, tolgo il timeout
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setButtonLabel("Bussola attiva");
      setButtonDisabled(true);
      setStatus("Ruota il telefono finché la Kaaba arriva in alto.");
    }
  }, []);

  // Rimuovi i listener
  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(frameRef.current);
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
      setStatus("Questo dispositivo non ha una bussola. Usa i gradi da nord.");
      return;
    }

    // Permesso (solo iOS)
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const permission = await DeviceOrientationEvent.requestPermission(true);
        if (permission !== "granted") {
          setStatus("Accesso ai sensori non autorizzato. Puoi usare i gradi da nord.");
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
      window.addEventListener("deviceorientationabsolute", handleOrientation);
      window.addEventListener("deviceorientation", handleOrientation);
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

  return { heading, rotation, status, poorAccuracy, buttonLabel, buttonDisabled, enable };
}
