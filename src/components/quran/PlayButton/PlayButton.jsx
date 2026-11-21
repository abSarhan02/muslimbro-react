import "./PlayButton.css";
// Testo per screen reader
function playButtonLabel(track, label) {
  if (track.error) return `Audio non disponibile: ${label}`;
  return `${track.playing ? "Metti in pausa" : "Riproduci"} ${label}`;
}

// Pulsante play/pausa (sure e versetti)
export function PlayButton({ track, label, onClick, className }) {
  return (
    <button
      className={`${className}${track.playing ? " playing" : ""}${track.loading ? " loading" : ""}`}
      type="button"
      aria-pressed={track.playing}
      aria-busy={track.loading || undefined}
      aria-label={playButtonLabel(track, label)}
      onClick={onClick}
    >
      <span className="play-symbol" aria-hidden="true"></span>
    </button>
  );
}
