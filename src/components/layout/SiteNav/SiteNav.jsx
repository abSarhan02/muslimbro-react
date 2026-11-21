import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useMediaQuery } from "../../../hooks/useMediaQuery.js";
import { useScrolled } from "../../../hooks/useScrolled.js";
import { Brand } from "../../common/Brand/Brand.jsx";
import { ThemeToggle } from "../../common/ThemeToggle/ThemeToggle.jsx";
import "./SiteNav.css";

// Link del menu
// menuLabel è il testo del menu a tendina (mobile)
const LINKS = [
  { to: "/", label: "Home", menuLabel: "Home" },
  { to: "/#prayer-times", label: "Preghiere", menuLabel: "Orari di preghiera" },
  { to: "/#qibla", label: "Qibla", menuLabel: "Direzione Qibla", qiblaOnly: true },
  { to: "/#quran", label: "Corano", menuLabel: "Corano" },
  { to: "/#azkar", label: "Azkar", menuLabel: "Azkar" },
  { to: "/#contact-us", label: "Contatti", menuLabel: "Contatti" },
];

// Navbar
export function SiteNav() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(24);
  const desktop = useMediaQuery("(min-width: 851px)");
  const { pathname } = useLocation();
  const navRef = useRef(null);
  const buttonRef = useRef(null);

  // Nella home la navbar è trasparente sopra la hero
  const isHome = pathname === "/";

  // Chiudi il menu cliccando fuori o con Esc
  useEffect(() => {
    if (!open) return;

    const onClick = (event) => {
      if (!navRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Su desktop chiudi il menu a tendina
  useEffect(() => {
    if (desktop) setOpen(false);
  }, [desktop]);

  // Qibla solo su mobile (classe qibla-only)
  const linkClass = (link) => (link.qiblaOnly ? "qibla-only" : undefined);

  let navClass = "site-nav";
  if (isHome) navClass += " is-home";
  if (scrolled) navClass += " is-scrolled";

  return (
    <nav ref={navRef} className={navClass} aria-label="Navigazione principale">
      <div className="nav-inner page-width">
        <Brand label="muslimbro., home" />

        <div className="nav-list">
          {LINKS.map((link) => (
            <Link key={link.to} className={linkClass(link)} to={link.to}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <ThemeToggle />
          {/* Toggle menu (mobile) */}
          <button
            ref={buttonRef}
            className="icon-button nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="dropdown-menu"
            aria-label={open ? "Chiudi il menu" : "Apri il menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      <div className={`dropdown${open ? " open" : ""}`} id="dropdown-menu">
        {LINKS.map((link) => (
          <Link key={link.to} className={linkClass(link)} to={link.to} onClick={() => setOpen(false)}>
            {link.menuLabel}
          </Link>
        ))}
      </div>
    </nav>
  );
}
