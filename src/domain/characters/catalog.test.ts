import { describe, expect, it } from "vitest";
import { CHARACTER_CATALOG } from "./catalog";
import { STAT_MAX, STAT_MIN, STATS } from "./types";

describe("character catalog", () => {
  it("gives every character integer stats between 1 and 10", () => {
    for (const c of CHARACTER_CATALOG) {
      for (const stat of STATS) {
        expect(Number.isInteger(c[stat])).toBe(true);
        expect(c[stat]).toBeGreaterThanOrEqual(STAT_MIN);
        expect(c[stat]).toBeLessThanOrEqual(STAT_MAX);
      }
    }
  });
});
