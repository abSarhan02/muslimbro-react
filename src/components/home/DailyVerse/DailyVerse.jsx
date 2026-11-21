import { Link } from "react-router";
import { useDailyVerse } from "../../../hooks/useDailyVerse.js";
import "./DailyVerse.css";

// Versetto del giorno
export function DailyVerse() {
  const { verse, loading, failed, retry, randomize } = useDailyVerse();

  // Link al versetto nella pagina del Corano
  const quranLink = verse ? `/quran/${verse.surah}?ayah=${verse.ayah}` : "/quran";

  return (
    <section className="daily-verse page-width" aria-labelledby="daily-verse-heading">
      <div className="daily-verse-heading">
        <p className="eyebrow">Una pausa di riflessione</p>
        <h2 id="daily-verse-heading">Un versetto per te.</h2>
      </div>

      <div className="daily-verse-body">
        <div className="daily-verse-reading" tabIndex={0} aria-label="Testo del versetto">
          <p className="daily-verse-arabic" lang="ar" dir="rtl" aria-live="polite" aria-busy={loading || undefined}>
            {verse ? verse.arabic : "Caricamento del versetto…"}
          </p>
          <p className="daily-verse-translation">{verse?.italian}</p>
        </div>

        <div className="daily-verse-footer">
          <p className="daily-verse-reference">{verse && `Sura ${verse.surah}, versetto ${verse.ayah}`}</p>
          <div className="daily-verse-actions">
            <Link className="daily-verse-link" to={quranLink}>
              Apri nel Corano
            </Link>
            <button className="button button-small button-light" type="button" disabled={loading} onClick={randomize}>
              {loading ? "Caricamento…" : "Cambia versetto"}
            </button>
          </div>
        </div>

        {failed && (
          <>
            <p className="daily-verse-error" role="status">
              Non è stato possibile caricare il versetto.
            </p>
            <button className="text-button" type="button" onClick={retry}>
              Riprova
            </button>
          </>
        )}
      </div>
    </section>
  );
}
