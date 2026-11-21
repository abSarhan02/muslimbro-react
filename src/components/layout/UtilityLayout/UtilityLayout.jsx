import { Link } from "react-router";
import { Brand } from "../../common/Brand/Brand.jsx";
import { SiteNav } from "../SiteNav/SiteNav.jsx";
import "./UtilityLayout.css";

// Layout delle pagine interne (Corano, Azkar, Privacy)
// hideChrome nasconde navbar e footer (pagina della sura)
export function UtilityLayout({ band, children, mainClassName = "", footerLink, hideChrome = false }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Vai al contenuto
      </a>

      {!hideChrome && <SiteNav />}

      <main id="main-content" className={`utility-main ${mainClassName}`.trim()} tabIndex={-1}>
        {band && <div className="page-band">{band}</div>}
        {children}
      </main>

      {!hideChrome && (
        <footer className="utility-footer">
          <div className="utility-footer-inner page-width">
            <Brand />
            {footerLink ?? <Link to="/privacy">Privacy</Link>}
          </div>
        </footer>
      )}
    </>
  );
}
