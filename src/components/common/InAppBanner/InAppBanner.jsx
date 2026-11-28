import { useState } from "react";
import "./InAppBanner.css";

// Browser interno di Instagram su iPhone: lì bussola e posizione funzionano male
const IN_APP_IOS = /Instagram|FBAN|FBAV/.test(navigator.userAgent) && /iPhone|iPad|iPod/.test(navigator.userAgent);

// Barra che spiega come aprire il sito in Safari
export function InAppBanner() {
  const [closed, setClosed] = useState(false);
  if (!IN_APP_IOS || closed) return null;

  return (
    <div className="in-app-banner" role="note">
      <p>
        Per bussola e posizione apri il sito in Safari: tocca <strong>···</strong> in alto a destra e poi{" "}
        <strong>«Apri nel browser esterno»</strong>.
      </p>
      <button className="in-app-close" type="button" aria-label="Chiudi l’avviso" onClick={() => setClosed(true)}>
        ×
      </button>
    </div>
  );
}
