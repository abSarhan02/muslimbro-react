import { Route, Routes } from "react-router";
import { InAppBanner } from "./components/common/InAppBanner/InAppBanner.jsx";
import { ScrollToTop } from "./components/layout/ScrollToTop/ScrollToTop.jsx";
import { AzkarPage } from "./pages/AzkarPage/AzkarPage.jsx";
import { HomePage } from "./pages/HomePage/HomePage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage.jsx";
import { PrivacyPage } from "./pages/PrivacyPage/PrivacyPage.jsx";
import { QuranPage } from "./pages/QuranPage/QuranPage.jsx";
import { SurahPage } from "./pages/SurahPage/SurahPage.jsx";

// Rotte del sito
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quran" element={<QuranPage />} />
        <Route path="/quran/:number" element={<SurahPage />} />
        <Route path="/azkar" element={<AzkarPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <InAppBanner />
    </>
  );
}
