import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { AzkarCard } from "../../components/azkar/AzkarCard/AzkarCard.jsx";
import { TabList, TabPanel } from "../../components/common/Tabs/Tabs.jsx";
import { PageLayout } from "../../components/layout/PageLayout/PageLayout.jsx";
import { PageTitle } from "../../components/layout/PageTitle/PageTitle.jsx";
import { azkarData, azkarItalian, azkarTitles, pageTitles } from "../../data/azkarData.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { STORAGE_KEYS, readPreference, savePreference } from "../../utils/storage.js";
import "./AzkarPage.css";

const MODES = [
  { id: "morning", label: "Mattino" },
  { id: "evening", label: "Sera" },
];

const TEXT_OPTIONS = [
  { id: "italian", label: "Italiano" },
  { id: "transliteration", label: "Traslitterazione" },
];

const isMode = (value) => MODES.some((mode) => mode.id === value);

// Pagina Azkar (/azkar?type=morning o evening)
// Senza type usa l'ultima scelta salvata
export function AzkarPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFromUrl = searchParams.get("type");
  const savedMode = readPreference(STORAGE_KEYS.azkarMode);
  const mode = isMode(typeFromUrl) ? typeFromUrl : isMode(savedMode) ? savedMode : "morning";

  // Contatori di mattina e sera
  const [counts, setCounts] = useState(() => ({
    morning: azkarData.morning.map(() => 0),
    evening: azkarData.evening.map(() => 0),
  }));
  const [visibleTexts, setVisibleTexts] = useState({ italian: true, transliteration: false });

  usePageTitle("Azkar quotidiani");

  // Salva l'ultima scelta
  useEffect(() => {
    savePreference(STORAGE_KEYS.azkarMode, mode);
  }, [mode]);

  // Cambia tipo nell'URL
  function changeMode(newMode) {
    setSearchParams({ type: newMode }, { replace: true });
  }

  // +1 al contatore (max maxNumber)
  function increaseCount(index) {
    setCounts((current) => ({
      ...current,
      [mode]: current[mode].map((value, i) =>
        i === index ? Math.min(azkarData[mode][index].maxNumber, value + 1) : value,
      ),
    }));
  }

  function toggleText(id) {
    setVisibleTexts((current) => ({ ...current, [id]: !current[id] }));
  }

  const title = pageTitles[mode];

  // Classi per mostrare/nascondere i testi
  const textClasses = Object.entries(visibleTexts)
    .filter(([, visible]) => visible)
    .map(([id]) => ` show-${id}`)
    .join("");

  return (
    <PageLayout
      band={
        <>
          <TabList
            className="azkar-mode"
            label="Momento della giornata"
            tabs={MODES}
            selected={mode}
            onSelect={changeMode}
            idPrefix="azkar"
          />
          <PageTitle arabic={title.ar} title={title.it}>
            Invocazioni conosciute per accompagnare l'inizio e la fine della giornata.
          </PageTitle>
        </>
      }
    >
      <TabPanel idPrefix="azkar" selected={mode} className={`azkar-container reading-width${textClasses}`} tabIndex={0}>
        <div className="reading-options" role="group" aria-label="Testi da mostrare">
          {TEXT_OPTIONS.map((option) => (
            <button
              key={option.id}
              className="switch-toggle"
              type="button"
              aria-pressed={visibleTexts[option.id]}
              onClick={() => toggleText(option.id)}
            >
              {option.label}
              <span className="switch" aria-hidden="true"></span>
            </button>
          ))}
        </div>

        <div className="azkar-grid">
          {azkarData[mode].map((item, index) => (
            <AzkarCard
              key={`${mode}-${index}`}
              index={index}
              item={item}
              title={azkarTitles[mode][index]}
              italian={azkarItalian[mode][index]}
              count={counts[mode][index]}
              onCount={() => increaseCount(index)}
            />
          ))}
        </div>
      </TabPanel>
    </PageLayout>
  );
}
