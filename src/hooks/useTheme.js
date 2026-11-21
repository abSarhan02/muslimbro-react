import { useSyncExternalStore } from "react";
import { STORAGE_KEYS, savePreference } from "../utils/storage.js";

// Tema chiaro/scuro
// Il tema iniziale lo mette public/theme-init.js

const THEME_COLORS = { light: "#0099ff", dark: "#181818" };

// Componenti da aggiornare quando cambia il tema
const listeners = new Set();

function getTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  // Colore della barra del browser (mobile)
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
  savePreference(STORAGE_KEYS.theme, theme);
  listeners.forEach((listener) => listener());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  return { theme, toggleTheme };
}
