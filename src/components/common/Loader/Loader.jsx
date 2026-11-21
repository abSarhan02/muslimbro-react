import "./Loader.css";
// Loader mentre carica
export function Loader({ label = "Caricamento" }) {
  return (
    <div className="loader-wrapper">
      <span className="spinner" aria-hidden="true"></span>
      <p className="loader-text">{label}</p>
    </div>
  );
}
