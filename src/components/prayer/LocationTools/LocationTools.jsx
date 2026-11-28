import "./LocationTools.css";

// iPhone e iPad (anche iPad che si presenta come Mac)
const IS_IOS =
  /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent));

// Mostra la posizione usata + pulsante per quella precisa
export function LocationTools({ schedule }) {
  const { location, locating, status, denied, reload } = schedule;

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
        {/* Con la posizione bloccata il browser non la chiede più: il pulsante non servirebbe */}
        {!denied && (
          <button className="location-refresh" type="button" disabled={status === "loading"} onClick={() => reload()}>
            Usa posizione precisa
          </button>
        )}
      </div>

      {/* Posizione bloccata: spiego come riattivarla */}
      {denied && (
        <div className="location-blocked" role="note">
          <p className="location-blocked-title">Posizione bloccata</p>
          <p>Gli orari sono calcolati su una posizione approssimativa. Per averli precisi riattiva la posizione:</p>
          {IS_IOS ? (
            <ol>
              <li>Apri Impostazioni › Privacy e sicurezza › Localizzazione.</li>
              <li>Tocca «Siti web di Safari» e scegli «Mentre usi l’app».</li>
              <li>Torna qui e tocca «Riprova».</li>
            </ol>
          ) : (
            <ol>
              <li>Tocca l’icona accanto all’indirizzo del sito (il lucchetto o le impostazioni).</li>
              <li>Apri «Autorizzazioni» e consenti «Posizione».</li>
              <li>Torna qui e tocca «Riprova».</li>
            </ol>
          )}
          <button
            className="button button-light button-small"
            type="button"
            disabled={status === "loading"}
            onClick={() => reload()}
          >
            Riprova
          </button>
        </div>
      )}

      {/* Posizione approssimativa ma non bloccata */}
      {!denied && location?.approximate && (
        <p className="location-hint">
          Per una posizione più precisa tocca «Usa posizione precisa» e consenti l’accesso alla posizione.
        </p>
      )}
    </>
  );
}
