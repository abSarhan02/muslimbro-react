// CSS della pagina prima dei componenti
import "./HomePage.css";
import { AzkarSection } from "../../components/home/AzkarSection/AzkarSection.jsx";
import { DailyVerse } from "../../components/home/DailyVerse/DailyVerse.jsx";
import { Hero } from "../../components/home/Hero/Hero.jsx";
import { HomeFooter } from "../../components/home/HomeFooter/HomeFooter.jsx";
import { PillarsSection } from "../../components/home/PillarsSection/PillarsSection.jsx";
import { QuranFeature } from "../../components/home/QuranFeature/QuranFeature.jsx";
import { SiteNav } from "../../components/layout/SiteNav/SiteNav.jsx";
import { PrayerSection } from "../../components/prayer/PrayerSection/PrayerSection.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";

// Home
export function HomePage() {
  usePageTitle();

  return (
    <>
      <a className="skip-link" href="#prayer-times">
        Vai agli orari di preghiera
      </a>
      <SiteNav />
      <Hero />
      <main className="home-main">
        <PrayerSection />
        <PillarsSection />
        <QuranFeature />
        <DailyVerse />
        <AzkarSection />
      </main>
      <HomeFooter />
    </>
  );
}
