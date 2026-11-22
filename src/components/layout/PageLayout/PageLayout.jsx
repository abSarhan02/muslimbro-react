import { Link } from "react-router";
import { Brand } from "../../common/Brand/Brand.jsx";
import { SiteNav } from "../SiteNav/SiteNav.jsx";
import "./PageLayout.css";

// Layout delle pagine interne (Corano, Azkar, Privacy)
// hideChrome nasconde navbar e footer (pagina della sura)
export function PageLayout({ band, children, mainClassName = "", footerLink, hideChrome = false }) {
  return (
    <div className="page-layout">
      <a className="skip-link" href="#main-content">
        Vai al contenuto
      </a>

      {!hideChrome && <SiteNav />}

      <main id="main-content" className={`page-main ${mainClassName}`.trim()} tabIndex={-1}>
        {band && <div className="page-band">{band}</div>}
        {children}
      </main>

      {!hideChrome && (
        <footer className="page-footer">
          <div className="page-footer-inner page-width">
            <Brand />
            {footerLink ?? <Link to="/privacy">Privacy</Link>}
          </div>
        </footer>
      )}
    </div>
  );
}
