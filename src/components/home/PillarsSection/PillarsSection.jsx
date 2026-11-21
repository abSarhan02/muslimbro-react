import { PILLARS } from "../../../data/pillars.js";
import { SectionIntro } from "../SectionIntro/SectionIntro.jsx";
import "./PillarsSection.css";

// Sezione cinque pilastri
// Uso details/summary, così apri e chiudi senza useState
export function PillarsSection() {
  return (
    <section className="section-wrap page-width" id="five-pillars" aria-labelledby="pillars-heading">
      <SectionIntro id="pillars-heading" eyebrow="Le radici della fede" title="I fondamenti dell’Islam">
        <p className="section-description">Cinque atti che guidano la vita spirituale quotidiana.</p>
        <p className="pillars-hint">Seleziona un pilastro per scoprirlo.</p>
      </SectionIntro>

      <div className="pillars">
        {PILLARS.map((pillar) => (
          <details key={pillar.title} className="pillar">
            <summary>
              <img
                className="pillar-icon"
                src={`/images/pillars/${pillar.image}`}
                alt=""
                width="58"
                height="58"
                loading="lazy"
              />
              <span className="pillar-title">{pillar.title}</span>
              <span className="pillar-toggle" aria-hidden="true"></span>
            </summary>
            <span className="pillar-mark" lang="ar" dir="rtl">
              {pillar.arabic}
            </span>
            <p>{pillar.text}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
