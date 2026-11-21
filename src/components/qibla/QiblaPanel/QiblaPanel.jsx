import { useEffect, useMemo, useRef } from "react";
import { useCompass } from "../../../hooks/useCompass.js";
import { angleDifference, calculateQiblaBearing, distanceToKaaba } from "../../../utils/qibla.js";
import "./QiblaPanel.css";

// Entro questi gradi considero il telefono allineato
const ALIGNED_TOLERANCE = 5;

const kmFormatter = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });

// Bussola Qibla (retro della card orari)
// bearing: direzione della Mecca da nord
// heading: dove punta il telefono
// La rosa gira al contrario del telefono, così la Kaaba resta sulla sua direzione vera
export function QiblaPanel({ location, hidden, panelRef, closeButtonRef, helpRef, onClose }) {
  const compass = useCompass();

  const bearing = useMemo(
    () => (location ? calculateQiblaBearing(location.latitude, location.longitude) : null),
    [location],
  );
  const distance = useMemo(
    () => (location ? distanceToKaaba(location.latitude, location.longitude) : null),
    [location],
  );

  const active = compass.heading !== null;
  const aligned =
    active && bearing !== null && Math.abs(angleDifference(compass.heading, bearing)) <= ALIGNED_TOLERANCE;

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
    if (active) compassLabel += `, ${Math.round((bearing - compass.heading + 360) % 360)} gradi rispetto al telefono`;
  }

  return (
    <section
      ref={panelRef}
      className={`compass-panel qibla-card prayer-card-face qibla-only${aligned ? " is-aligned" : ""}`}
      id="qibla"
      aria-labelledby="qibla-heading"
      aria-hidden={hidden}
      inert={hidden}
    >
      <div className="prayer-card-heading">
        <h3 id="qibla-heading">Qibla</h3>
        <button ref={closeButtonRef} className="card-switch" type="button" aria-controls="prayer-card-front" onClick={onClose}>
          Torna agli orari
        </button>
      </div>
      <p className="qibla-location">{location ? location.name : "In attesa della posizione"}</p>

      <div className="compass" role="img" aria-label={compassLabel}>
        {/* Tacca fissa in alto: è la direzione del telefono */}
        <span className="compass-pointer" aria-hidden="true"></span>

        <div className="compass-rose" aria-hidden="true" style={{ transform: `rotate(${-compass.rotation}deg)` }}>
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
          style={bearing === null ? undefined : { transform: `rotate(${bearing - compass.rotation}deg)` }}
        >
          <span></span>
        </div>
        <span className="compass-center"></span>
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
          Allontanati da metalli, calamite e dispositivi elettronici (anche cover con magnete). Tieni il telefono in piano
          e muovilo lentamente disegnando un 8 nell’aria per alcuni secondi, poi controlla di nuovo.
        </p>
      </details>
    </section>
  );
}
