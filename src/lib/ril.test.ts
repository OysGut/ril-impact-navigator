import { describe, expect, it } from "vitest";
import { calculateCertainty, calculateRIL, QUESTIONS, UNKNOWN, type AnswerEntry } from "./ril";

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

describe("calculateCertainty", () => {
  it("documented = 100 %, undocumented = 50 %", () => {
    expect(calculateCertainty(answers({}, true), false).total).toBe(100);
    expect(calculateCertainty(answers({}, false), false).total).toBe(50);
  });
  it("«Vet ikke» and unanswered count 0", () => {
    const a: Record<string, AnswerEntry> = {};
    for (const q of QUESTIONS) a[q.id] = { optionId: UNKNOWN, verified: false };
    expect(calculateCertainty(a, false).total).toBe(0);
    expect(calculateCertainty({}, false).total).toBe(0);
  });
  it("startups are capped at 60 %", () => {
    expect(calculateCertainty(answers({}, true), true).total).toBe(60);
  });
  it("startup with only unsubstantiated answers = 30 %", () => {
    expect(calculateCertainty(answers({}, false), true).total).toBe(30);
  });
});
