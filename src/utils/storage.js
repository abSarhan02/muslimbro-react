// Chiavi del localStorage (non cambiarle!)
export const STORAGE_KEYS = {
  theme: "muslimbro-theme",
  azkarMode: "muslimbro-azkar-mode",
  reciter: "muslimbro-reciter",
};

// try/catch perché in navigazione privata può dare errore
export function readPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Niente
  }
}
