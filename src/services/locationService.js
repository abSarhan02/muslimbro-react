import { fetchJSON } from "./fetchJSON.js";

// Errori della geolocalizzazione
const GEO_ERRORS = {
  1: "Accesso alla posizione negato.",
  2: "La posizione non è disponibile.",
  3: "Richiesta di posizione scaduta.",
};

// Funzione per ottenere la posizione dal browser
function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("La geolocalizzazione non è disponibile in questo browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          name: "Posizione attuale",
        }),
      (error) => {
        const geoError = new Error(GEO_ERRORS[error.code] || "Impossibile rilevare la posizione.");
        geoError.denied = error.code === 1; // l'utente ha bloccato la posizione
        reject(geoError);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 },
    );
  });
}

// Permesso della posizione (status.state: "granted" | "denied" | "prompt")
// null se il browser non supporta la Permissions API
export async function getLocationPermission() {
  try {
    return await navigator.permissions.query({ name: "geolocation" });
  } catch {
    return null;
  }
}

// Posizione precisa, altrimenti quella dall'IP
export async function getCurrentLocation() {
  try {
    return await getBrowserLocation();
  } catch (browserError) {
    try {
      const data = await fetchJSON("https://ipapi.co/json/");
      if (!Number.isFinite(data.latitude) || !Number.isFinite(data.longitude))
        throw new Error("Posizione IP non valida.");
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        name: [data.city, data.country_name].filter(Boolean).join(", ") || "Posizione approssimativa",
        approximate: true,
        denied: Boolean(browserError.denied),
      };
    } catch {
      const error = new Error(`${browserError.message} Non è disponibile neppure la posizione approssimativa.`);
      error.denied = Boolean(browserError.denied);
      throw error;
    }
  }
}
