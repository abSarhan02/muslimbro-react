import { useMemo } from "react";
import { useCompass } from "../../../hooks/useCompass.js";
import { calculateQiblaBearing } from "../../../utils/qibla.js";
import "./QiblaPanel.css";

// Bussola Qibla (retro della card orari)
// bearing: direzione della Mecca da nord
// heading: dove punta il telefono
// relative: rotazione della freccia
export function QiblaPanel({ location, hidden, panelRef, closeButtonRef, helpRef, onClose }) {
  const compass = useCompass();

  const bearing = useMemo(
    () => (location ? calculateQiblaBearing(location.latitude, location.longitude) : null),
    [location],
  );

  const heading = compass.heading ?? 0;
  const relative = bearing === null ? 0 : (bearing - heading + 360) % 360;

  // Testo per screen reader
  let compassLabel = "Bussola Qibla: in attesa della posizione";
  if (bearing !== null) {
    compassLabel = `Direzione Qibla ${Math.round(bearing)} gradi da nord`;
    if (compass.heading !== null) compassLabel += `, ${Math.round(relative)} gradi rispetto al dispositivo`;
  }

  return (
    <section
      ref={panelRef}
      className="compass-panel qibla-card prayer-card-face qibla-only"
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

      <div className="compass" role="img" aria-label={compassLabel}>
        {/* La rosa dei venti gira al contrario del telefono */}
        <div
          className="compass-rose"
          aria-hidden="true"
          style={bearing === null ? undefined : { transform: `rotate(${-heading}deg)` }}
        >
          <span className="compass-north">N</span>
          <span className="compass-east">E</span>
          <span className="compass-south">S</span>
          <span className="compass-west">O</span>
          <span className="compass-tick compass-tick-a"></span>
          <span className="compass-tick compass-tick-b"></span>
          <span className="compass-tick compass-tick-c"></span>
          <span className="compass-tick compass-tick-d"></span>
        </div>
        <div className="compass-needle" style={bearing === null ? undefined : { transform: `rotate(${relative}deg)` }}>
          <span></span>
        </div>
        <span className="compass-center"></span>
      </div>

      <p className="qibla-bearing">
        <span className="qibla-degrees">{bearing === null ? "--°" : `${Math.round(bearing)}°`}</span>
        <span>da nord</span>
      </p>

      <button
        className="button button-light qibla-button"
        type="button"
        disabled={compass.buttonDisabled}
        onClick={compass.enable}
      >
        {compass.buttonLabel}
      </button>
      <p className="sensor-status" aria-live="polite">
        {compass.status}
      </p>

      <details ref={helpRef} className="compass-help">
        <summary>Direzione imprecisa?</summary>
        <p>
          Allontanati da metalli, calamite e dispositivi elettronici. Tieni il telefono in piano e muovilo lentamente
          disegnando un 8 nell’aria per alcuni secondi, poi controlla di nuovo la direzione.
        </p>
      </details>
    </section>
  );
}
