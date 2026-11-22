import { useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { QIBLA_DEVICE_QUERY, useMediaQuery } from "./useMediaQuery.js";

// =========================
// PRAYER CARD (orari / Qibla)
// =========================
// Su telefono e tablet la card si gira e dietro c'è la Qibla
// I link /#qibla e /#prayer-times girano la card
export function usePrayerCard() {
  const mobile = useMediaQuery(QIBLA_DEVICE_QUERY);
  const { hash, key } = useLocation();
  const [showQibla, setShowQibla] = useState(hash === "#qibla");

  const frontRef = useRef(null);
  const openButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const moveFocusRef = useRef(false);

  // Nuovo click su un link (key cambia a ogni navigazione)
  // Aggiorno lo stato durante il render, come consiglia la guida di React
  const [lastKey, setLastKey] = useState(key);
  if (key !== lastKey) {
    setLastKey(key);
    if (hash === "#qibla") setShowQibla(true);
    if (hash === "#prayer-times") setShowQibla(false);
  }

  // Su desktop non si gira
  const flipped = showQibla && mobile;

  // Dopo aver girato la card, focus sul pulsante giusto
  useLayoutEffect(() => {
    if (!moveFocusRef.current) return;
    moveFocusRef.current = false;
    const target = flipped ? closeButtonRef.current : (openButtonRef.current ?? frontRef.current);
    target?.focus({ preventScroll: true });
  }, [flipped]);

  // Gira la card dal pulsante (sposta anche il focus)
  function setFace(qibla) {
    moveFocusRef.current = true;
    setShowQibla(qibla);
  }

  // Esc torna agli orari
  function onKeyDown(event) {
    if (event.key !== "Escape" || !flipped) return;
    event.preventDefault();
    setFace(false);
  }

  return {
    mobile,
    flipped,
    frontRef,
    openButtonRef,
    closeButtonRef,
    open: () => setFace(true),
    close: () => setFace(false),
    onKeyDown,
  };
}
