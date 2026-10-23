import { describe, expect, it } from "vitest";
import { calculateInsight, calculateRIL, INSIGHT, QUESTIONS, UNKNOWN, type AnswerEntry } from "./ril";

/** Answer every question in a domain with the given maturity. */
function answers(levels: Partial<Record<string, number>>, verified = true, overrides: Record<string, number> = {}) {
  const a: Record<string, AnswerEntry> = {};
  for (const q of QUESTIONS) {
    const m = overrides[q.id] ?? levels[q.domain] ?? 4;
    a[q.id] = { optionId: q.options[m]!.id, verified };
  }
  return a;
}

describe("calculateRIL", () => {
  it("all top answers, documented, gives level 9", () => {
    expect(calculateRIL(answers({}), false).total).toBe(9);
  });

  it("total is the weakest layer – no compensation", () => {
    const r = calculateRIL(answers({ society: 2 }), false);
    expect(r.domains.ecology).toBe(9);
    expect(r.total).toBe(r.domains.society);
    expect(r.bottleneck).toBe("society");
  });

  it("ecology level 5 requires measured trend within limits (trend ≥ 3)", () => {
    const at5 = answers({}, true, { "eco-restore": 0, "eco-trend": 3 });
    expect(calculateRIL(at5, false).domains.ecology).toBe(5);
    const below = answers({}, true, { "eco-restore": 0, "eco-trend": 2 });
    expect(calculateRIL(below, false).domains.ecology).toBe(4);
  });

  it("fossil core caps at 2, no baseline at 3, offsets at 4, unknown co-destructions at 4", () => {
    expect(calculateRIL(answers({}, true, { "eco-core": 0 }), false).total).toBeLessThanOrEqual(2);
    expect(calculateRIL(answers({ society: 4, economy: 4 }, true, { "eco-know": 1 }), false).ceiling).toBe(3);
    expect(calculateRIL(answers({}, true, { "eco-trend": 1 }), false).ceiling).toBe(4);
    expect(calculateRIL(answers({}, true, { "econ-codes": 1 }), false).ceiling).toBe(4);
  });

  it("«Vet ikke» counts as lowest maturity", () => {
    const a = answers({});
    a["soc-rights"] = { optionId: UNKNOWN, verified: false };
    expect(calculateRIL(a, false).domains.society).toBe(1);
  });

  it("established ventures: undocumented high answers count one step lower", () => {
    expect(calculateRIL(answers({}, false), false).total).toBeLessThan(9);
    expect(calculateRIL(answers({}, false), true).total).toBe(9);
  });

  it("startups get an asterisk", () => {
    expect(calculateRIL(answers({}), true).label).toBe("RIL 9*");
  });
});

describe("calculateInsight", () => {
  it("«Vet ikke» on everything and unanswered = 0 %", () => {
    const a: Record<string, AnswerEntry> = {};
    for (const q of QUESTIONS) a[q.id] = { optionId: UNKNOWN, verified: false };
    expect(calculateInsight(a).total).toBe(0);
    expect(calculateInsight({}).total).toBe(0);
  });
  it("admitting a fossil core shows high insight despite maturity 0", () => {
    const r = calculateInsight({ "eco-core": { optionId: "eco-core-0", verified: false } });
    expect(INSIGHT["eco-core"][0]).toBe(4);
    expect(r.weak.ecology.some((w) => w.id === "eco-core")).toBe(false);
  });
  it("«Vi har ikke sett på dette» is listed as low insight", () => {
    const r = calculateInsight({ "eco-know": { optionId: "eco-know-0", verified: false } });
    expect(r.weak.ecology.find((w) => w.id === "eco-know")?.reason).toBe("Lav innsikt");
  });
  it("documentation does not change insight", () => {
    expect(calculateInsight(answers({}, true)).total).toBe(calculateInsight(answers({}, false)).total);
  });
  it("every question has an insight value for each option", () => {
    for (const q of QUESTIONS) expect(INSIGHT[q.id]).toHaveLength(q.options.length);
  });
});
