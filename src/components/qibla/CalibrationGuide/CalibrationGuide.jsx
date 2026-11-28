import { useId } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery.js";
import "./CalibrationGuide.css";

// Durata di un giro dell'8
const DURATION = "3.6s";

// Percorso a forma di 8 (orizzontale)
const EIGHT_PATH = "M100 50 C130 12 178 12 178 50 C178 88 130 88 100 50 C70 12 22 12 22 50 C22 88 70 88 100 50 Z";

// =========================
// GUIDA CALIBRAZIONE
// =========================
// Compare ogni volta che si apre la Qibla
export function CalibrationGuide({ onDone }) {
  const titleId = useId();
  const pathId = useId();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <section className="calibration-guide" aria-labelledby={titleId}>
      <svg className="calibration-animation" viewBox="0 0 200 100" aria-hidden="true">
        <path id={pathId} className="calibration-path" d={EIGHT_PATH} />

        {/* Telefono sorridente che disegna l'8 */}
        <g className="calibration-phone">
          <rect x="-12" y="-20" width="24" height="40" rx="5" className="calibration-phone-body" />
          <rect x="-9" y="-15" width="18" height="28" rx="2" className="calibration-phone-screen" />
          <circle cx="-4" cy="-4" r="1.6" className="calibration-phone-face" />
          <circle cx="4" cy="-4" r="1.6" className="calibration-phone-face" />
          <path d="M-4.5 2 Q0 6.5 4.5 2" className="calibration-phone-smile" />
          {/* Si inclina verso dove va: a destra, poi a sinistra, poi di nuovo a destra */}
          {!reducedMotion && (
            <>
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="35;0;-35;0;35"
                keyTimes="0;0.25;0.5;0.75;1"
                calcMode="spline"
                keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
                dur={DURATION}
                repeatCount="indefinite"
              />
              <animateMotion dur={DURATION} repeatCount="indefinite" rotate="0">
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </>
          )}
        </g>
      </svg>

      <h4 id={titleId}>Facciamo un 8?</h4>
      <p>
        La bussola del telefono ogni tanto si confonde. Tienilo dritto e disegna un 8 nell’aria, inclinandolo seguendo
        la curva, per qualche secondo: così ritrova il nord.
      </p>
      <p className="calibration-tip">Meglio lontano da metalli, calamite e cover con magnete.</p>

      <button className="button button-light calibration-button" type="button" onClick={onDone}>
        Fatto, andiamo!
      </button>
    </section>
  );
}
