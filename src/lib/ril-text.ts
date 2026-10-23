import type { Lang } from "./i18n";
import { DOMAINS, LEVELS, NATURE_START, ROBERT_STOP, type Domain, type Flag, type Question, STOP_TRIGGERS } from "./ril";
import { LEVELS_EN, NATURE_START_EN, QUESTIONS_EN, ROBERT_STOP_EN, STOP_WARNINGS_EN } from "./ril.en";

export function questionText(q: Question, lang: Lang) {
  const en = lang === "en" ? QUESTIONS_EN[q.id] : undefined;
  return {
    theme: en?.theme ?? q.theme,
    question: en?.question ?? q.question,
    guidance: en?.guidance ?? q.guidance,
    option: (i: number) => ({
      label: en?.options[i]?.[0] ?? q.options[i]!.label,
      hint: en ? en.options[i]?.[1] : q.options[i]!.hint,
    }),
  };
}

export function levelText(level: number, lang: Lang) {
  const base = LEVELS[level - 1]!;
  return lang === "en" ? { ...base, ...LEVELS_EN[level]! } : base;
}

export const warningText = (flag: Flag, lang: Lang) =>
  lang === "en" ? STOP_WARNINGS_EN[flag] : STOP_TRIGGERS.find((s) => s.id === flag)!.warning;

const DOMAIN_EN: Record<Domain, string> = { ecology: "Ecology", society: "Society", economy: "Economy" };
export const domainLabel = (d: Domain, lang: Lang) => (lang === "en" ? DOMAIN_EN[d] : DOMAINS.find((x) => x.id === d)!.label);

export const stopList = (lang: Lang) => (lang === "en" ? ROBERT_STOP_EN : ROBERT_STOP);
export const startList = (lang: Lang) => (lang === "en" ? NATURE_START_EN : NATURE_START);
