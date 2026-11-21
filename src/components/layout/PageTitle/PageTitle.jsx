import "./PageTitle.css";
// Titolo delle pagine interne
export function PageTitle({ eyebrow, title, children, align = "center" }) {
  return (
    <div className={`utility-title utility-title-${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {children && <p className="utility-lead">{children}</p>}
    </div>
  );
}
