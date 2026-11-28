import { useEffect, useState } from "react";
import "../../components/common/Brand/Brand.css";
import "./LaunchPage.css";

// Due cifre (es. 05)
const pad = (value) => String(value).padStart(2, "0");

// =========================
// COUNTDOWN AL LANCIO
// =========================
// Allo zero ricarica: il sito completo si apre da solo
export function LaunchPage({ launchAt }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const current = Date.now();
      if (current >= launchAt) window.location.reload();
      else setNow(current);
    }, 1000);
    return () => clearInterval(interval);
  }, [launchAt]);

  const left = Math.max(0, Math.floor((launchAt - now) / 1000));
  const hours = Math.floor(left / 3600);
  const minutes = Math.floor((left % 3600) / 60);
  const seconds = left % 60;

  return (
    <main className="launch">
      {/* Logo come nella navbar (senza link: qui non c'è il router) */}
      <p className="brand launch-brand">
        <span className="brand-mark" aria-hidden="true" />
        <span>
          muslimbro<span className="brand-dot">.</span>
        </span>
      </p>
      <h1>Il nuovo sito sta arrivando</h1>
      <p className="launch-text">Orari di preghiera, Qibla, Corano e Azkar, tutto rinnovato. Ci vediamo alle 19:00.</p>

      <div className="launch-timer" role="timer" aria-live="off">
        <div>
          <span>{pad(hours)}</span>
          <small>ore</small>
        </div>
        <div>
          <span>{pad(minutes)}</span>
          <small>minuti</small>
        </div>
        <div>
          <span>{pad(seconds)}</span>
          <small>secondi</small>
        </div>
      </div>
    </main>
  );
}
