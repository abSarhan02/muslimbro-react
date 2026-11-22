import "./PageTitle.css";

// Titolo delle pagine interne (dentro la fascia azzurra)
// arabic: titolo in arabo sopra quello italiano (Azkar)
// align="start": allineato a sinistra e largo come il testo (Privacy)
export function PageTitle({ eyebrow, arabic, title, children, align = "center" }) {
  const className = align === "start" ? "page-title page-title-start reading-width" : "page-title page-width";

  return (
    <div className={className}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {arabic && (
        <p className="page-title-ar" lang="ar" dir="rtl">
          {arabic}
        </p>
      )}
      <h1>{title}</h1>
      {children && <p className="page-lead">{children}</p>}
    </div>
  );
}
