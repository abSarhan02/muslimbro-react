import { Link } from "react-router";
import { PageLayout } from "../../components/layout/PageLayout/PageLayout.jsx";
import { PageTitle } from "../../components/layout/PageTitle/PageTitle.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";

// Pagina 404
export function NotFoundPage() {
  usePageTitle("Pagina non trovata");

  return (
    <PageLayout
      band={
        <PageTitle eyebrow="Errore 404" title="Pagina non trovata">
          L’indirizzo che hai aperto non esiste.
        </PageTitle>
      }
    >
      {/* Google non deve indicizzare gli indirizzi sbagliati (React lo mette nel head) */}
      <meta name="robots" content="noindex" />
      <p className="empty-state">
        <Link to="/">Torna alla home</Link>
      </p>
    </PageLayout>
  );
}
