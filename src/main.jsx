import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";

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

// Entry point
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
