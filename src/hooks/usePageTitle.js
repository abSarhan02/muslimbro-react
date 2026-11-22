import { useEffect } from "react";
import { DEFAULT_TITLE, SITE_NAME } from "../data/site.js";

// Titolo della scheda del browser (es. "Il Corano | muslimbro.")
// Senza titolo usa quello della home
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  }, [title]);
}
