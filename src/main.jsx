import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { LaunchPage } from "./pages/LaunchPage/LaunchPage.jsx";

// ===== NUOVA VERSIONE DEL SITO =====
// Dopo un deploy i file JS vecchi non esistono più:
// se uno non si carica ricarica la pagina, ma una volta sola ogni 10 secondi
const RELOAD_KEY = "muslimbro-reload";

window.addEventListener("vite:preloadError", (event) => {
  try {
    const lastReload = Number(sessionStorage.getItem(RELOAD_KEY)) || 0;
    if (Date.now() - lastReload < 10000) return;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // Senza sessionStorage non ricarico (eviterei un loop)
    return;
  }
  event.preventDefault();
  window.location.reload();
});

// ===== BROWSER DI INSTAGRAM (ANDROID) =====
// Apri il sito nel browser del telefono (bussola e posizione funzionano meglio)
// Una volta sola per sessione: se non riesce resto qui, niente loop
const INTENT_KEY = "muslimbro-open-browser";
const inAppAndroid = /Instagram|FBAN|FBAV/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);

if (inAppAndroid) {
  try {
    if (!sessionStorage.getItem(INTENT_KEY)) {
      sessionStorage.setItem(INTENT_KEY, "1");
      const { host, pathname, search, hash } = window.location;
      window.location.replace(
        `intent://${host}${pathname}${search}${hash}#Intent;scheme=https;action=android.intent.action.VIEW;end`,
      );
    }
  } catch {
    // Senza sessionStorage resto nel browser di Instagram
  }
}

// ===== LANCIO =====
// Su muslimbro.it fino al lancio si vede solo il countdown (la beta resta il sito completo)
const LAUNCH_AT = new Date("2026-11-28T19:00:00+01:00").getTime();
const PUBLIC_HOSTS = ["muslimbro.it", "www.muslimbro.it"];
const beforeLaunch = PUBLIC_HOSTS.includes(window.location.hostname) && Date.now() < LAUNCH_AT;

// Entry point
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {beforeLaunch ? (
      <LaunchPage launchAt={LAUNCH_AT} />
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </StrictMode>,
);
