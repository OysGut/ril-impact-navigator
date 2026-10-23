export type Domain = "ecology" | "society" | "economy";
export type Flag = "fossilCore" | "offsetOnly" | "noBaseline" | "coDestructionUnknown";

export const UNKNOWN = "unknown";

export interface AnswerEntry {
  /** Option id, or UNKNOWN for «Vet ikke». */
  optionId: string;
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
  /** Legacy field, no longer used for scoring. */
  stopTriggers?: StopTriggers;
  schemaVersion?: number;
  /** Set when old answers were cleared after the question model changed. */
  resetNotice?: boolean;
  updatedAt: string;
}

export interface Option {
  id: string;
  label: string;
  hint?: string;
  maturity: 0 | 1 | 2 | 3 | 4;
  flags?: Flag[];
}

export interface Question {
  id: string;
  domain: Domain;
  theme: string;
  fbcBox: string;
  question: string;
  guidance: string[];
  options: Option[];
}

export const DOMAINS: { id: Domain; label: string; en: string }[] = [
  { id: "ecology", label: "Økologi", en: "Environment" },
  { id: "society", label: "Samfunn", en: "Society" },
  { id: "economy", label: "Økonomi", en: "Economy" },
];

const opts = (id: string, list: [string, string | undefined, Flag[]?][]): Option[] =>
  list.map(([label, hint, flags], i) => ({ id: `${id}-${i}`, label, ...(hint ? { hint } : {}), maturity: i as Option["maturity"], ...(flags ? { flags } : {}) }));

export const QUESTIONS: Question[] = [
  // ───────── Økologi
  {
    id: "eco-core", domain: "ecology", theme: "Kjernevirksomhet og natur", fbcBox: "Biophysical Stocks",
    question: "Hvordan henger kjernevirksomheten sammen med fossil energi og bruk av natur?",
    guidance: [
      "Tenk på det dere tjener mest penger på – ikke enkeltaktiviteter.",
      "Fossil utvinning er å hente ut olje, gass eller kull, eller levere tjenester som hovedsakelig er til for dette.",
      "Nedbygging av natur kan være myr, urørt skog, våtmark, kystsoner eller viktige leveområder.",
    ],
    options: opts("eco-core", [
      ["Kjernen er fossil utvinning eller nedbygging av natur", undefined, ["fossilCore"]],
      ["Vi er sterkt avhengige av fossil energi eller nedbygging, men det er ikke selve kjernen", undefined],
      ["Vi bruker fossil energi i driften, men kjernen er ikke avhengig av det", undefined],
      ["Fossil bruk er liten og fases ut etter en konkret plan", undefined],
      ["Virksomheten er fri for fossil energi og bygger ikke ned natur", undefined],
    ]),
  },
  {
    id: "eco-know", domain: "ecology", theme: "Kjennskap til påvirkning", fbcBox: "Biophysical Stocks",
    question: "Hvor godt kjenner dere virksomhetens påvirkning på naturen?",
    guidance: [
      "Påvirkning gjelder blant annet klima, arealbruk, ferskvann, biomangfold, nitrogen/fosfor og kjemikalier – de planetære grensene.",
      "En baseline er et målt utgangspunkt som senere målinger sammenlignes med.",
      "Tenk på hele verdikjeden: råvarer, produksjon, transport og bruk.",
    ],
    options: opts("eco-know", [
      ["Vi har ikke sett på dette", undefined, ["noBaseline"]],
      ["Vi har grove anslag, men ingen målinger", undefined, ["noBaseline"]],
      ["Vi har kartlagt de viktigste påvirkningene", "For eksempel et klimaregnskap eller en miljøkartlegging"],
      ["Vi måler årlig mot en baseline på alle vesentlige områder", undefined],
      ["Målingene viser at vi er innenfor en rettferdig andel av det naturen tåler", "Uten å regne med kjøpte klimakvoter"],
    ]),
  },
  {
    id: "eco-trend", domain: "ecology", theme: "Utvikling over tid", fbcBox: "Costs / Goals",
    question: "Hvordan utvikler den negative påvirkningen seg, og hvordan jobber dere mot null?",
    guidance: [
      "Se på de siste årene, og på hva som faktisk er målt.",
      "Klimakompensasjon er kjøp av kvoter eller kreditter for kutt andre steder.",
      "Velg det alternativet som best beskriver hovedveien deres.",
    ],
    options: opts("eco-trend", [
      ["Påvirkningen øker, eller vi vet ikke hvordan den utvikler seg", undefined],
      ["Vi når «netto null» hovedsakelig gjennom kjøp av klimakompensasjon", undefined, ["offsetOnly"]],
      ["Påvirkningen reduseres målbart år for år", undefined],
      ["Vi har kuttet så mye at vi er innenfor det naturen tåler, uten kompensasjon", undefined],
      ["Vi gir målbart mer tilbake til naturen enn vi tar", undefined],
    ]),
  },
  {
    id: "eco-restore", domain: "ecology", theme: "Gjenoppretting", fbcBox: "Ecosystem Services",
    question: "Hva gjør dere med natur som verdikjeden har brukt eller skadet?",
    guidance: [
      "Gjenoppretting kan være å restaurere natur, bygge jordsmonn, plante, rydde eller reparere vassdrag.",
      "Fornyelsesevne er naturens egen evne til å holde seg frisk: vannkretsløp («svampeffekten»), jordliv og artsmangfold.",
    ],
    options: opts("eco-restore", [
      ["Ingenting utover å følge regelverket", undefined],
      ["Enkeltprosjekter eller sponsing av naturtiltak", undefined],
      ["Vi restaurerer deler av det verdikjeden har påvirket", undefined],
      ["Vi gjenoppretter mer natur enn verdikjeden har brukt eller skadet", undefined],
      ["Vi øker målbart naturens egen fornyelsesevne der vi opererer", "For eksempel jordkarbon, vannføring eller artsregistreringer"],
    ]),
  },
  {
    id: "eco-beyond", domain: "ecology", theme: "Effekt utenfor egen kjede", fbcBox: "Value Co-Creations",
    question: "Hvordan påvirker virksomheten naturen utenfor egen verdikjede?",
    guidance: [
      "«Utenfor egen verdikjede» betyr at effekten kommer andre sektorer, regioner eller samfunnet til gode.",
      "Det skal være en følge av forretningsmodellen, ikke et sideprosjekt.",
    ],
    options: opts("eco-beyond", [
      ["Ingen kjent effekt utenfor egen kjede", undefined],
      ["Indirekte, for eksempel gjennom kunnskapsdeling", undefined],
      ["Vi hjelper enkelte andre aktører med å redusere sin påvirkning", undefined],
      ["Vi bidrar målbart til at minst én planetær grense kommer tilbake i trygg sone", undefined],
      ["Vi driver systemendring i et helt landskap, nedbørfelt eller en sektor", undefined],
    ]),
  },
  {
    id: "eco-gov", domain: "ecology", theme: "Naturens stemme", fbcBox: "Governance",
    question: "Hvem tar beslutninger på vegne av naturen i virksomheten?",
    guidance: [
      "Spørsmålet handler om faste ordninger, ikke frivillige rådføringer.",
      "Formell representasjon kan være et styremedlem, et fagråd med reell makt eller vedtekter som gir naturen rettigheter.",
    ],
    options: opts("eco-gov", [
      ["Ingen har dette ansvaret", undefined],
      ["En miljøansvarlig eller bærekraftsansvarlig", undefined],
      ["Naturmål er en del av styrets mål og ledelsens KPI-er", undefined],
      ["Et fagråd med reell innflytelse på beslutningene", undefined],
      ["Naturen har en formell, juridisk stemme i styringen", undefined],
    ]),
  },
  // ───────── Samfunn
  {
    id: "soc-rights", domain: "society", theme: "Menneskerettigheter", fbcBox: "Stakeholders / Needs",
    question: "Hvordan har dere oversikt over menneskerettigheter og arbeidsforhold i verdikjeden?",
    guidance: [
      "Grove brudd er for eksempel tvangsarbeid, barnearbeid eller farlige arbeidsforhold.",
      "En aktsomhetsvurdering (etter åpenhetsloven) er en systematisk sjekk av risiko hos leverandører.",
    ],
    options: opts("soc-rights", [
      ["Vi har ikke sett på dette", undefined],
      ["Vi har kontroll i egen virksomhet", undefined],
      ["Vi har gjort aktsomhetsvurderinger av de viktigste leverandørene", undefined],
      ["Hele verdikjeden er kartlagt og dokumentert fri for grove brudd", undefined],
      ["I tillegg følger vi opp og forbedrer forholdene sammen med leverandørene", undefined],
    ]),
  },
  {
    id: "soc-map", domain: "society", theme: "Berørte interessenter", fbcBox: "Stakeholders / Value Co-Destructions",
    question: "Hvem har dere kartlagt at virksomheten påvirker, og hvordan følges det opp?",
    guidance: [
      "Berørte interessenter er alle som påvirkes – ikke bare kunder og eiere.",
      "Det kan være naboer, lokalsamfunn, urfolk, ansatte hos leverandører og marginaliserte grupper.",
      "Sosiale belastninger kan være støy, stress, lokal forurensning eller økt ulikhet.",
    ],
    options: opts("soc-map", [
      ["Kunder og eiere", undefined],
      ["Også egne ansatte", undefined],
      ["Også lokalsamfunn og ansatte hos leverandører", undefined],
      ["Alle berørte, og belastningene måles og reduseres år for år", undefined],
      ["Berørte er med på å utforme løsningene sammen med oss", undefined],
    ]),
  },
  {
    id: "soc-found", domain: "society", theme: "Sosialt fundament", fbcBox: "Needs",
    question: "Hvordan sikrer dere at folk i verdikjeden har det de trenger for et verdig liv?",
    guidance: [
      "Det sosiale fundamentet (fra smultringøkonomien) er blant annet inntekt, helse, trygghet og innflytelse.",
      "Levelønn er lønn man faktisk kan leve av der man bor – ofte høyere enn minstelønn.",
    ],
    options: opts("soc-found", [
      ["Vi vet ikke hvordan det står til i verdikjeden", undefined],
      ["Vi følger lover og tariff i egen virksomhet", undefined],
      ["Egne ansatte har levelønn og trygge vilkår", undefined],
      ["Levelønn, helse og trygghet er sikret i hele verdikjeden", undefined],
      ["I tillegg reparerer vi tidligere sosial eller kulturell belastning", "For eksempel å gjenopprette tillit, kulturminner eller rette opp urett"],
    ]),
  },
  {
    id: "soc-commons", domain: "society", theme: "Fellesgoder", fbcBox: "Value Co-Creations",
    question: "Hvem får nytte av virksomheten utover kundene?",
    guidance: [
      "Fellesgoder er noe alle kan nyte godt av, som rent vann, møteplasser eller åpen kunnskap.",
      "Kapasitet betyr at folk blir mer selvstendige – ikke mer avhengige av dere.",
    ],
    options: opts("soc-commons", [
      ["I hovedsak bare kundene", undefined],
      ["Vi gir noe tilbake gjennom sponsing eller gaver", undefined],
      ["Vi bidrar til enkelte fellesgoder lokalt", undefined],
      ["Vi løser et kritisk samfunnsbehov også for folk som aldri blir kunder", undefined],
      ["Vi bygger lokalsamfunns og ansattes egen kapasitet og uavhengighet", undefined],
    ]),
  },
  {
    id: "soc-power", domain: "society", theme: "Innflytelse og makt", fbcBox: "Governance",
    question: "Hvem har reell innflytelse på virksomhetens viktigste beslutninger?",
    guidance: [
      "Tenk på hvem som faktisk sitter ved bordet når store beslutninger tas.",
      "Fremtidige generasjoner kan ikke stemme i dag – spørsmålet er om noen formelt skal ivareta dem.",
    ],
    options: opts("soc-power", [
      ["Eierne alene", undefined],
      ["Ledelsen, som lytter til ansatte og kunder", undefined],
      ["Ansatte er formelt representert", undefined],
      ["Berørte parter og lokalsamfunn sitter ved beslutningsbordet", undefined],
      ["Fremtidige generasjoners interesser er formelt forankret i styringen", undefined],
    ]),
  },
  // ───────── Økonomi
  {
    id: "econ-ext", domain: "economy", theme: "Ekte kostnader", fbcBox: "Goals / Financial Viability",
    question: "Hvis dere måtte betale for den største skaden modellen påfører andre, hva ville skjedd?",
    guidance: [
      "En negativ eksternalitet er en kostnad som naturen, samfunnet eller fremtidige generasjoner betaler.",
      "Tenk deg at alle skjulte kostnader ble lagt på regningen («true pricing»).",
    ],
    options: opts("econ-ext", [
      ["Modellen ville ikke overlevd", undefined],
      ["Det ville vært svært vanskelig", undefined],
      ["Det ville krevd store endringer, men er mulig", undefined],
      ["Modellen er lønnsom også med alle kostnader inkludert", undefined],
      ["Prisene våre dekker allerede alle kostnadene", undefined],
    ]),
  },
  {
    id: "econ-codes", domain: "economy", theme: "Utilsiktet skade", fbcBox: "Value Co-Destructions",
    question: "Hvordan har dere oversikt over verdier forretningsmodellen ødelegger eller svekker?",
    guidance: [
      "Dette er boksen «Value Co-Destructions» i Flourishing Business Canvas.",
      "Ærlig oversikt betyr at også ubehagelige sider er tatt med.",
    ],
    options: opts("econ-codes", [
      ["Vi har ikke sett på dette", undefined, ["coDestructionUnknown"]],
      ["Vi har en delvis eller uformell oversikt", undefined, ["coDestructionUnknown"]],
      ["Ledelsen har kartlagt det ærlig", undefined],
      ["Styret har gått gjennom det, og det følges opp med mål", undefined],
      ["Vi rapporterer åpent om det og følger opp sammen med de berørte", undefined],
    ]),
  },
  {
    id: "econ-fin", domain: "economy", theme: "Finansiering av tiltak", fbcBox: "Costs",
    question: "Hvordan finansieres arbeidet med å redusere skade og reparere natur og samfunn?",
    guidance: [
      "Spørsmålet handler om hvor pengene kommer fra, og hvor fast det er.",
      "Gaver, sponsing og egne CSR-budsjetter er noe annet enn kjernevirksomheten.",
    ],
    options: opts("econ-fin", [
      ["Det finansieres ikke", undefined],
      ["Gjennom gaver eller sponsing", undefined],
      ["Gjennom egne prosjektbudsjetter fra år til år", undefined],
      ["Gjennom faste budsjettposter og ledelsens KPI-er", undefined],
      ["Det er bakt inn i kostnaden for hvert produkt eller tjeneste", undefined],
    ]),
  },
  {
    id: "econ-growth", domain: "economy", theme: "Vekst og effekt", fbcBox: "Benefits",
    question: "Hva skjer med påvirkningen på natur og samfunn når omsetningen øker?",
    guidance: [
      "Tenk på hva ett ekstra solgt produkt eller én ekstra kunde betyr for natur og samfunn.",
    ],
    options: opts("econ-growth", [
      ["Skaden øker i takt med salget", undefined],
      ["Skaden øker, men saktere enn salget", undefined],
      ["Skaden per enhet går ned", undefined],
      ["Den positive effekten øker i takt med salget", undefined],
      ["Den positive effekten øker mer enn salget", undefined],
    ]),
  },
  {
    id: "econ-own", domain: "economy", theme: "Fordeling og eierskap", fbcBox: "Financial Returns / Ownership",
    question: "Hvordan fordeles verdiskapingen, og hvem kontrollerer selskapet?",
    guidance: [
      "Tenk på hvor overskuddet ender opp – lokalt eller hos eiere langt unna.",
      "Forvaltereierskap (steward ownership) betyr at selskapet ikke kan selges for spekulasjon; kapitalen tjener formålet.",
    ],
    options: opts("econ-own", [
      ["Overskuddet går i hovedsak til passive eiere", undefined],
      ["Vanlig fordeling mellom eiere og ansatte", undefined],
      ["Ansatte eller lokalsamfunn får en tydelig andel", undefined],
      ["Verdien fordeles rettferdig til alle ledd og bygger lokal kapital", undefined],
      ["Formålet er formelt overordnet avkastning, for eksempel gjennom forvaltereierskap", undefined],
    ]),
  },
];

/** Requirements per level, per domain. A level requires its own rules AND all lower levels' rules. */
export type Requirement = { questionId: string; min: number };
export const LEVEL_RULES: Record<Domain, Record<number, Requirement[]>> = {
  ecology: {
    2: [{ questionId: "eco-core", min: 1 }],
    3: [{ questionId: "eco-know", min: 2 }],
    4: [{ questionId: "eco-know", min: 3 }, { questionId: "eco-trend", min: 2 }],
    5: [{ questionId: "eco-core", min: 3 }, { questionId: "eco-trend", min: 3 }],
    6: [{ questionId: "eco-restore", min: 3 }],
    7: [{ questionId: "eco-beyond", min: 3 }],
    8: [{ questionId: "eco-restore", min: 4 }, { questionId: "eco-gov", min: 2 }],
    9: [{ questionId: "eco-gov", min: 4 }, { questionId: "eco-beyond", min: 4 }],
  },
  society: {
    2: [{ questionId: "soc-rights", min: 1 }],
    3: [{ questionId: "soc-map", min: 2 }],
    4: [{ questionId: "soc-rights", min: 2 }, { questionId: "soc-map", min: 3 }],
    5: [{ questionId: "soc-rights", min: 3 }, { questionId: "soc-found", min: 3 }],
    6: [{ questionId: "soc-found", min: 4 }],
    7: [{ questionId: "soc-commons", min: 3 }],
    8: [{ questionId: "soc-commons", min: 4 }, { questionId: "soc-power", min: 3 }],
    9: [{ questionId: "soc-power", min: 4 }],
  },
  economy: {
    2: [{ questionId: "econ-ext", min: 1 }],
    3: [{ questionId: "econ-codes", min: 2 }],
    4: [{ questionId: "econ-fin", min: 3 }],
    5: [{ questionId: "econ-ext", min: 3 }],
    6: [{ questionId: "econ-fin", min: 4 }],
    7: [{ questionId: "econ-growth", min: 3 }],
    8: [{ questionId: "econ-own", min: 3 }],
    9: [{ questionId: "econ-own", min: 4 }, { questionId: "econ-growth", min: 4 }],
  },
};

export const STOP_TRIGGERS: { id: Flag; ceiling: number; warning: string }[] = [
  { id: "fossilCore", ceiling: 2, warning: "Kjernevirksomheten bygger på fossil utvinning eller naturnedbygging – nivået er låst til maks 2." },
  { id: "noBaseline", ceiling: 3, warning: "Det finnes ingen målinger av påvirkningen – nivået kan ikke bli høyere enn 3." },
  { id: "offsetOnly", ceiling: 4, warning: "Netto null nås hovedsakelig med kompensasjon – nivået er låst til maks 4." },
  { id: "coDestructionUnknown", ceiling: 4, warning: "Rødt flagg: Utilsiktet skade (Value Co-Destructions) er ikke kartlagt – blokkerer alt over nivå 4." },
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

export const questionById = (id: string) => QUESTIONS.find((q) => q.id === id);

/** Effective maturity of one answer. «Vet ikke»/unanswered = 0. Established ventures: undocumented 3–4 counts one step lower. */
export function effectiveMaturity(q: Question, a: AnswerEntry | undefined, isStartup: boolean): number {
  if (!a || a.optionId === UNKNOWN) return 0;
  const o = q.options.find((x) => x.id === a.optionId);
  if (!o) return 0;
  if (!isStartup && o.maturity >= 3 && !a.verified) return o.maturity - 1;
  return o.maturity;
}

export interface CheckedRequirement extends Requirement {
  level: number;
  met: boolean;
  theme: string;
  needed: string;
  current: string;
}

export interface DomainResult {
  level: number;
  /** Requirements for the next level (empty at 9). */
  next: CheckedRequirement[];
  /** Met requirements up to the current level. */
  met: CheckedRequirement[];
}

function checkReq(r: Requirement, level: number, answers: Record<string, AnswerEntry>, isStartup: boolean): CheckedRequirement {
  const q = questionById(r.questionId)!;
  const a = answers[q.id];
  const m = effectiveMaturity(q, a, isStartup);
  const chosen = a && a.optionId !== UNKNOWN ? q.options.find((o) => o.id === a.optionId)?.label : undefined;
  return { ...r, level, met: m >= r.min, theme: q.theme, needed: q.options[r.min]!.label, current: chosen ?? (a ? "Vet ikke" : "Ikke besvart") };
}

export function domainResult(domain: Domain, answers: Record<string, AnswerEntry>, isStartup: boolean): DomainResult {
  const rules = LEVEL_RULES[domain];
  let level = 1;
  const met: CheckedRequirement[] = [];
  for (let L = 2; L <= 9; L++) {
    const checks = (rules[L] ?? []).map((r) => checkReq(r, L, answers, isStartup));
    if (checks.every((c) => c.met)) {
      level = L;
      met.push(...checks);
    } else {
      return { level, met, next: checks };
    }
  }
  return { level, met, next: [] };
}

export function activeFlags(answers: Record<string, AnswerEntry>): Flag[] {
  const flags = new Set<Flag>();
  for (const q of QUESTIONS) {
    const o = q.options.find((x) => x.id === answers[q.id]?.optionId);
    o?.flags?.forEach((f) => flags.add(f));
  }
  return [...flags];
}

export interface RilResult {
  total: number;
  label: string;
  asterisk: boolean;
  domains: Record<Domain, number>;
  details: Record<Domain, DomainResult>;
  bottleneck: Domain;
  ceiling: number | null;
  activeStops: typeof STOP_TRIGGERS;
  /** First unmet requirement in the bottleneck layer. */
  nextStep: CheckedRequirement | null;
}

export function calculateRIL(answers: Record<string, AnswerEntry>, isStartup: boolean): RilResult {
  const details = {
    ecology: domainResult("ecology", answers, isStartup),
    society: domainResult("society", answers, isStartup),
    economy: domainResult("economy", answers, isStartup),
  };
  const domains = { ecology: details.ecology.level, society: details.society.level, economy: details.economy.level };
  const raw = Math.min(domains.ecology, domains.society, domains.economy);
  const flags = activeFlags(answers);
  const activeStops = STOP_TRIGGERS.filter((s) => flags.includes(s.id));
  const ceiling = activeStops.length ? Math.min(...activeStops.map((s) => s.ceiling)) : null;
  const total = ceiling !== null ? Math.min(raw, ceiling) : raw;
  const bottleneck = DOMAINS.find((d) => domains[d.id] === raw)!.id;
  const nextStep = details[bottleneck].next.find((c) => !c.met) ?? null;
  return { total, asterisk: isStartup, label: `RIL ${total}${isStartup ? "*" : ""}`, domains, details, bottleneck, ceiling, activeStops, nextStep };
}

export const STARTUP_CERTAINTY_CAP = 60;

export interface CertaintyResult {
  domains: Record<Domain, number>;
  total: number;
  /** Questions lowering certainty, per domain. */
  weak: Record<Domain, { id: string; theme: string; reason: string }[]>;
}

/** Documented = 1, answered undocumented = 0.5, «Vet ikke»/unanswered = 0. Startups are capped at 60 %. */
export function calculateCertainty(answers: Record<string, AnswerEntry>, isStartup: boolean): CertaintyResult {
  const domains = {} as Record<Domain, number>;
  const weak = {} as CertaintyResult["weak"];
  for (const d of DOMAINS) {
    const qs = QUESTIONS.filter((q) => q.domain === d.id);
    let sum = 0;
    weak[d.id] = [];
    for (const q of qs) {
      const a = answers[q.id];
      if (!a) { weak[d.id].push({ id: q.id, theme: q.theme, reason: "Ikke besvart" }); continue; }
      if (a.optionId === UNKNOWN) { weak[d.id].push({ id: q.id, theme: q.theme, reason: "Vet ikke" }); continue; }
      if (a.verified) sum += 1;
      else { sum += 0.5; weak[d.id].push({ id: q.id, theme: q.theme, reason: "Ikke dokumentert" }); }
    }
    let pct = Math.round((sum / qs.length) * 100);
    if (isStartup) pct = Math.round((pct * STARTUP_CERTAINTY_CAP) / 100);
    domains[d.id] = pct;
  }
  const total = Math.round((domains.ecology + domains.society + domains.economy) / 3);
  return { domains, total, weak };
}
