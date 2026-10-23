// English translations of the content in ril.ts, keyed by id. ril.ts (Norwegian) is the source of truth for structure.
import type { Flag } from "./ril";

export const QUESTIONS_EN: Record<string, { theme: string; question: string; guidance: string[]; options: [string, string?][] }> = {
  "eco-core": {
    theme: "Core business and nature",
    question: "How is the core business connected to fossil energy and the use of nature?",
    guidance: [
      "Think about what you earn most of your money on – not individual activities.",
      "Fossil extraction means extracting oil, gas or coal, or providing services mainly for this.",
      "Destruction of nature can mean bogs, old-growth forest, wetlands, coastal zones or important habitats.",
    ],
    options: [
      ["The core is fossil extraction or destruction of nature"],
      ["We depend heavily on fossil energy or land conversion, but it is not the core itself"],
      ["We use fossil energy in operations, but the core does not depend on it"],
      ["Fossil use is small and is being phased out under a concrete plan"],
      ["The business is free of fossil energy and does not destroy nature"],
    ],
  },
  "eco-know": {
    theme: "Knowledge of impact",
    question: "How well do you know the business's impact on nature?",
    guidance: [
      "Impact covers climate, land use, freshwater, biodiversity, nitrogen/phosphorus and chemicals – the planetary boundaries.",
      "A baseline is a measured starting point that later measurements are compared with.",
      "Think about the whole value chain: raw materials, production, transport and use.",
    ],
    options: [
      ["We have not looked at this"],
      ["We have rough estimates, but no measurements"],
      ["We have mapped the most important impacts", "For example a carbon account or environmental mapping"],
      ["We measure annually against a baseline in all material areas"],
      ["Measurements show we are within a fair share of what nature can bear", "Without counting purchased carbon credits"],
    ],
  },
  "eco-trend": {
    theme: "Development over time",
    question: "How is the negative impact developing, and how are you working towards zero?",
    guidance: [
      "Look at the last few years, and at what has actually been measured.",
      "Carbon offsetting means buying credits for reductions elsewhere.",
      "Choose the option that best describes your main path.",
    ],
    options: [
      ["The impact is increasing, or we don't know how it is developing"],
      ["We reach “net zero” mainly by buying carbon offsets"],
      ["The impact is decreasing measurably year by year"],
      ["We have cut so much that we are within what nature can bear, without offsets"],
      ["We measurably give more back to nature than we take"],
    ],
  },
  "eco-restore": {
    theme: "Restoration",
    question: "What do you do about nature that the value chain has used or damaged?",
    guidance: [
      "Restoration can mean rewilding, building soil, planting, clearing or repairing waterways.",
      "Regenerative capacity is nature's own ability to stay healthy: water cycles (the “sponge effect”), soil life and species diversity.",
    ],
    options: [
      ["Nothing beyond complying with regulations"],
      ["Individual projects or sponsorship of nature initiatives"],
      ["We restore parts of what the value chain has affected"],
      ["We restore more nature than the value chain has used or damaged"],
      ["We measurably increase nature's own regenerative capacity where we operate", "For example soil carbon, water flow or species records"],
    ],
  },
  "eco-beyond": {
    theme: "Impact beyond own chain",
    question: "How does the business affect nature outside its own value chain?",
    guidance: [
      "“Outside the value chain” means the effect benefits other sectors, regions or society.",
      "It must follow from the business model, not a side project.",
    ],
    options: [
      ["No known effect outside our own chain"],
      ["Indirectly, for example through knowledge sharing"],
      ["We help certain other actors reduce their impact"],
      ["We contribute measurably to bringing at least one planetary boundary back into the safe zone"],
      ["We drive system change across a whole landscape, watershed or sector"],
    ],
  },
  "eco-gov": {
    theme: "Nature's voice",
    question: "Who makes decisions on behalf of nature in the business?",
    guidance: [
      "This is about permanent arrangements, not voluntary consultations.",
      "Formal representation can be a board member, an expert council with real power, or articles of association that give nature rights.",
    ],
    options: [
      ["Nobody has this responsibility"],
      ["An environmental or sustainability manager"],
      ["Nature goals are part of the board's goals and management KPIs"],
      ["An expert council with real influence on decisions"],
      ["Nature has a formal, legal voice in governance"],
    ],
  },
  "soc-rights": {
    theme: "Human rights",
    question: "How do you keep track of human rights and working conditions in the value chain?",
    guidance: [
      "Gross violations include forced labour, child labour or dangerous working conditions.",
      "A due diligence assessment is a systematic check of risk at suppliers.",
    ],
    options: [
      ["We have not looked at this"],
      ["We have control within our own business"],
      ["We have done due diligence on the most important suppliers"],
      ["The whole value chain is mapped and documented free of gross violations"],
      ["We also follow up and improve conditions together with suppliers"],
    ],
  },
  "soc-map": {
    theme: "Affected stakeholders",
    question: "Whom have you mapped the business as affecting, and how is it followed up?",
    guidance: [
      "Affected stakeholders are everyone who is affected – not just customers and owners.",
      "This can be neighbours, local communities, indigenous peoples, supplier employees and marginalised groups.",
      "Social burdens can be noise, stress, local pollution or increased inequality.",
    ],
    options: [
      ["Customers and owners"],
      ["Our own employees as well"],
      ["Local communities and supplier employees as well"],
      ["Everyone affected, and the burdens are measured and reduced year by year"],
      ["Those affected help design the solutions together with us"],
    ],
  },
  "soc-found": {
    theme: "Social foundation",
    question: "How do you ensure that people in the value chain have what they need for a dignified life?",
    guidance: [
      "The social foundation (from Doughnut Economics) includes income, health, safety and voice.",
      "A living wage is a wage you can actually live on where you live – often higher than the minimum wage.",
    ],
    options: [
      ["We don't know the situation in the value chain"],
      ["We follow laws and collective agreements in our own business"],
      ["Our own employees have a living wage and secure conditions"],
      ["Living wage, health and safety are secured throughout the value chain"],
      ["We also repair past social or cultural harm", "For example restoring trust, cultural heritage or righting wrongs"],
    ],
  },
  "soc-commons": {
    theme: "Commons",
    question: "Who benefits from the business beyond its customers?",
    guidance: [
      "Commons are things everyone can enjoy, such as clean water, meeting places or open knowledge.",
      "Capacity means people become more independent – not more dependent on you.",
    ],
    options: [
      ["Mainly just the customers"],
      ["We give something back through sponsorship or donations"],
      ["We contribute to some local commons"],
      ["We solve a critical societal need also for people who will never be customers"],
      ["We build the capacity and independence of local communities and employees"],
    ],
  },
  "soc-power": {
    theme: "Influence and power",
    question: "Who has real influence on the business's most important decisions?",
    guidance: [
      "Think about who actually sits at the table when major decisions are made.",
      "Future generations cannot vote today – the question is whether someone is formally tasked with representing them.",
    ],
    options: [
      ["The owners alone"],
      ["Management, who listen to employees and customers"],
      ["Employees are formally represented"],
      ["Affected parties and local communities sit at the decision table"],
      ["Future generations' interests are formally anchored in governance"],
    ],
  },
  "econ-ext": {
    theme: "True costs",
    question: "If you had to pay for the biggest harm the model causes others, what would happen?",
    guidance: [
      "A negative externality is a cost paid by nature, society or future generations.",
      "Imagine all hidden costs were added to the bill (“true pricing”).",
    ],
    options: [
      ["The model would not survive"],
      ["It would be very difficult"],
      ["It would require major changes, but is possible"],
      ["The model is profitable even with all costs included"],
      ["Our prices already cover all the costs"],
    ],
  },
  "econ-codes": {
    theme: "Unintended harm",
    question: "How do you keep track of value the business model destroys or weakens?",
    guidance: [
      "This is the “Value Co-Destructions” box in the Flourishing Business Canvas.",
      "An honest overview includes the uncomfortable sides as well.",
    ],
    options: [
      ["We have not looked at this"],
      ["We have a partial or informal overview"],
      ["Management has mapped it honestly"],
      ["The board has reviewed it, and it is followed up with targets"],
      ["We report openly on it and follow up together with those affected"],
    ],
  },
  "econ-fin": {
    theme: "Funding of measures",
    question: "How is the work to reduce harm and repair nature and society funded?",
    guidance: [
      "This is about where the money comes from, and how permanent it is.",
      "Donations, sponsorship and separate CSR budgets are different from the core business.",
    ],
    options: [
      ["It is not funded"],
      ["Through donations or sponsorship"],
      ["Through project budgets from year to year"],
      ["Through fixed budget lines and management KPIs"],
      ["It is built into the cost of every product or service"],
    ],
  },
  "econ-growth": {
    theme: "Growth and impact",
    question: "What happens to the impact on nature and society when revenue grows?",
    guidance: ["Think about what one extra product sold or one extra customer means for nature and society."],
    options: [
      ["Harm grows in step with sales"],
      ["Harm grows, but more slowly than sales"],
      ["Harm per unit goes down"],
      ["The positive effect grows in step with sales"],
      ["The positive effect grows faster than sales"],
    ],
  },
  "econ-own": {
    theme: "Distribution and ownership",
    question: "How is the value created distributed, and who controls the company?",
    guidance: [
      "Think about where the profit ends up – locally or with distant owners.",
      "Steward ownership means the company cannot be sold for speculation; capital serves the purpose.",
    ],
    options: [
      ["Profit goes mainly to passive owners"],
      ["Ordinary distribution between owners and employees"],
      ["Employees or local communities receive a clear share"],
      ["Value is distributed fairly to all parts and builds local capital"],
      ["Purpose formally overrides returns, for example through steward ownership"],
    ],
  },
};

export const STOP_WARNINGS_EN: Record<Flag, string> = {
  fossilCore: "The core business relies on fossil extraction or destruction of nature – the level is capped at 2.",
  noBaseline: "There are no measurements of impact – the level cannot exceed 3.",
  offsetOnly: "Net zero is reached mainly through offsetting – the level is capped at 4.",
  coDestructionUnknown: "Red flag: Unintended harm (Value Co-Destructions) is not mapped – blocks everything above level 4.",
};

export const LEVELS_EN: Record<number, { name: string; short: string; definition: string; practice: string }> = {
  1: { name: "Degenerative", short: "Actively destructive", definition: "The business degrades nature and society as part of its core.", practice: "Profitability relies on others paying the bill. The first step is to acknowledge and stop." },
  2: { name: "Harmful / Unaware", short: "Unknown harm", definition: "Basic minimum requirements are met, but harm is unknown or ignored.", practice: "Free of a fossil core and gross violations, but without an overview of its own impact." },
  3: { name: "Compliant / Aware", short: "Mapped", definition: "Impact is mapped and regulations are followed.", practice: "You know where harm occurs – the first prerequisite for reducing it." },
  4: { name: "Less bad", short: "Relative improvement", definition: "Measured reduction of harm over time, but still net negative.", practice: "Efficiency and harm reduction are anchored in budgets and KPIs." },
  5: { name: "Neutral / Break-even", short: "The line", definition: "Within a fair share of planetary boundaries and above the social foundation – without offsets.", practice: "No net harm in any of the three layers. The watershed between harm and contribution." },
  6: { name: "Restorative", short: "Own chain", definition: "Restores more than its own value chain has consumed.", practice: "Restoration is a production cost – not sponsorship." },
  7: { name: "Systemic", short: "Beyond own chain", definition: "Helps bring planetary boundaries and commons back into the safe zone outside its own chain.", practice: "Positive impact grows with revenue and also benefits non-customers." },
  8: { name: "Regenerative", short: "Ecosystem capacity", definition: "Increases the regenerative capacity of ecosystems and communities.", practice: "Repairs the small water cycle, builds soil and local autonomy." },
  9: { name: "Co-evolutionary", short: "Living system", definition: "Nature and future generations have a formal voice; capital serves the purpose.", practice: "Steward ownership and governance that adapts to ecological feedback." },
};

export const ROBERT_STOP_EN = [
  "Stop systematic accumulation of substances from the Earth's crust (fossil fuels, metals).",
  "Stop systematic accumulation of human-made substances in nature.",
  "Stop systematic physical degradation of nature.",
  "Stop structural obstacles to people's health, influence, competence, impartiality and meaning.",
];

export const NATURE_START_EN = [
  "Local first – use local resources and relationships.",
  "Low energy – design for minimal energy use.",
  "No waste – all waste is food for something else.",
  "Distributed intelligence – distribute power and decisions.",
];
