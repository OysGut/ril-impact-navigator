export type Domain = "ecology" | "society" | "economy";
export type Answer = "yes" | "no" | "unsure";

export interface AnswerEntry {
  answer: Answer;
  verified: boolean;
}

export interface StopTriggers {
  fossil: boolean;
  offsetOnly: boolean;
  noBaseline: boolean;
  coDestructionUnknown: boolean;
}

export interface ProjectAssessment {
  id: string;
  name: string;
  industry: string;
  orgNumber?: string | undefined;
  nace?: { code: string; name: string }[];
  isStartup: boolean;
  answers: Record<string, AnswerEntry>;
  stopTriggers: StopTriggers;
  updatedAt: string;
}

export interface Question {
  id: string;
  domain: Domain;
  level: number;
  fbcBox: string;
  question: string;
  helpText: string;
}

export const DOMAINS: { id: Domain; label: string; en: string }[] = [
  { id: "ecology", label: "Økologi", en: "Environment" },
  { id: "society", label: "Samfunn", en: "Society" },
  { id: "economy", label: "Økonomi", en: "Economy" },
];

const q = (domain: Domain, level: number, fbcBox: string, question: string, helpText: string): Question => ({
  id: `${domain}-${level}`,
  domain,
  level,
  fbcBox,
  question,
  helpText,
});

export const QUESTIONS: Question[] = [
  q("ecology", 2, "Biophysical Stocks / Goals", "Er kjernevirksomheten fri for fossil utvinning eller direkte nedbygging av sårbar natur?", "Hvis kjernevirksomheten hviler på fossil energi eller ødeleggelse av natur, er nivået låst til maks 2."),
  q("ecology", 3, "Biophysical Stocks", "Har dere kartlagt virksomhetens påvirkning på de ni planetære grensene og oppfyller alle miljøkrav?", "Kjennskap til eget fotavtrykk på klima, ferskvann, arealbruk og kjemikalier."),
  q("ecology", 4, "Biophysical Stocks / Costs", "Har dere et dokumentert utgangspunkt (baseline) og målt reduksjon av økologisk skade over tid?", "Relativ forbedring («mindre dårlig»), men fortsatt med et netto negativt fotavtrykk."),
  q("ecology", 5, "Biophysical Stocks / Ecosystem Services", "Er dere innenfor en vitenskapelig rettferdig andel på alle vesentlige planetære grenser UTEN klimakompensasjon?", "Break-even / Nøytral. Ingen systematisk degradering av biosfæren. Kompensasjonskreditter teller ikke her."),
  q("ecology", 6, "Biophysical Stocks", "Gjenoppretter dere aktivt mer natur enn egen verdikjede har forbrukt eller forringet?", "Restaurerende innsats direkte koblet til egne material- og energiuttak."),
  q("ecology", 7, "Value Co-Creations", "Bidrar forretningsmodellen direkte til å bringe minst én planetær grense tilbake i trygg sone UTENFOR egen verdikjede?", "Systemisk positiv effekt som hjelper storsamfunnet eller andre sektorer med å reparere naturen."),
  q("ecology", 8, "Ecosystem Services", "Øker økosystemenes egen fornyelsesevne (vannets kretsløp, svampeffekt, jordsmonn, biomangfold) målbart der dere opererer?", "Tenk «The Watershed»: Reparerer dere det lille vannkretsløpet og bygger lokal biologisk motstandskraft?"),
  q("ecology", 9, "Governance", "Har naturen og økosystemet en formell juridisk stemme eller representasjon i styringen av virksomheten?", "Koevolusjon: Styret og beslutningsprosessene tilpasser seg kontinuerlig økologiske tilbakemeldinger."),
  q("society", 2, "Stakeholders / Needs", "Er virksomheten og leverandørkjeden dokumentert fri for grove brudd på menneskerettigheter og utnyttelse?", "Grunnleggende etisk minstekrav."),
  q("society", 3, "Stakeholders", "Har dere kartlagt påvirkningen på alle berørte interessenter (ikke bare kunder og aksjonærer)?", "Inkluderer naboer, lokalsamfunn, marginaliserte grupper og arbeidere i hele verdikjeden."),
  q("society", 4, "Value Co-Destructions", "Er sosiale skader og belastninger i kjeden kartlagt og reduseres de systematisk år for år?", "Målbare forbedringer på arbeidsforhold, stress, lokal forurensning eller ulikhet."),
  q("society", 5, "Needs / Stakeholders", "Sikrer virksomheten at ingen i verdikjeden faller under smultringens sosiale fundament (f.eks. reell levelønn, trygghet, helse)?", "Break-even i det sosiale laget: Ingen strukturelle hindringer skapes for menneskers verdighet."),
  q("society", 6, "Value Co-Creations", "Reparerer dere aktivt tidligere sosial eller kulturell belastning i miljøene der dere har operert?", "Gjenoppretting av tillit, lokalsamfunn, kulturminner eller historisk urett."),
  q("society", 7, "Value Co-Creations", "Løser dere et kritisk samfunnsbehov eller styrker fellesgoder for folk som aldri vil bli betalende kunder?", "Skaper verdier som tilfaller allmennheten uten krav om motytelse."),
  q("society", 8, "Governance", "Bygger dere lokalsamfunns og ansattes egen kapasitet og motstandskraft, fremfor å skape avhengighet av dere?", "Distribuert makt: Berørte parter er med på å utforme løsningene og sitter ved beslutningsbordet."),
  q("society", 9, "Governance", "Er fremtidige generasjoners rettigheter og interesser formelt forankret i styrende organer?", "Syvende generasjons-perspektivet: Ingen beslutninger tas som undergraver langsiktige levekår."),
  q("economy", 2, "Goals / Benefits", "Ville forretningsmodellen overlevd dersom dere måtte eliminere dens største negative eksternalitet?", "Hvis lønnsomheten avhenger av at samfunnet eller naturen tar regningen, er nivået maks 2."),
  q("economy", 3, "Value Co-Destructions", "Er boksen for «Value Co-Destructions» i FBC ærlig utfylt, anerkjent og gjennomgått av styre/ledelse?", "Blindsoner er fjernet. Man vet nøyaktig hva slags utilsiktet skade modellen forårsaker."),
  q("economy", 4, "Costs / Goals", "Er reduksjon av negative påvirkninger forankret i faste budsjettposter og ledelsens KPI-er?", "Skadereduksjon er ikke en CSR-kampanje, men en integrert del av driften."),
  q("economy", 5, "Goals / Financial Viability", "Er forretningsmodellen sunn og lønnsom UTEN å basere seg på underprising av natur eller sosial dumping?", "True Pricing-test: Modellen ville vært levedyktig selv om alle eksterne kostnader ble fakturert."),
  q("economy", 6, "Costs", "Finansieres reparasjon og restaurering av kjernevirksomheten, og ikke fra gaver eller sponsorbudsjetter?", "Restaurering er en direkte produksjonskostnad, innbakt i enhetsøkonomien."),
  q("economy", 7, "Benefits", "Vokser den positive samfunns- og naturreparasjonen proporsjonalt med virksomhetens omsetning?", "Koblet vekst: Jo mer dere selger, desto mer blir planeten og samfunnet friskmeldt."),
  q("economy", 8, "Financial Returns", "Fordeles den økonomiske verdiskapingen rettferdig til alle ledd, og ville lokalsamfunnet stått sterkere om selskapet opphørte?", "Anti-utvinning: Bygger lokal kapital og autonomi fremfor å sluse overskudd ut til passive eiere."),
  q("economy", 9, "Goals / Ownership", "Er finansiell avkastning og vekst formelt underordnet formålet (f.eks. forvaltereierskap / steward ownership)?", "Selskapet kan ikke selges til spekulasjon; kapitalen tjener formålet, ikke omvendt."),
];

export const STOP_TRIGGERS: { id: keyof StopTriggers; label: string; ceiling: number; warning: string }[] = [
  { id: "fossil", label: "Kjernevirksomheten er avhengig av fossil utvinning eller naturødeleggelse", ceiling: 2, warning: "Fossil- eller naturødeleggende kjernevirksomhet låser nivået til maks 2." },
  { id: "noBaseline", label: "Vi har ingen baseline-målinger av vår påvirkning", ceiling: 3, warning: "Uten baseline-målinger kan nivået ikke bli høyere enn 3." },
  { id: "offsetOnly", label: "Klimakompensasjon er eneste vei til netto null", ceiling: 4, warning: "Kompensasjon som eneste vei til null gir maks nivå 4." },
  { id: "coDestructionUnknown", label: "Value Co-Destructions er ukjent eller ikke kartlagt", ceiling: 4, warning: "Rødt flagg: Ukjente co-destructions blokkerer alt over nivå 4." },
];

export interface LevelInfo {
  level: number;
  name: string;
  short: string;
  definition: string;
  practice: string;
  fbc: string[];
  frameworks: { name: string; url: string }[];
  quote?: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, name: "Degenerativ", short: "Aktivt ødeleggende", definition: "Virksomheten bryter ned natur og samfunn som en del av sin kjerne.", practice: "Lønnsomheten forutsetter at andre tar regningen. Første steg er å erkjenne og stoppe.", fbc: ["Value Co-Destructions"], frameworks: [{ name: "FSSD – Karl-Henrik Robèrt", url: "https://www.naturalstep.org/" }], quote: "«Being less bad is not being good» – McDonough & Braungart" },
  { level: 2, name: "Skadelig / Ubevisst", short: "Ukjent skade", definition: "Grunnleggende minstekrav er møtt, men skaden er ukjent eller ignorert.", practice: "Fri for fossil kjerne og grove brudd, men uten oversikt over egen påvirkning.", fbc: ["Biophysical Stocks", "Stakeholders"], frameworks: [{ name: "The Natural Step (4 systembetingelser)", url: "https://thenaturalstep.org/approach/" }] },
  { level: 3, name: "Lovlydig / Bevisst", short: "Kartlagt", definition: "Påvirkning er kartlagt og regelverk etterleves.", practice: "Dere vet hvor skaden oppstår – det er første forutsetning for å redusere den.", fbc: ["Biophysical Stocks", "Stakeholders", "Value Co-Destructions"], frameworks: [{ name: "Planetære grenser – Stockholm Resilience Centre", url: "https://www.stockholmresilience.org/research/planetary-boundaries.html" }] },
  { level: 4, name: "Mindre dårlig", short: "Relativ forbedring", definition: "Målt reduksjon av skade over tid, men fortsatt netto negativt.", practice: "Effektivisering og skadereduksjon er forankret i budsjett og KPI-er.", fbc: ["Costs", "Goals"], frameworks: [{ name: "FSSD – 4 STOPP-prinsipper", url: "https://thenaturalstep.org/approach/" }], quote: "«Being less bad is not being good» – McDonough & Braungart" },
  { level: 5, name: "Nøytral / Break-even", short: "Streken", definition: "Innenfor rettferdig andel av planetære grenser og over det sosiale fundamentet – uten kompensasjon.", practice: "Ingen netto skade i noen av de tre lagene. Vannskillet mellom skade og bidrag.", fbc: ["Ecosystem Services", "Needs", "Financial Viability"], frameworks: [{ name: "Future-Fit Business Benchmark", url: "https://futurefitbusiness.org/" }, { name: "Doughnut Economics – Kate Raworth", url: "https://doughnuteconomics.org/" }, { name: "SBTN – Science Based Targets for Nature", url: "https://sciencebasedtargetsnetwork.org/" }] },
  { level: 6, name: "Restaurerende", short: "Egen kjede", definition: "Gjenoppretter mer enn egen verdikjede har forbrukt.", practice: "Restaurering er en produksjonskostnad – ikke sponsing.", fbc: ["Biophysical Stocks", "Value Co-Creations", "Costs"], frameworks: [{ name: "Flourishing Business Canvas", url: "https://flourishingbusiness.org/" }, { name: "Ellen MacArthur Foundation – sirkulær økonomi", url: "https://www.ellenmacarthurfoundation.org/" }] },
  { level: 7, name: "Systemisk", short: "Utenfor egen kjede", definition: "Bidrar til å bringe planetære grenser og fellesgoder tilbake i trygg sone utenfor egen kjede.", practice: "Positiv effekt vokser med omsetningen og tilfaller også ikke-kunder.", fbc: ["Value Co-Creations", "Benefits"], frameworks: [{ name: "Flourishing Business Canvas", url: "https://flourishingbusiness.org/" }] },
  { level: 8, name: "Regenerativ", short: "Økosystemkapasitet", definition: "Øker økosystemers og lokalsamfunns egen fornyelsesevne.", practice: "Reparerer det lille vannkretsløpet, bygger jordsmonn og lokal autonomi.", fbc: ["Ecosystem Services", "Governance", "Financial Returns"], frameworks: [{ name: "The Watershed – Stef van Dongen", url: "https://www.thewatershed.film/" }, { name: "Millán Millán – svampeffekten", url: "https://www.climateandcapitalmedia.com/" }, { name: "Biomimicry Institute", url: "https://biomimicry.org/" }], quote: "«Trær sender ikke fakturaer» – Stef van Dongen" },
  { level: 9, name: "Koevolusjonær", short: "Levende system", definition: "Natur og fremtidige generasjoner har formell stemme; kapitalen tjener formålet.", practice: "Forvaltereierskap og styring som tilpasser seg økologiske tilbakemeldinger.", fbc: ["Governance", "Goals", "Ownership"], frameworks: [{ name: "Steward Ownership / Purpose Foundation", url: "https://purpose-economy.org/" }, { name: "Biomimicry – Life's Principles", url: "https://biomimicry.org/" }] },
];

export const ROBERT_STOP = [
  "Stopp systematisk opphopning av stoffer fra jordskorpen (fossilt, metaller).",
  "Stopp systematisk opphopning av menneskeskapte stoffer i naturen.",
  "Stopp systematisk fysisk nedbygging og forringelse av natur.",
  "Stopp strukturelle hindringer for menneskers helse, innflytelse, kompetanse, rettferdighet og mening.",
];

export const NATURE_START = [
  "Local first – bruk lokale ressurser og relasjoner.",
  "Low energy – design for minimal energibruk.",
  "No waste – alt avfall er næring for noe annet.",
  "Distributed intelligence – spre makt og beslutninger.",
];

export function domainScore(domain: Domain, answers: Record<string, AnswerEntry>, isStartup: boolean): number {
  let score = 1;
  for (const qn of QUESTIONS.filter((x) => x.domain === domain).sort((a, b) => a.level - b.level)) {
    const a = answers[qn.id];
    const passed = a?.answer === "yes" && (isStartup || a.verified);
    if (!passed) break;
    score = qn.level;
  }
  return score;
}

export interface RilResult {
  total: number;
  label: string;
  asterisk: boolean;
  domains: Record<Domain, number>;
  bottleneck: Domain;
  ceiling: number | null;
  activeStops: typeof STOP_TRIGGERS;
  nextQuestion: Question | null;
}

export function calculateRIL(answers: Record<string, AnswerEntry>, isStartup: boolean, stopTriggers: StopTriggers): RilResult {
  const domains = {
    ecology: domainScore("ecology", answers, isStartup),
    society: domainScore("society", answers, isStartup),
    economy: domainScore("economy", answers, isStartup),
  };
  const raw = Math.min(domains.ecology, domains.society, domains.economy);
  const activeStops = STOP_TRIGGERS.filter((s) => stopTriggers[s.id]);
  const ceiling = activeStops.length ? Math.min(...activeStops.map((s) => s.ceiling)) : null;
  const total = ceiling !== null ? Math.min(raw, ceiling) : raw;
  // Nested order: first domain (env → soc → eco) with the lowest score
  const bottleneck = DOMAINS.find((d) => domains[d.id] === raw)!.id;
  const nextQuestion = QUESTIONS.find((x) => x.domain === bottleneck && x.level === domains[bottleneck] + 1) ?? null;
  return {
    total,
    asterisk: isStartup,
    label: `RIL ${total}${isStartup ? "*" : ""}`,
    domains,
    bottleneck,
    ceiling,
    activeStops,
    nextQuestion,
  };
}

export const emptyStops = (): StopTriggers => ({ fossil: false, offsetOnly: false, noBaseline: false, coDestructionUnknown: false });
