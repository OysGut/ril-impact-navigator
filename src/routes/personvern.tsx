import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/personvern")({
  head: () => ({
    meta: [
      { title: "Personvern – RIL Navigator" },
      { name: "description", content: "Slik behandler RIL Navigator personopplysninger: ingen salg, ingen sporing, data lagres i Irland (EU)." },
      { property: "og:title", content: "Personvernerklæring – RIL Navigator" },
      { property: "og:description", content: "Ingen salg, ingen sporing. Data lagres i EU (Irland)." },
    ],
  }),
  component: Privacy,
});

const SECTIONS = [
  {
    nb: ["Behandlingsansvarlig", "Claus Gladyszak er eier av RIL Navigator og behandlingsansvarlig for personopplysninger etter personvernforordningen (GDPR)."],
    en: ["Data controller", "Claus Gladyszak owns RIL Navigator and is the data controller under the General Data Protection Regulation (GDPR)."],
  },
  {
    nb: ["Hvilke opplysninger vi lagrer", "Uten bruker lagres vurderingene kun i din egen nettleser. Lager du en bruker, lagrer vi e-postadressen din (eller Google-kontoens e-post) og vurderingene du oppretter: navn på prosjekt, bransje, org.nr. og svarene dine. Vi lagrer ingen annen profilinformasjon."],
    en: ["What we store", "Without an account, assessments are stored only in your own browser. If you create an account, we store your email address (or your Google account email) and the assessments you create: project name, industry, organisation number and your answers. We store no other profile information."],
  },
  {
    nb: ["Formål og rettslig grunnlag", "Opplysningene brukes kun for å gi deg tilgang til egne vurderinger. Grunnlaget er avtale med deg (GDPR art. 6 nr. 1 b) når du oppretter en bruker."],
    en: ["Purpose and legal basis", "The data is used only to give you access to your own assessments. The legal basis is the agreement with you (GDPR Art. 6(1)(b)) when you create an account."],
  },
  {
    nb: ["Ingen salg, deling eller sporing", "Vi selger aldri opplysningene dine, deler dem ikke med tredjeparter for markedsføring og bruker dem ikke til andre formål. Vi bruker ingen sporings- eller annonsecookies og ingen analyseverktøy som følger deg. Nettleserens lokale lagring brukes kun til innlogging, språkvalg og vurderinger."],
    en: ["No selling, sharing or tracking", "We never sell your data, never share it with third parties for marketing and never use it for any other purpose. We use no tracking or advertising cookies and no analytics that follow you. Browser local storage is used only for sign-in, language choice and assessments."],
  },
  {
    nb: ["Hvor data lagres", "Data lagres hos vår driftsleverandør i datasenter i Irland, innenfor EU/EØS. Opplysningene overføres ikke ut av EU/EØS for lagring. Ved bruk av Google-innlogging behandler Google innloggingen etter egne vilkår. Valgfrie AI-forslag til NACE-koder sender kun navn og beskrivelse av prosjektet, ikke personopplysninger."],
    en: ["Where data is stored", "Data is stored with our hosting provider in a data centre in Ireland, within the EU/EEA. Data is not transferred outside the EU/EEA for storage. If you use Google sign-in, Google processes the sign-in under its own terms. Optional AI suggestions for NACE codes send only the project name and description, not personal data."],
  },
  {
    nb: ["Lagringstid og sletting", "Vi lagrer opplysningene så lenge du har en bruker. Du kan når som helst slette kontoen og alle vurderinger med «Slett meg» i menyen. Slettingen er permanent og skjer umiddelbart."],
    en: ["Retention and deletion", "We keep the data for as long as you have an account. You can delete your account and all assessments at any time with «Delete me» in the menu. Deletion is permanent and immediate."],
  },
  {
    nb: ["Dine rettigheter", "Du har rett til innsyn, retting, sletting, begrensning, dataportabilitet og til å protestere mot behandlingen (GDPR art. 15–21). Henvend deg til eieren, Claus Gladyszak. Du kan også klage til Datatilsynet (datatilsynet.no)."],
    en: ["Your rights", "You have the right to access, rectification, erasure, restriction, data portability and to object to processing (GDPR Art. 15–21). Contact the owner, Claus Gladyszak. You may also lodge a complaint with the Norwegian Data Protection Authority (datatilsynet.no) or your local supervisory authority."],
  },
];

function Privacy() {
  const { lang, tr } = useT();
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-4xl font-semibold">{tr({ nb: "Personvernerklæring", en: "Privacy policy" })}</h1>
      <p className="mt-3 text-muted-foreground">{tr({ nb: "Kort fortalt: vi lagrer bare det som trengs for at du skal finne igjen vurderingene dine. Vi selger ingenting, deler ingenting og sporer deg ikke.", en: "In short: we store only what is needed for you to find your assessments again. We sell nothing, share nothing and do not track you." })}</p>
      <div className="mt-8 space-y-6">
        {SECTIONS.map((s) => {
          const [h, p] = s[lang];
          return (
            <section key={h} className="rounded-2xl border bg-card p-6">
              <h2 className="text-lg font-semibold">{h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p}</p>
            </section>
          );
        })}
      </div>
      <p className="mt-8 text-xs text-muted-foreground">{tr({ nb: "Sist oppdatert: oktober 2026", en: "Last updated: October 2026" })}</p>
    </main>
  );
}
