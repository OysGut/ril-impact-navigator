import { describe, expect, it } from "vitest";
import { isEstablished } from "./brreg";

describe("isEstablished", () => {
  const now = new Date("2026-10-23");
  it("company registered more than one year ago is established", () => {
    expect(isEstablished("2025-10-01", now)).toBe(true);
  });
  it("company registered less than one year ago is a startup", () => {
    expect(isEstablished("2026-01-15", now)).toBe(false);
  });
  it("missing date counts as startup", () => {
    expect(isEstablished(null, now)).toBe(false);
  });
});
