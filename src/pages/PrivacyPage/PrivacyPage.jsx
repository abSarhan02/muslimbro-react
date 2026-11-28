import { PageLayout } from "../../components/layout/PageLayout/PageLayout.jsx";
import { PageTitle } from "../../components/layout/PageTitle/PageTitle.jsx";
import { CONTACT_EMAIL } from "../../data/site.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import "./PrivacyPage.css";

// Link esterno (nuova scheda)
function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function MailLink() {
  return <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
}

// Servizi esterni usati dal sito
// Se aggiungo un'API va messa qui!
const SERVICES = [
  {
    name: "AlAdhan",
    use: "calcolo degli orari di preghiera (riceve coordinate, data e fuso orario)",
    href: "https://aladhan.com/privacy-policy",
  },
  {
    name: "ipapi.co",
    use: "posizione approssimativa ricavata dall’indirizzo IP, solo se la posizione precisa non è disponibile",
    href: "https://ipapi.co/privacy/",
  },
  { name: "AlQuran Cloud", use: "testo e traduzione del Corano", href: "https://alquran.cloud/" },
  { name: "QuranicAudio e Islamic Network", use: "file audio delle recitazioni" },
  { name: "Google Fonts", use: "caratteri tipografici", href: "https://policies.google.com/privacy" },
  {
    name: "Cloudflare",
    use: "hosting del sito e statistiche anonime delle visite (Web Analytics, senza cookie)",
    href: "https://www.cloudflare.com/privacypolicy/",
  },
];

// Pagina privacy
// (art. 13 GDPR)
export function PrivacyPage() {
  usePageTitle("Privacy");

  return (
    <PageLayout
      mainClassName="privacy-main"
      footerLink={<a href={`mailto:${CONTACT_EMAIL}`}>Contatti</a>}
      band={
        <PageTitle eyebrow="Trasparenza" title="Informativa privacy" align="start">
          Ultimo aggiornamento: 28 novembre 2026
        </PageTitle>
      }
    >
      <div className="privacy-content reading-width">
        <section className="privacy-section">
          <h2>1. Titolare del trattamento</h2>
          <p>
            <strong>Abdelkhalek Sarhan</strong>, contattabile all’indirizzo <MailLink />.
          </p>
        </section>

        <section className="privacy-section">
          <h2>2. Dati trattati, finalità e base giuridica</h2>
          <ul>
            <li>
              <strong>Posizione precisa</strong>: usata per calcolare gli orari di preghiera e la direzione della Qibla,
              solo se la autorizzi nel browser. Base giuridica: consenso (art. 6.1.a GDPR), revocabile in qualsiasi
              momento dalle impostazioni del browser.
            </li>
            <li>
              <strong>Indirizzo IP e dati tecnici di connessione</strong>: trasmessi ai servizi indicati sotto e al
              fornitore di hosting per mostrare le pagine e fornire le funzioni richieste. Se la posizione precisa non è
              disponibile, l’IP serve a stimare una posizione approssimativa. Base giuridica: legittimo interesse a
              fornire il servizio richiesto (art. 6.1.f GDPR).
            </li>
            <li>
              <strong>Statistiche delle visite</strong>: con Cloudflare Web Analytics conto le pagine visitate, il
              paese, il tipo di dispositivo e la velocità di caricamento, solo in forma aggregata. Non usa cookie, non
              salva l’indirizzo IP e non permette di riconoscerti. Base giuridica: legittimo interesse a capire come
              viene usato il sito e a migliorarlo (art. 6.1.f GDPR).
            </li>
            <li>
              <strong>Preferenze</strong>: tema chiaro o scuro (<code>muslimbro-theme</code>), scelta tra Azkar del
              mattino e della sera (<code>muslimbro-azkar-mode</code>) e lettore del Corano
              (<code>muslimbro-reciter</code>), salvati solo nel localStorage del tuo browser.
              Sono strumenti tecnici necessari alla funzione che hai scelto e non richiedono consenso.
            </li>
          </ul>
          <p>
            Il sito non usa cookie, pubblicità né strumenti di profilazione. Fornire la posizione è facoltativo: senza,
            gli orari si basano sulla posizione approssimativa oppure non sono disponibili.
          </p>
        </section>

        <section className="privacy-section">
          <h2>3. Destinatari</h2>
          <p>Per le funzioni del sito il browser contatta questi servizi, che trattano i dati come titolari autonomi:</p>
          <ul>
            {SERVICES.map((service) => (
              <li key={service.name}>
                <strong>{service.name}</strong>: {service.use}
                {service.href && (
                  <>
                    {" "}
                    (<ExternalLink href={service.href}>informativa</ExternalLink>)
                  </>
                )}
                .
              </li>
            ))}
          </ul>
          <p>
            Alcuni di questi fornitori possono trovarsi fuori dall’Unione europea. In tal caso il trasferimento avviene
            secondo le garanzie previste dagli artt. 44 e seguenti del GDPR e indicate nelle rispettive informative.
          </p>
        </section>

        <section className="privacy-section">
          <h2>4. Conservazione</h2>
          <p>
            Muslimbro non conserva coordinate né altri dati personali su propri server o database. Le preferenze restano
            nel tuo browser finché non le cancelli. I servizi esterni e il fornitore di hosting conservano i dati
            tecnici secondo le proprie informative.
          </p>
        </section>

        <section className="privacy-section">
          <h2>5. I tuoi diritti</h2>
          <p>
            Puoi chiedere accesso, rettifica, cancellazione, limitazione o portabilità dei dati, opporti al trattamento e
            revocare il consenso in qualsiasi momento, senza effetti sui trattamenti precedenti, scrivendo a{" "}
            <MailLink />. Puoi inoltre proporre reclamo al{" "}
            <ExternalLink href="https://www.garanteprivacy.it/">Garante per la protezione dei dati personali</ExternalLink>
            .
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
