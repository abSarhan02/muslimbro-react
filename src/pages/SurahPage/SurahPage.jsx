import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { ErrorMessage } from "../../components/common/ErrorMessage/ErrorMessage.jsx";
import { Loader } from "../../components/common/Loader/Loader.jsx";
import { ThemeToggle } from "../../components/common/ThemeToggle/ThemeToggle.jsx";
import { PageLayout } from "../../components/layout/PageLayout/PageLayout.jsx";
import { SurahText } from "../../components/quran/SurahText/SurahText.jsx";
import { useAudioPlayer } from "../../hooks/useAudioPlayer.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { getSurah } from "../../services/quranApi.js";
import { surahTitle, validAyah } from "../../utils/quranText.js";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage.jsx";
import "./SurahPage.css";

// Pagina della sura (/quran/2 o /quran/2?ayah=255)
export function SurahPage() {
  const { number } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const surahNumber = Number(number);
  const isValidNumber = Number.isInteger(surahNumber) && surahNumber >= 1 && surahNumber <= 114;

  // number: la sura a cui si riferisce il risultato
  const [result, setResult] = useState({ number: null, status: "loading", data: null, error: "" });
  const [attempt, setAttempt] = useState(0); // Per il pulsante Riprova
  const [showTransliteration, setShowTransliteration] = useState(false);
  const player = useAudioPlayer();
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // Se il risultato è di un'altra sura, sto ancora caricando
  const status = result.number === surahNumber ? result.status : "loading";

  // Dati della sura (arrivano col testo arabo)
  const surah = status === "ready" ? result.data.arabic : null;
  const title = surahTitle(surah ?? { number: surahNumber });
  const target = surah ? validAyah(surah, Number(searchParams.get("ayah"))) : null;

  usePageTitle(title);

  // Carica il testo della sura
  useEffect(() => {
    if (!isValidNumber) return;
    let active = true;
    getSurah(surahNumber).then(
      (data) => active && setResult({ number: surahNumber, status: "ready", data, error: "" }),
      (error) => active && setResult({ number: surahNumber, status: "error", data: null, error: error.message }),
    );
    return () => {
      active = false;
    };
  }, [surahNumber, isValidNumber, attempt]);

  // Stop audio se cambio sura
  const { stop } = player;
  useEffect(() => stop(), [surahNumber, stop]);

  // Focus sul titolo
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [surahNumber]);

  // Scrolla al versetto di ?ayah=
  useEffect(() => {
    if (status !== "ready" || !target) return;
    const verse = contentRef.current?.querySelector(`#ayah-${target}`);
    verse?.scrollIntoView({ block: "start", behavior: "instant" });
    verse?.focus({ preventScroll: true });
  }, [status, target]);

  // Riprova: torna in caricamento e richiede la sura
  function retry() {
    setResult({ number: null, status: "loading", data: null, error: "" });
    setAttempt((value) => value + 1);
  }

  // Esc torna alla lista
  function onKeyDown(event) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    navigate("/quran");
  }

  // Numero non valido = 404
  if (!isValidNumber) return <NotFoundPage />;

  return (
    // Senza navbar e footer
    <PageLayout hideChrome mainClassName="is-reading">
      <section
        className={`quran-reader${showTransliteration ? " show-transliteration" : ""}`}
        aria-labelledby="surah-title-it"
        onKeyDown={onKeyDown}
      >
        <div className="reader-toolbar">
          <div className="reader-toolbar-inner page-width">
            <Link className="reader-back" to="/quran" aria-label="Torna alle sure">
              <span className="reader-back-full">Torna alle sure</span>
              <span className="reader-back-short" aria-hidden="true">
                Sure
              </span>
            </Link>
            <span className="reader-current-surah" title={title}>
              {surah?.englishName || title}
            </span>
            <button
              className="switch-toggle reader-transliteration"
              type="button"
              aria-pressed={showTransliteration}
              aria-controls="surah-content"
              onClick={() => setShowTransliteration((value) => !value)}
            >
              Traslitterazione <span className="switch" aria-hidden="true"></span>
            </button>
            <ThemeToggle />
          </div>
        </div>

        <div className="reader-content reading-width">
          <header className="sura-header">
            <h1 ref={titleRef} className="surah-title-ar" lang="ar" dir="rtl" tabIndex={-1}>
              {surah?.name}
            </h1>
            <p id="surah-title-it" className="surah-title-it">
              {title}
            </p>
          </header>

          <div
            ref={contentRef}
            id="surah-content"
            className="surah-text"
            aria-busy={status === "loading" || undefined}
          >
            {status === "loading" && <Loader label="Caricamento della sura" />}
            {status === "error" && (
              <ErrorMessage
                message={`Non è stato possibile caricare la sura. ${result.error}`}
                onRetry={retry}
              />
            )}
            {status === "ready" && <SurahText data={result.data} target={target} player={player} />}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
