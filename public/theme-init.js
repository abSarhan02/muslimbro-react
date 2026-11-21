// Applica il tema salvato prima di caricare la pagina
// (evita il flash del tema sbagliato)
(() => {
  let savedTheme;
  try {
    savedTheme = localStorage.getItem("muslimbro-theme");
  } catch {}
  const theme = savedTheme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  // Stessi colori di --browser-bar in index.css (qui il CSS non è ancora caricato)
  if (meta) meta.content = theme === "dark" ? "#181818" : "#0099ff";
})();
