import { describe, expect, it } from "vitest";
import { calculateRIL, emptyStops, QUESTIONS, type AnswerEntry } from "./ril";

const upTo = (levels: Record<string, number>, verified = true) => {
  const a: Record<string, AnswerEntry> = {};
  for (const q of QUESTIONS) if (q.level <= (levels[q.domain] ?? 0)) a[q.id] = { answer: "yes", verified };
  return a;
};

describe("calculateRIL", () => {
  it("total is the weakest layer (no compensation)", () => {
    const r = calculateRIL(upTo({ ecology: 4, society: 8, economy: 9 }), false, emptyStops());
    expect(r.total).toBe(4);
    expect(r.bottleneck).toBe("ecology");
  });
  it("established ventures need verified answers", () => {
    expect(calculateRIL(upTo({ ecology: 9, society: 9, economy: 9 }, false), false, emptyStops()).total).toBe(1);
  });
  it("startups score on potential with asterisk", () => {
    const r = calculateRIL(upTo({ ecology: 6, society: 6, economy: 6 }, false), true, emptyStops());
    expect(r.label).toBe("RIL 6*");
  });
  it("fossil dependency caps at 2, no baseline at 3, offset-only at 4", () => {
    const all = upTo({ ecology: 9, society: 9, economy: 9 });
    expect(calculateRIL(all, false, { ...emptyStops(), fossil: true }).total).toBe(2);
    expect(calculateRIL(all, false, { ...emptyStops(), noBaseline: true }).total).toBe(3);
    expect(calculateRIL(all, false, { ...emptyStops(), offsetOnly: true }).total).toBe(4);
    expect(calculateRIL(all, false, { ...emptyStops(), coDestructionUnknown: true }).total).toBe(4);
  });
});
