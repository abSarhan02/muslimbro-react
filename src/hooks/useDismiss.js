import { useEffect } from "react";

// Chiude un menu cliccando fuori o con Esc
// wrapperRef: il menu (con il suo pulsante)
// buttonRef: il pulsante che lo apre, riprende il focus con Esc
export function useDismiss(open, setOpen, wrapperRef, buttonRef) {
  useEffect(() => {
    if (!open) return;

    const onClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen, wrapperRef, buttonRef]);
}
