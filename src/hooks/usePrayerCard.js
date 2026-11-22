import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { QIBLA_DEVICE_QUERY, useMediaQuery } from "./useMediaQuery.js";

// =========================
// PRAYER CARD (orari / Qibla)
// =========================
// Su telefono e tablet la card si gira e dietro c'è la Qibla
// I link /#qibla e /#prayer-times girano la card
export function usePrayerCard() {
  const mobile = useMediaQuery(QIBLA_DEVICE_QUERY);
  const [showQibla, setShowQibla] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);
  const { hash, key } = useLocation();

  // Su desktop non si gira
  const flipped = showQibla && mobile;

  const refs = {
    front: useRef(null),
    openButton: useRef(null),
    closeButton: useRef(null),
  };
  const { front, openButton, closeButton } = refs;

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

  // Segui l'ancora dell'URL (key cambia a ogni click, anche sullo stesso link)
  useEffect(() => {
    if (hash === "#qibla") setFace(true, true);
    if (hash === "#prayer-times") setFace(false);
  }, [hash, key, setFace]);

  // Esc torna agli orari
  function onKeyDown(event) {
    if (event.key !== "Escape" || !flipped) return;
    event.preventDefault();
    setFace(false, true);
  }

  return {
    refs,
    mobile,
    flipped,
    open: () => setFace(true, true),
    close: () => setFace(false, true),
    onKeyDown,
  };
}
