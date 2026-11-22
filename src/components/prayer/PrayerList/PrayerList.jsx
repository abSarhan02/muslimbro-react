import { ErrorMessage } from "../../common/ErrorMessage/ErrorMessage.jsx";
import { Loader } from "../../common/Loader/Loader.jsx";
import "./PrayerList.css";

// Lista orari di oggi
export function PrayerList({ schedule }) {
  const { status, today, next, error, reload } = schedule;

  if (status === "error") return <ErrorMessage message={error} onRetry={() => reload()} />;
  if (status === "loading") return <Loader label="Calcolo degli orari" />;

  return today.map((prayer) => {
    // Badge "Prossima" solo sugli orari di oggi
    const selected = next && !next.tomorrow && prayer.name === next.name;

    return (
      <div
        key={prayer.name}
        className={`prayer-row${selected ? " is-next" : ""}${prayer.sunrise ? " is-sunrise" : ""}`}
        aria-current={selected ? "time" : undefined}
      >
        <div className="prayer-identity">
          <img className="prayer-image" src={prayer.image} alt="" width="48" height="48" />
          <div className="prayer-labels">
            <span className="prayer-name">{prayer.label}</span>
            {selected && <span className="badge">Prossima</span>}
          </div>
        </div>
        <time className="prayer-time" dateTime={prayer.time}>
          {prayer.time}
        </time>
      </div>
    );
  });
}
