import "./LocationTools.css";
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

  // Se la posizione è bloccata il browser non mostra più il popup:
  // va riattivata a mano dalle impostazioni del sito
  let hint = null;
  if (denied) {
    hint =
      "Hai bloccato l’accesso alla posizione e il browser non lo chiede più. Per riattivarlo tocca l’icona accanto all’indirizzo del sito (il lucchetto o le impostazioni), consenti «Posizione» e gli orari si aggiornano da soli. Su iPhone: Impostazioni › Privacy e sicurezza › Localizzazione › Siti web di Safari.";
  } else if (location?.approximate) {
    hint = "Per una posizione più precisa, clicca «Usa posizione precisa» e consenti l’accesso alla posizione nel browser.";
  }

  return (
    <>
      <div className="location-tools">
        <span className="location-label">{label}</span>
        <button className="location-refresh" type="button" disabled={status === "loading"} onClick={() => reload()}>
          Usa posizione precisa
        </button>
      </div>

      {/* Avviso se la posizione è approssimativa o bloccata */}
      {hint && <p className="location-hint">{hint}</p>}
    </>
  );
}
