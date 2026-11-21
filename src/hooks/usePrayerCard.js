import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { QIBLA_DEVICE_QUERY, useMediaQuery } from "./useMediaQuery.js";

// =========================
// PRAYER CARD (orari / Qibla)
// =========================
// Su mobile la card si gira e mostra la Qibla
export function usePrayerCard() {
  const mobile = useMediaQuery(QIBLA_DEVICE_QUERY);
  const [showQibla, setShowQibla] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);

  // Su desktop non si gira
  const flipped = showQibla && mobile;

  const refs = {
    section: useRef(null),
    card: useRef(null),
    front: useRef(null),
    back: useRef(null),
    openButton: useRef(null),
    closeButton: useRef(null),
    help: useRef(null),
  };
  const { section, card, front, back, openButton, closeButton, help } = refs;

  // Cambia faccia (e sposta il focus se serve)
  const setFace = useCallback((qibla, moveFocus = false) => {
    setShowQibla(qibla);
    if (moveFocus) setFocusRequest((value) => value + 1);
  }, []);

  // Sposta il focus dopo il render
  useLayoutEffect(() => {
    if (!focusRequest) return;
    const target = flipped ? closeButton.current : mobile ? openButton.current : front.current;
    target?.focus({ preventScroll: true });
  }, [focusRequest]);

  // Chiudi "Direzione imprecisa?"
  useEffect(() => {
    if (!flipped && help.current) help.current.open = false;
  }, [flipped, help]);

  // Da mobile a desktop torna agli orari
  const previousMobile = useRef(mobile);
  useEffect(() => {
    if (previousMobile.current === mobile) return;
    previousMobile.current = mobile;
    setFace(false, Boolean(back.current?.contains(document.activeElement)));
  }, [mobile, setFace, back]);

  // Link #qibla e #prayer-times
  useEffect(() => {
    function onClick(event) {
      const link = event.target.closest?.("a[href]");
      if (!link || link.origin !== location.origin || link.pathname !== location.pathname) return;
      if (link.hash !== "#qibla" && link.hash !== "#prayer-times") return;
      // Ctrl+click ecc.: lascia fare al browser
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;

      event.preventDefault();
      const qibla = link.hash === "#qibla";
      setFace(qibla, qibla);
      (qibla ? card : section).current?.scrollIntoView({ block: "start" });
    }

    // Pagina aperta con #qibla nell'URL
    function followHash() {
      if (location.hash === "#qibla") {
        setFace(true);
        requestAnimationFrame(() => card.current?.scrollIntoView({ block: "start" }));
      } else if (location.hash === "#prayer-times") {
        setFace(false);
      }
    }

    followHash();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", followHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", followHash);
    };
  }, [setFace, card, section]);

  // Esc torna agli orari
  function onKeyDown(event) {
    if (event.key !== "Escape" || !flipped) return;
    event.preventDefault();
    setFace(false, true);
  }

  return {
    refs,
    flipped,
    open: () => setFace(true, true),
    close: () => setFace(false, true),
    onKeyDown,
  };
}
