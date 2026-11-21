import { useEffect } from "react";
import { Link } from "react-router";
import { PageTitle } from "../../components/layout/PageTitle/PageTitle.jsx";
import { UtilityLayout } from "../../components/layout/UtilityLayout/UtilityLayout.jsx";

// Pagina 404
export function NotFoundPage() {
  // Titolo della pagina
  useEffect(() => {
    document.title = "Pagina non trovata | MuslimBro";
  }, []);

  return (
    <UtilityLayout
      band={
        <PageTitle eyebrow="Errore 404" title="Pagina non trovata">
          L’indirizzo che hai aperto non esiste.
        </PageTitle>
      }
    >
      <p className="empty-state">
        <Link to="/">Torna alla home</Link>
      </p>
    </UtilityLayout>
  );
}
