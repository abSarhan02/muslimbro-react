import { Link } from "react-router";
import { SectionIntro } from "../SectionIntro/SectionIntro.jsx";
import "./AzkarSection.css";

const AZKAR_CHOICES = [
  { mode: "morning", image: "/images/icons8-alba-96.png", label: "Un nuovo inizio", title: "Azkar del mattino" },
  { mode: "evening", image: "/images/icons8-tramonto-96.png", label: "Un momento di quiete", title: "Azkar della sera" },
];

// Sezione azkar della home
// Il tipo (mattina/sera) passa nell'URL con ?type=
export function AzkarSection() {
  return (
    <section className="section-wrap page-width" id="azkar" aria-labelledby="azkar-heading">
      <SectionIntro id="azkar-heading" eyebrow="Inizia e concludi con serenità" title="Piccoli momenti, grande pace.">
        <p className="section-description">
          Ritrova la serenità attraverso gli Azkar. Invocazioni per accompagnare il mattino e la sera, rafforzare il
          cuore e ricordare Allah.
        </p>
      </SectionIntro>

      <div className="azkar-choices">
        {AZKAR_CHOICES.map((choice) => (
          <Link key={choice.mode} className="azkar-choice" to={`/azkar?type=${choice.mode}`}>
            <img src={choice.image} alt="" width="96" height="96" loading="lazy" />
            <span className="azkar-choice-copy">
              <span className="azkar-choice-label">{choice.label}</span>
              <span className="azkar-choice-title">{choice.title}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
