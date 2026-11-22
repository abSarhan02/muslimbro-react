import { memo } from "react";
import { surahAudioUrl } from "../../../services/quranApi.js";
import { surahTitle } from "../../../utils/quranText.js";
import { PlayButton } from "../PlayButton/PlayButton.jsx";
import "./AudioList.css";

// Lista audio delle sure
export function AudioList({ surahs, player, reciter }) {
  if (!surahs.length) return <p className="empty-state">Nessuna sura trovata.</p>;

  return surahs.map((surah) => (
    <AudioCard
      key={surah.number}
      surah={surah}
      reciter={reciter}
      track={player.trackState(`surah-${surah.number}`)}
      onToggle={player.toggle}
      onSeek={player.seek}
    />
  ));
}

// memo: si aggiorna solo la card che sta suonando
const AudioCard = memo(function AudioCard({ surah, reciter, track, onToggle, onSeek }) {
  const id = `surah-${surah.number}`;
  const title = surahTitle(surah);

  return (
    <article className="card audio-card">
      <div className="audio-card-header">
        <h2 className="card-title" lang="ar" dir="rtl">
          {surah.name}
        </h2>
        <p className="card-text">{title}</p>
        <p className="card-meta">Sura n. {surah.number}</p>
      </div>

      <div className="audio-controls">
        <PlayButton
          className="play-btn"
          track={track}
          label={title}
          onClick={() => onToggle(id, surahAudioUrl(surah.number, reciter), title)}
        />
        <input
          className="audio-progress"
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={track.progress}
          aria-label={`Posizione audio di ${title}`}
          onChange={(event) => onSeek(id, event.target.value)}
        />
        <span className="audio-time">{track.error ? "Audio non disponibile" : track.loading ? "Caricamento…" : track.time}</span>
      </div>
    </article>
  );
});
