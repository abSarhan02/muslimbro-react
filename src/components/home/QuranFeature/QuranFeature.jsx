import { Link } from "react-router";
import "./QuranFeature.css";

// Sezione Corano della home
export function QuranFeature() {
  return (
    <section className="feature-section section-wrap page-width" id="quran" aria-labelledby="quran-heading">
      <div className="feature-copy">
        <p className="eyebrow">Parole che illuminano</p>
        <h2 id="quran-heading">
          Il Corano,
          <br />
          vicino a te.
        </h2>
        <p className="section-description">
          Lasciati accompagnare dalla saggezza dei suoi versetti. Leggi il Corano in arabo e italiano, oppure prenditi un
          momento per ascoltarlo.
        </p>
        <Link className="button button-primary" to="/quran">
          Apri il Corano
        </Link>
      </div>

      <div className="quran-art">
        <img src="/images/quran.png" alt="Il Corano con copertina decorata" width="512" height="512" loading="lazy" />
        <span className="quran-art-caption" lang="ar" dir="rtl">
          الْقُرْآنُ الْكَرِيمُ
        </span>
      </div>
    </section>
  );
}
