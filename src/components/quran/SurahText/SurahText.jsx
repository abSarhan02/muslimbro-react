import { memo, useMemo } from "react";
import { ayahAudioUrl } from "../../../services/quranApi.js";
import {
  BASMALA,
  BASMALA_TRANSLITERATION,
  arabicNumber,
  hasOpeningBasmala,
  verseText,
} from "../../../utils/quranText.js";
import { PlayButton } from "../PlayButton/PlayButton.jsx";
import "./SurahText.css";

// Testo della sura (basmala + versetti)
export function SurahText({ data, target, player }) {
  const { arabic, italian, transliteration } = data;

  // Map numero versetto -> testo, per traduzione e traslitterazione
  const [translations, transliterations] = useMemo(
    () =>
      [italian, transliteration].map(
        (edition) => new Map(edition.ayahs.map((ayah) => [ayah.numberInSurah, ayah.text])),
      ),
    [italian, transliteration],
  );

  return (
    <>
      {hasOpeningBasmala(arabic.number) && (
        <>
          <div className="basmala" lang="ar" dir="rtl">
            {BASMALA}
          </div>
          <p className="basmala-transliteration" lang="ar-Latn" dir="ltr">
            {BASMALA_TRANSLITERATION}
          </p>
        </>
      )}

      {arabic.ayahs.map((ayah) => (
        <AyahBlock
          key={ayah.numberInSurah}
          surahNumber={arabic.number}
          ayah={ayah}
          translation={translations.get(ayah.numberInSurah) || ""}
          transliteration={transliterations.get(ayah.numberInSurah) || "Traslitterazione non disponibile."}
          selected={ayah.numberInSurah === target}
          track={player.trackState(`ayah-${ayah.number}`)}
          onToggle={player.toggle}
        />
      ))}
    </>
  );
}

// Singolo versetto (memo, le sure lunghe hanno tanti versetti)
const AyahBlock = memo(function AyahBlock({ surahNumber, ayah, translation, transliteration, selected, track, onToggle }) {
  const label = `ayah ${ayah.numberInSurah}`;

  return (
    <div
      className={`ayah-block${selected ? " is-target-ayah" : ""}`}
      id={`ayah-${ayah.numberInSurah}`}
      aria-current={selected ? "location" : undefined}
      tabIndex={selected ? -1 : undefined}
    >
      <div className="ayah-header">
        <span className="ayah-number">{arabicNumber(ayah.numberInSurah)}</span>
        <PlayButton
          className="ayah-audio-btn"
          track={track}
          label={label}
          onClick={() => onToggle(`ayah-${ayah.number}`, ayahAudioUrl(ayah.number))}
        />
      </div>

      <div className="ayah-texts">
        <p className="ayah-ar" lang="ar" dir="rtl">
          {verseText(ayah.text, surahNumber, ayah.numberInSurah)}
        </p>
        <p className="ayah-transliteration" lang="ar-Latn" dir="ltr">
          {transliteration}
        </p>
        <p className="ayah-it" lang="it">
          {translation}
        </p>
      </div>
    </div>
  );
});
