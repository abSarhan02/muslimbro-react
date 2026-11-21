import { Link } from "react-router";
import "./Hero.css";

// Hero della home
export function Hero() {
  return (
    <header className="hero" id="home">
      <div className="hero-inner page-width">
        <h1>Bismillah</h1>
        <p className="hero-tagline">Ogni giorno, un nuovo inizio.</p>
        <Link className="button button-light button-large" to="/#prayer-times">
          Vedi gli orari di oggi
        </Link>
      </div>
    </header>
  );
}
