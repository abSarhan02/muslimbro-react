import { useEffect, useState } from "react";
import { ErrorMessage } from "../../components/common/ErrorMessage/ErrorMessage.jsx";
import { Loader } from "../../components/common/Loader/Loader.jsx";
import { TabList, TabPanel } from "../../components/common/Tabs/Tabs.jsx";
import { PageTitle } from "../../components/layout/PageTitle/PageTitle.jsx";
import { UtilityLayout } from "../../components/layout/UtilityLayout/UtilityLayout.jsx";
import { AudioList } from "../../components/quran/AudioList/AudioList.jsx";
import { SurahList } from "../../components/quran/SurahList/SurahList.jsx";
import { useAudioPlayer } from "../../hooks/useAudioPlayer.js";
import { getSurahs } from "../../services/quranApi.js";
import { filterSurahs } from "../../utils/quranText.js";
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
  const player = useAudioPlayer();

  // Titolo della pagina
  useEffect(() => {
    document.title = "Il Corano | MuslimBro";
  }, []);

  // Carica la lista delle sure
  useEffect(() => {
    setError("");
    getSurahs()
      .then(setSurahs)
      .catch((err) => setError(`Non è stato possibile caricare il Corano. ${err.message}`));
  }, [attempt]);

  // Stop audio se cambio tab o ricerca
  const { stop } = player;
  useEffect(() => stop(), [tab, query, stop]);

  const filtered = surahs ? filterSurahs(surahs, query) : [];

  // Contenuto del tab
  let tabContent;
  if (error) tabContent = <ErrorMessage message={error} onRetry={() => setAttempt((value) => value + 1)} />;
  else if (!surahs) tabContent = <Loader label="Caricamento delle sure" />;
  else if (tab === "surahs") tabContent = <SurahList surahs={filtered} />;
  else tabContent = <AudioList surahs={filtered} player={player} />;

  return (
    <UtilityLayout
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
        <TabPanel
          idPrefix="quran"
          selected={tab}
          className="card-grid page-width"
          aria-live={tab === "surahs" ? "polite" : undefined}
        >
          {tabContent}
        </TabPanel>
      </div>
    </UtilityLayout>
  );
}
