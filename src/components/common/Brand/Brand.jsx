import { Link } from "react-router";
import "./Brand.css";

// Logo che riporta alla home
export function Brand({ label, className = "" }) {
  return (
    <Link className={`brand ${className}`.trim()} to="/" aria-label={label}>
      <span>
        muslimbro<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
