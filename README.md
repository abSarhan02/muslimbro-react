# muslimbro.

Il mio sito per accompagnare la giornata di un musulmano: orari di preghiera, direzione della Qibla, Corano in arabo e italiano e Azkar del mattino e della sera.

Online su [muslimbro.it](https://muslimbro.it).

## Cosa c'è

- **Orari di preghiera** per la tua posizione, con il countdown alla prossima preghiera (dopo Isha mostra il Fajr di domani)
- **Qibla**: bussola sul telefono con la Kaaba, direzione in gradi e distanza dalla Mecca
- **Corano**: tutte le 114 sure con testo arabo, traslitterazione, traduzione italiana e audio
- **Azkar** del mattino e della sera
- **Versetto del giorno** in home
- Tema chiaro e scuro

## Tecnologie

- React 19 + Vite
- React Router per le pagine
- CSS normale, un file per componente (niente framework)
- Test con il test runner di Node (`node --test`)

API usate (tutte pubbliche, niente chiavi):

- [AlAdhan](https://aladhan.com/prayer-times-api) per gli orari (metodo Muslim World League)
- [AlQuran Cloud](https://alquran.cloud/api) per testo e traduzione del Corano
- QuranicAudio e Islamic Network per gli audio delle recitazioni
- [ipapi](https://ipapi.co/) per la posizione approssimativa, solo se l'utente non dà quella precisa

## Pagine

| Indirizzo | Pagina |
| --- | --- |
| `/` | Home (orari, Qibla, pilastri, versetto del giorno, Azkar) |
| `/quran` | Lista delle sure |
| `/quran/:number` | Una sura, es. `/quran/2` (con `?ayah=255` va direttamente al versetto) |
| `/azkar?type=morning` | Azkar del mattino (`?type=evening` per la sera) |
| `/privacy` | Privacy |

Le rotte sono in `src/App.jsx`.

## Avviarlo in locale

Serve Node.js 20.19 o più recente.

```powershell
npm install
npm run dev      # http://127.0.0.1:4173
npm test         # test di orari, countdown, Qibla e testo arabo
npm run build    # build in dist/
npm run preview  # prova la build
```

## Struttura

```
src/
├── main.jsx          # monta <App /> dentro <BrowserRouter>
├── App.jsx           # rotte
├── index.css         # stili globali: colori, tema chiaro/scuro, bottoni
├── pages/            # una cartella per pagina
├── components/
│   ├── common/       # Brand, Loader, ErrorMessage, Tabs, ThemeToggle
│   ├── layout/       # SiteNav, UtilityLayout, PageTitle, ScrollToTop
│   ├── home/         # sezioni della home
│   ├── prayer/       # card degli orari
│   ├── qibla/        # bussola
│   ├── quran/        # lista sure, audio, testo
│   └── azkar/        # card di un dhikr
├── hooks/            # useCompass, usePrayerSchedule, useTheme, ...
├── services/         # chiamate alle API
├── utils/            # funzioni senza React (orari, Qibla, testo arabo, localStorage)
└── data/             # testi fissi: Azkar, nomi delle sure, pilastri, versetti
```

Ogni componente ha la sua cartella con `.jsx` e `.css`:

```
components/home/Hero/
├── Hero.jsx
└── Hero.css
```

In `public/` ci sono immagini, favicon, `og-image.png` per le anteprime social e `theme-init.js`, che mette il tema salvato prima che si carichi il CSS (così non c'è il flash bianco in modalità scura).

## La bussola della Qibla

La direzione la calcolo con la formula del cerchio massimo verso la Kaaba, quindi è riferita al nord vero. La bussola del telefono però indica il nord magnetico, che in Italia è spostato di circa 4° (altrove anche di più). Per correggere uso [geomagnetism](https://github.com/naturalatlas/geomagnetism) (Apache-2.0), che ha dentro il World Magnetic Model della NOAA. Tutto calcolato sul telefono, nessuna chiamata esterna.

Il modello WMM 2025 vale fino a novembre 2029: prima di quella data devo aggiornare la libreria.

### Provarla sul telefono

La bussola funziona solo in HTTPS, quindi per provarla dal telefono uso un tunnel temporaneo di Cloudflare (Vite accetta già i domini `trycloudflare.com`):

```powershell
winget install --id Cloudflare.cloudflared --exact
npm run dev
cloudflared tunnel --url http://127.0.0.1:4173
```

Apro il link `https://…trycloudflare.com` sul telefono, consento la posizione, giro la card con **Apri Qibla** e premo **Attiva bussola**.

## Pubblicazione

Il sito è su Cloudflare Pages collegato a questo repo: ogni push su `main` fa una nuova build.

| Campo | Valore |
| --- | --- |
| Framework preset | React (Vite) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node | dal file `.node-version` (22) |

Non serve il file `_redirects`: senza un `404.html` Cloudflare Pages tratta il sito come single page app e risponde sempre con `index.html`, poi ci pensa React Router.

In `public/_headers` ci sono gli header di sicurezza e il `noindex` per il beta e i link `pages.dev`, così Google indicizza solo muslimbro.it.

## Contatti

Per segnalazioni o correzioni: [muslimbro.it@gmail.com](mailto:muslimbro.it@gmail.com)
