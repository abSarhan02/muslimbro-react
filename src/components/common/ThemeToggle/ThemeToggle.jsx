import { useTheme } from "../../../hooks/useTheme.js";
import "./ThemeToggle.css";

// Pulsante tema chiaro/scuro
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "Attiva tema chiaro" : "Attiva tema scuro";

  return (
    <button className="icon-button theme-toggle" type="button" aria-label={label} title={label} onClick={toggleTheme}>
      {/* Icona luna */}
      <svg className="theme-icon theme-icon-dark" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M16.4 12.8A7 7 0 0 1 7.2 3.6a7.1 7.1 0 1 0 9.2 9.2Z" />
      </svg>
      {/* Icona sole */}
      <svg className="theme-icon theme-icon-light" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="3.2" />
        <path d="M10 1.8v2M10 16.2v2M18.2 10h-2M3.8 10h-2m14-5.8-1.4 1.4M5.6 14.4l-1.4 1.4m11.6 0-1.4-1.4M5.6 5.6 4.2 4.2" />
      </svg>
    </button>
  );
}
