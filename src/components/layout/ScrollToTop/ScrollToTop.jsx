import { useEffect } from "react";
import { useLocation } from "react-router";

// Gestisce lo scroll quando cambio pagina:
// - con l'ancora (es. /#azkar) va alla sezione
// - altrimenti torna in cima
export function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash, key]); // key cambia a ogni click

  return null;
}
