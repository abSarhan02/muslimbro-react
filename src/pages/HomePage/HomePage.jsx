import { useEffect } from "react";
// Il CSS della pagina va prima di quello dei componenti, cosi i componenti possono sovrascriverlo
import "./HomePage.css";
import { AzkarSection } from "../../components/home/AzkarSection/AzkarSection.jsx";
import { DailyVerse } from "../../components/home/DailyVerse/DailyVerse.jsx";
import { Hero } from "../../components/home/Hero/Hero.jsx";
import { HomeFooter } from "../../components/home/HomeFooter/HomeFooter.jsx";
import { PillarsSection } from "../../components/home/PillarsSection/PillarsSection.jsx";
import { QuranFeature } from "../../components/home/QuranFeature/QuranFeature.jsx";
import { SiteNav } from "../../components/layout/SiteNav/SiteNav.jsx";
import { PrayerSection } from "../../components/prayer/PrayerSection/PrayerSection.jsx";

// Home
export function HomePage() {
  // Titolo della pagina
  useEffect(() => {
    document.title = "muslimbro. | Il tuo compagno spirituale quotidiano";
  }, []);

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
