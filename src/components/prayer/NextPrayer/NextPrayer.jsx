import { formatCountdown } from "../../../utils/prayerTimes.js";
import "./NextPrayer.css";

// Prossima preghiera + countdown
export function NextPrayer({ schedule }) {
  const { next, now, status } = schedule;

  let title = "Caricamento";
  if (next) title = next.label;
  else if (status === "error") title = "Orari non disponibili";

  return (
    <section className="next-prayer card" aria-labelledby="next-prayer-title">
      <p className="badge">{next?.tomorrow ? "Prossima preghiera, domani" : "Prossima preghiera"}</p>

      <div className="next-prayer-title-row">
        <h3 id="next-prayer-title" aria-live="polite">
          {title}
        </h3>
        <time className="next-time" dateTime={next?.time}>
          {next?.time ?? "--:--"}
        </time>
      </div>

      <p className="countdown-caption">Tempo alla preghiera</p>
      {/* aria-live off, se no lo screen reader lo legge ogni secondo */}
      <p className="countdown" aria-live="off">
        {next ? formatCountdown(next.date, now) : "--:--:--"}
      </p>
    </section>
  );
}
