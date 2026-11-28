import { useId } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery.js";
import "./CalibrationGuide.css";

// Durata di un giro dell'8
const DURATION = "4s";
const KEY_TIMES = "0;0.125;0.25;0.375;0.5;0.625;0.75;0.875;1";
const SMOOTH = Array(8).fill("0.4 0 0.6 1").join(";");

// Percorso a forma di 8 (dritto)
const EIGHT_PATH = "M50 80 C88 50 88 8 50 8 C12 8 12 50 50 80 C88 110 88 152 50 152 C12 152 12 110 50 80 Z";

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
      <svg className="calibration-animation" viewBox="0 -12 100 184" aria-hidden="true">
        <path id={pathId} className="calibration-path" d={EIGHT_PATH} />

        {/* Telefono sorridente che disegna l'8 */}
        <g className="calibration-phone">
          <rect x="-12" y="-20" width="24" height="40" rx="5" className="calibration-phone-body" />
          <rect x="-9" y="-15" width="18" height="28" rx="2" className="calibration-phone-screen" />
          <circle cx="-4" cy="-4" r="1.6" className="calibration-phone-face" />
          <circle cx="4" cy="-4" r="1.6" className="calibration-phone-face" />
          <path d="M-4.5 2 Q0 6.5 4.5 2" className="calibration-phone-smile" />
          {/* Sempre inclinato: pende verso dove va, ai lati dell'8 gira di faccia (si vede di lato) */}
          {!reducedMotion && (
            <>
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="45;0;-45;0;45;0;-45;0;45"
                keyTimes={KEY_TIMES}
                calcMode="spline"
                keySplines={SMOOTH}
                dur={DURATION}
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="transform"
                type="scale"
                additive="sum"
                values="1 1;0.25 1;1 1;0.25 1;1 1;0.25 1;1 1;0.25 1;1 1"
                keyTimes={KEY_TIMES}
                calcMode="spline"
                keySplines={SMOOTH}
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
        La bussola del telefono ogni tanto si confonde. Disegna un 8 nell’aria e intanto ruotalo, inclinandolo e
        girandolo di faccia lungo la curva, per qualche secondo: così ritrova il nord.
      </p>
      <p className="calibration-tip">Meglio lontano da metalli, calamite e cover con magnete.</p>

      <button className="button button-light calibration-button" type="button" onClick={onDone}>
        Fatto, andiamo!
      </button>
    </section>
  );
}
