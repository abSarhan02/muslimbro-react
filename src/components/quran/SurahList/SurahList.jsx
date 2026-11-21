import { Link } from "react-router";
import { surahTitle } from "../../../utils/quranText.js";
import "./SurahList.css";

// Lista delle sure da leggere
export function SurahList({ surahs }) {
  if (!surahs.length) return <p className="empty-state">Nessuna sura trovata.</p>;

  return surahs.map((surah) => (
    <Link key={surah.number} className="card surah-card" to={`/quran/${surah.number}`}>
      <span className="card-title" lang="ar" dir="rtl">
        {surah.name}
      </span>
      <span className="card-text">{surahTitle(surah)}</span>
      <small>Sura n. {surah.number}</small>
    </Link>
  ));
}
