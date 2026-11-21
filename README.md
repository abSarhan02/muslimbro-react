# MuslimBro

Sito in React con Vite e React Router.

| Indirizzo | Pagina |
| --- | --- |
| `/` | Home (orari, Qibla, pilastri, versetto del giorno, Azkar) |
| `/quran` | Lista delle sure |
| `/quran/:number` | Lettura di una sura (es. `/quran/2`, oppure `/quran/2?ayah=255` per andare a un versetto) |
| `/azkar?type=morning` / `?type=evening` | Azkar del mattino o della sera |
| `/privacy` | Informativa privacy |

Le rotte sono definite in `src/App.jsx`.

## Avvio

Con Node.js 20.19 o successivo:

```powershell
npm install
npm run dev      # sviluppo su http://127.0.0.1:4173
npm test         # test di orari, countdown, Qibla e testo arabo
npm run build    # build di produzione in dist/
npm run preview  # anteprima della build su http://127.0.0.1:4173
```

## Pubblicazione

Il sito è su **Cloudflare Pages**, collegato a questo repository GitHub: ogni push su `main` fa partire una nuova build.

Impostazioni del progetto su Cloudflare Pages:

| Campo | Valore |
| --- | --- |
| Framework preset | React (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Versione di Node | presa dal file `.node-version` (22) |

Non serve nessun file `_redirects`: se nel progetto non c'è un `404.html`, Cloudflare Pages tratta il sito come una single page app e risponde con `index.html` a ogni indirizzo (`/quran`, `/azkar`...). Su altri hosting va configurato il "fallback" su `index.html`.

Non ci sono variabili d'ambiente né chiavi API: tutte le API usate sono pubbliche.

Immagini, favicon (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, icone del `site.webmanifest`) e `theme-init.js` stanno in `public/` (es. `/images/og-image.png`, l'anteprima per i social).

## Struttura

```
src/
├── main.jsx          # punto di ingresso: monta <App /> dentro <BrowserRouter>
├── App.jsx           # le rotte del sito (React Router)
├── index.css         # stili globali: colori, temi chiaro/scuro, elementi comuni
├── pages/            # una cartella per pagina (HomePage, QuranPage, SurahPage, AzkarPage, PrivacyPage, NotFoundPage)
├── components/
│   ├── common/       # pezzi riutilizzabili: Brand, Loader, ErrorMessage, Tabs, ThemeToggle
│   ├── layout/       # SiteNav, UtilityLayout, PageTitle, ScrollToTop
│   ├── home/         # sezioni della home (Hero, Pilastri, Corano, Versetto, Azkar, Footer)
│   ├── prayer/       # scheda degli orari di preghiera
│   ├── qibla/        # bussola della Qibla
│   ├── quran/        # lista delle sure, audio e testo della sura
│   └── azkar/        # scheda di un'invocazione
├── hooks/            # custom hook (useMediaQuery, useTheme, usePrayerSchedule, useCompass, ...)
├── services/         # chiamate alle API (AlAdhan, AlQuran Cloud, ipapi) e fetchJSON
├── utils/            # funzioni senza React: calcolo orari, Qibla, testo arabo, localStorage
└── data/             # dati statici: testi degli Azkar, nomi delle sure, pilastri, versetti
```

Ogni componente e ogni pagina ha la sua cartella con il file .jsx e il suo .css, per esempio:

```
components/home/Hero/
├── Hero.jsx
└── Hero.css
```

I test in `tests/` provano le funzioni di `utils/` e `services/`.

`public/theme-init.js` applica il tema salvato prima del CSS, per evitare cambi di colore all'apertura.

## Prova della Qibla sul telefono

Avvio `npm run dev`. Per provare posizione e bussola dal telefono uso un link HTTPS temporaneo con [Cloudflare Quick Tunnel](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/) (il server di Vite accetta già i domini `trycloudflare.com`). L'accesso ai sensori richiede una [connessione sicura e un clic sul pulsante](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static).

```powershell
winget install --id Cloudflare.cloudflared --exact
cloudflared tunnel --url http://127.0.0.1:4173
```

Apro il link `https://…trycloudflare.com` nel browser del telefono, consento la posizione e premo **Attiva bussola** nella sezione Qibla. Tengo il telefono in piano e lo ruoto fino a portare la freccia verso l'alto.
