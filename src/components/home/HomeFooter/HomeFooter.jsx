import { Link } from "react-router";
import { Brand } from "../../common/Brand/Brand.jsx";
import "./HomeFooter.css";

// Footer della home
export function HomeFooter() {
  return (
    <footer className="site-footer" id="contact-us">
      <div className="footer-inner page-width">
        <div className="footer-about">
          <Brand className="footer-brand" />
          <p>
            Il tuo compagno spirituale quotidiano.
            <br />
            Un piccolo spazio per coltivare la tua fede.
          </p>
        </div>
        <div className="footer-contact">
          <h2>Restiamo in contatto.</h2>
          <p>Hai una domanda o un suggerimento?</p>
          <a href="mailto:muslimbro.it@gmail.com">muslimbro.it@gmail.com</a>
        </div>
      </div>

      <div className="footer-bottom page-width">
        <span>© 2026 muslimbro.</span>
        <div className="footer-links">
          <Link to="/quran">Corano</Link>
          <Link to="/azkar">Azkar</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
        <Link to="/">Torna su</Link>
      </div>
    </footer>
  );
}
