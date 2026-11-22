import { useEffect, useRef, useState } from "react";
import { findReciter, RECITERS } from "../../../data/reciters.js";
import { useDismiss } from "../../../hooks/useDismiss.js";
import "./ReciterSelect.css";

// Scelta del lettore (tab Ascolto)
// Menu fatto a mano: la tendina del browser non si può stilizzare
export function ReciterSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const current = findReciter(value);

  // Chiudi cliccando fuori o con Esc
  useDismiss(open, setOpen, wrapperRef, buttonRef);

  // Aprendo, focus sul lettore scelto
  useEffect(() => {
    if (open) listRef.current?.querySelector('[aria-current="true"]')?.focus();
  }, [open]);

  function choose(id) {
    onChange(id);
    setOpen(false);
    buttonRef.current?.focus();
  }

  // Frecce su e giù tra i lettori
  function onListKeyDown(event) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const options = [...listRef.current.querySelectorAll("button")];
    const index = options.indexOf(document.activeElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    options[(index + step + options.length) % options.length]?.focus();
  }

  return (
    <div className="reciter-select" ref={wrapperRef}>
      <span className="reciter-select-label" id="reciter-label">
        Lettore
      </span>
      <button
        ref={buttonRef}
        className="reciter-select-button"
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="reciter-list"
        aria-labelledby="reciter-label reciter-current"
        onClick={() => setOpen((value) => !value)}
      >
        <span id="reciter-current">{current.name}</span>
        <span className="reciter-select-arrow" aria-hidden="true"></span>
      </button>

      {open && (
        <ul className="reciter-list" id="reciter-list" ref={listRef} onKeyDown={onListKeyDown}>
          {RECITERS.map((reciter) => (
            <li key={reciter.id}>
              <button
                type="button"
                aria-current={reciter.id === current.id}
                onClick={() => choose(reciter.id)}
              >
                {reciter.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
