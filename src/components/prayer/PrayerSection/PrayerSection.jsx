import { usePrayerCard } from "../../../hooks/usePrayerCard.js";
import { usePrayerSchedule } from "../../../hooks/usePrayerSchedule.js";
import { CALCULATION_LABEL } from "../../../services/prayerApi.js";
import { QiblaPanel } from "../../qibla/QiblaPanel/QiblaPanel.jsx";
import { LocationTools } from "../LocationTools/LocationTools.jsx";
import { NextPrayer } from "../NextPrayer/NextPrayer.jsx";
import { PrayerList } from "../PrayerList/PrayerList.jsx";
import "./PrayerSection.css";

// Formato data: "sabato 21 novembre 2026"
const dateFormatter = new Intl.DateTimeFormat("it-IT", { dateStyle: "full" });

// =========================
// PRAYER SECTION
// =========================
// Davanti gli orari, dietro la Qibla (solo mobile)
export function PrayerSection() {
  const schedule = usePrayerSchedule();
  const card = usePrayerCard();
  const { refs } = card;

  return (
    <section
      className="prayer-section section-wrap page-width"
      id="prayer-times"
      aria-labelledby="prayer-heading"
      tabIndex={-1}
    >
      <div className="prayer-layout">
        <div className="prayer-intro">
          <h2 id="prayer-heading">
            Ogni preghiera,
            <br />
            un momento di pace.
          </h2>
          <p className="section-description">Gli orari per la tua posizione.</p>
          <NextPrayer schedule={schedule} />
        </div>

        <div className={`prayer-card${card.flipped ? " is-flipped" : ""}`} onKeyDown={card.onKeyDown}>
          <div className="prayer-card-inner">
            {/* Fronte: orari di oggi */}
            <div
              ref={refs.front}
              className="prayer-overview card-sky prayer-card-face"
              id="prayer-card-front"
              aria-hidden={card.flipped}
              inert={card.flipped}
              tabIndex={-1}
            >
              <div className="prayer-context">
                <div className="prayer-card-heading">
                  <h3>Orari di oggi</h3>
                  {card.mobile && (
                    <button
                      ref={refs.openButton}
                      className="card-switch"
                      type="button"
                      aria-controls="qibla"
                      aria-expanded={card.flipped}
                      onClick={card.open}
                    >
                      Apri Qibla
                    </button>
                  )}
                </div>

                <p className="date-line">
                  <span>{schedule.date ? dateFormatter.format(schedule.date) : "Caricamento della data"}</span>
                  {schedule.hijri && (
                    <span lang="en">{`${schedule.hijri.day} ${schedule.hijri.month.en} ${schedule.hijri.year}`}</span>
                  )}
                </p>

                <LocationTools schedule={schedule} />
              </div>

              <div className="schedule" aria-live="polite" aria-busy={schedule.status === "loading"}>
                <PrayerList schedule={schedule} />
              </div>
              <p className="schedule-source">{CALCULATION_LABEL}</p>
            </div>

            {/* Retro: Qibla (solo telefono e tablet) */}
            {card.mobile && (
              <QiblaPanel
                location={schedule.location}
                hidden={!card.flipped}
                closeButtonRef={refs.closeButton}
                onClose={card.close}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
