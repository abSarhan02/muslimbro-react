import { useEffect, useState } from "react";
import { ErrorMessage } from "../../components/common/ErrorMessage/ErrorMessage.jsx";
import { Loader } from "../../components/common/Loader/Loader.jsx";
import { TabList, TabPanel } from "../../components/common/Tabs/Tabs.jsx";
import { PageLayout } from "../../components/layout/PageLayout/PageLayout.jsx";
import { PageTitle } from "../../components/layout/PageTitle/PageTitle.jsx";
import { AudioList } from "../../components/quran/AudioList/AudioList.jsx";
import { ReciterSelect } from "../../components/quran/ReciterSelect/ReciterSelect.jsx";
import { SurahList } from "../../components/quran/SurahList/SurahList.jsx";
import { findReciter } from "../../data/reciters.js";
import { useAudioPlayer } from "../../hooks/useAudioPlayer.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { getSurahs } from "../../services/quranApi.js";
import { filterSurahs } from "../../utils/quranText.js";
import { readPreference, savePreference, STORAGE_KEYS } from "../../utils/storage.js";
import "./QuranPage.css";

const TABS = [
  { id: "surahs", label: "Lettura" },
  { id: "audio", label: "Ascolto" },
];

// Pagina Corano: ricerca + lista sure
// Cliccando una sura vai su /quran/:number
export function QuranPage() {
  const [surahs, setSurahs] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0); // Per il pulsante Riprova
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("surahs");
  const [reciter, setReciter] = useState(() => findReciter(readPreference(STORAGE_KEYS.reciter)));
  const player = useAudioPlayer();

  // Cambio lettore e lo salvo
  function changeReciter(id) {
    const next = findReciter(id);
    setReciter(next);
    savePreference(STORAGE_KEYS.reciter, next.id);
  }

  usePageTitle("Il Corano");

  // Carica la lista delle sure
  useEffect(() => {
    setError("");
    getSurahs()
      .then(setSurahs)
      .catch((err) => setError(`Non è stato possibile caricare il Corano. ${err.message}`));
  }, [attempt]);

  // Stop audio se cambio tab, ricerca o lettore
  const { stop } = player;
  useEffect(() => stop(), [tab, query, reciter, stop]);

  const filtered = surahs ? filterSurahs(surahs, query) : [];

  // Contenuto del tab
  let tabContent;
  if (error) tabContent = <ErrorMessage message={error} onRetry={() => setAttempt((value) => value + 1)} />;
  else if (!surahs) tabContent = <Loader label="Caricamento delle sure" />;
  else if (!filtered.length) tabContent = <p className="empty-state">Nessuna sura trovata.</p>;
  else if (tab === "surahs") tabContent = <SurahList surahs={filtered} />;
  else tabContent = <AudioList surahs={filtered} player={player} reciter={reciter} />;

  return (
    <PageLayout
      band={
        <PageTitle eyebrow="Lettura e ascolto" title="Il Corano">
          Le sure in arabo, con traslitterazione e traduzione italiana, da leggere o ascoltare.
        </PageTitle>
      }
    >
      <div className="quran-library">
        <label className="visually-hidden" htmlFor="search-surah">
          Cerca una sura
        </label>
        <input
          className="search-input"
          type="search"
          id="search-surah"
          placeholder="Cerca una sura o un numero"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <TabList label="Modalità del Corano" tabs={TABS} selected={tab} onSelect={setTab} idPrefix="quran" />
        {tab === "audio" && <ReciterSelect value={reciter.id} onChange={changeReciter} />}
        <TabPanel
          idPrefix="quran"
          selected={tab}
          className="card-grid page-width"
          aria-live={tab === "surahs" ? "polite" : undefined}
        >
          {tabContent}
        </TabPanel>
      </div>
    </PageLayout>
  );
}
