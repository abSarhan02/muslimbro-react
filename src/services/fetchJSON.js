// Fetch con controllo errori e timeout
export async function fetchJSON(url, { timeout = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Risposta HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") throw new Error("Il servizio impiega troppo tempo a rispondere.", { cause: error });
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
