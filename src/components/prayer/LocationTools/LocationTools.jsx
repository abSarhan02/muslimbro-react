import "./LocationTools.css";
// Mostra la posizione usata + pulsante per quella precisa
export function LocationTools({ schedule }) {
  const { location, locating, status, reload } = schedule;

  let label = "Rilevamento posizione";
  if (!locating) {
    if (status === "error") {
      label = location ? `${location.name} (ultima posizione)` : "Posizione non disponibile";
    } else if (location) {
      label = `${location.name}${location.approximate ? " (approssimativa)" : ""}`;
    }
  }

  return (
    <>
      <div className="location-tools">
        <span className="location-label">{label}</span>
        <button className="location-refresh" type="button" disabled={status === "loading"} onClick={() => reload()}>
          Usa posizione precisa
        </button>
      </div>

      {/* Avviso se la posizione è approssimativa */}
      {location?.approximate && (
        <p className="location-hint">
          Per una posizione più precisa, clicca «Usa posizione precisa» e consenti l’accesso alla posizione nel browser.
        </p>
      )}
    </>
  );
}
