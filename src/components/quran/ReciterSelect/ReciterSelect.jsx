import { RECITERS } from "../../../data/reciters.js";
import "./ReciterSelect.css";

// Scelta del lettore (tab Ascolto)
export function ReciterSelect({ value, onChange }) {
  return (
    <div className="reciter-select">
      <label htmlFor="reciter">Lettore</label>
      <div className="reciter-select-field">
        <select id="reciter" value={value} onChange={(event) => onChange(event.target.value)}>
          {RECITERS.map((reciter) => (
            <option key={reciter.id} value={reciter.id}>
              {reciter.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
