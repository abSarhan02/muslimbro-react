import "./SectionIntro.css";
// Intestazione delle sezioni
export function SectionIntro({ id, eyebrow, title, children }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {children}
    </div>
  );
}
