import { useRef } from "react";
import "./Tabs.css";

// Tabs riutilizzabili (Lettura/Ascolto, Mattino/Sera)
// Navigazione con frecce, Home e Fine
export function TabList({ label, tabs, selected, onSelect, idPrefix, className = "tabs" }) {
  const buttons = useRef([]);

  function onKeyDown(event, index) {
    const next = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (next === undefined) return;

    event.preventDefault();
    onSelect(tabs[next].id);
    buttons.current[next]?.focus();
  }

  return (
    <div className={className} role="tablist" aria-label={label}>
      {tabs.map((tab, index) => {
        const active = tab.id === selected;
        return (
          <button
            key={tab.id}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            id={`${idPrefix}-tab-${tab.id}`}
            className="tab"
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// Contenuto del tab attivo (stesso idPrefix della TabList)
export function TabPanel({ idPrefix, selected, children, ...props }) {
  return (
    <div role="tabpanel" id={`${idPrefix}-panel`} aria-labelledby={`${idPrefix}-tab-${selected}`} {...props}>
      {children}
    </div>
  );
}
