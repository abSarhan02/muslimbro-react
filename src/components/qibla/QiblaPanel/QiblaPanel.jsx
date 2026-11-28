import { useEffect, useMemo, useRef, useState } from "react";
import { useCompass } from "../../../hooks/useCompass.js";
import { angleDifference, calculateQiblaBearing, distanceToKaaba, magneticDeclination } from "../../../utils/qibla.js";
import { CalibrationGuide } from "../CalibrationGuide/CalibrationGuide.jsx";
import "./QiblaPanel.css";

// Entro questi gradi considero il telefono allineato
const ALIGNED_TOLERANCE = 5;

const kmFormatter = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });

// Bussola Qibla (retro della card orari)
// bearing: direzione della Mecca da nord
// heading: dove punta il telefono
export function QiblaPanel({ location, hidden, closeButtonRef, onClose }) {
  const compass = useCompass();
  const helpRef = useRef(null);
  const bodyRef = useRef(null);

  // Guida calibrazione: torna a ogni apertura della Qibla
  // Aggiorno lo stato durante il render, come consiglia la guida di React
  const [showGuide, setShowGuide] = useState(true);
  if (hidden && !showGuide) setShowGuide(true);

  // Chiusa la guida, focus sul primo pulsante della bussola
  function closeGuide() {
    setShowGuide(false);
    requestAnimationFrame(() => bodyRef.current?.querySelector("button, summary")?.focus({ preventScroll: true }));
  }

  // Girando la card chiudi "Direzione imprecisa?"
  useEffect(() => {
    if (hidden && helpRef.current) helpRef.current.open = false;
  }, [hidden]);

  const bearing = useMemo(
    () => (location ? calculateQiblaBearing(location.latitude, location.longitude) : null),
    [location],
  );
  const distance = useMemo(
    () => (location ? distanceToKaaba(location.latitude, location.longitude) : null),
    [location],
  );

  // Da nord bussola a nord vero
  const declination = useMemo(
    () => (location ? magneticDeclination(location.latitude, location.longitude) : 0),
    [location],
  );
  const heading = compass.heading === null ? null : compass.heading + declination;
  const rotation = compass.heading === null ? 0 : compass.rotation + declination;

  const active = heading !== null;
  const aligned = active && bearing !== null && Math.abs(angleDifference(heading, bearing)) <= ALIGNED_TOLERANCE;

  // Piccola vibrazione quando ti allinei (solo Android)
  const wasAligned = useRef(false);
  useEffect(() => {
    if (aligned && !wasAligned.current) navigator.vibrate?.(40);
    wasAligned.current = aligned;
  }, [aligned]);

  // Messaggio sotto la bussola
  let message = compass.status;
  if (aligned) message = "Sei rivolto verso la Qibla.";
  else if (active && compass.poorAccuracy) message = "Bussola poco precisa: muovi il telefono disegnando un 8.";

  // Testo per screen reader
  let compassLabel = "Bussola Qibla: in attesa della posizione";
  if (bearing !== null) {
    compassLabel = `Direzione Qibla ${Math.round(bearing)} gradi da nord`;
    if (active) compassLabel += `, ${Math.round((((bearing - heading) % 360) + 360) % 360)} gradi rispetto al telefono`;
  }

  return (
    <section
      className={`compass-panel card-sky prayer-card-face${aligned ? " is-aligned" : ""}`}
      id="qibla"
      aria-labelledby="qibla-heading"
      aria-hidden={hidden}
      inert={hidden}
    >
      <div className="prayer-card-heading">
        <h3 id="qibla-heading">Qibla</h3>
        <button
          ref={closeButtonRef}
          className="card-switch"
          type="button"
          aria-controls="prayer-card-front"
          onClick={onClose}
        >
          Torna agli orari
        </button>
      </div>
      <p className="qibla-location">{location ? location.name : "In attesa della posizione"}</p>

      <div className="compass-area">
        {showGuide && <CalibrationGuide onDone={closeGuide} />}

        <div ref={bodyRef} className="compass-body" inert={showGuide}>
          <div className="compass-wrap">
            {/* Tacca in alto = direzione del telefono */}
            <span className="compass-pointer" aria-hidden="true"></span>

            <div className="compass" role="img" aria-label={compassLabel}>
              <div className="compass-rose" aria-hidden="true" style={{ transform: `rotate(${-rotation}deg)` }}>
                <span className="compass-north">N</span>
                <span className="compass-east">E</span>
                <span className="compass-south">S</span>
                <span className="compass-west">O</span>
                <span className="compass-tick compass-tick-a"></span>
                <span className="compass-tick compass-tick-b"></span>
                <span className="compass-tick compass-tick-c"></span>
                <span className="compass-tick compass-tick-d"></span>

                {/* Kaaba sulla sua direzione da nord */}
                {bearing !== null && (
                  <span className="compass-kaaba" style={{ transform: `rotate(${bearing}deg)` }}>
                    <span></span>
                  </span>
                )}
              </div>

              <div
                className="compass-needle"
                style={bearing === null ? undefined : { transform: `rotate(${bearing - rotation}deg)` }}
              >
                <span></span>
              </div>
              <span className="compass-center"></span>
            </div>
          </div>

          <p className="qibla-status" aria-live="polite">
            {message}
          </p>

          <dl className="qibla-stats">
            <div>
              <dt>Direzione</dt>
              <dd>
                <span className="qibla-degrees">{bearing === null ? "--°" : `${Math.round(bearing)}°`}</span> da nord
              </dd>
            </div>
            <div>
              <dt>Distanza</dt>
              <dd>
                <span className="qibla-degrees">{distance === null ? "--" : kmFormatter.format(distance)}</span> km
              </dd>
            </div>
          </dl>

          {!active && (
            <button
              className="button button-light qibla-button"
              type="button"
              disabled={compass.buttonDisabled}
              onClick={compass.enable}
            >
              {compass.buttonLabel}
            </button>
          )}

          <details ref={helpRef} className="compass-help">
            <summary>Direzione imprecisa?</summary>
            <p>
              Allontanati da metalli, calamite e dispositivi elettronici (anche cover con magnete). Tieni il telefono
              dritto e disegna lentamente un 8 nell’aria, inclinandolo seguendo la curva, per alcuni secondi. Poi
              rimettilo in piano e controlla di nuovo.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
