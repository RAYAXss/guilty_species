import { describe, expect, it } from "vitest";
import { createRng } from "./rng";
import { weightedSample } from "./weighted";

const items = [
  { id: "a", weight: 5 },
  { id: "b", weight: 1 },
  { id: "zero", weight: 0 },
  { id: "c", weight: 3 },
];

describe("createRng", () => {
  it("is deterministic for a given seed", () => {
    const a = createRng(42);
    const b = createRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it("differs across seeds", () => {
    expect(createRng(1)()).not.toBe(createRng(2)());
  });
});

describe("weightedSample", () => {
  it("never selects weight 0", () => {
    for (let seed = 0; seed < 200; seed++) {
      const ids = weightedSample(createRng(seed), items, 3).map((i) => i.id);
      expect(ids).not.toContain("zero");
      expect(new Set(ids).size).toBe(3);
    }
  });
  it("rejects negative or non-finite weights", () => {
    expect(() => weightedSample(createRng(1), [{ weight: -1 }], 1)).toThrow();
    expect(() => weightedSample(createRng(1), [{ weight: NaN }], 1)).toThrow();
  });
  it("throws when not enough positive-weight items", () => {
    expect(() => weightedSample(createRng(1), items, 4)).toThrow();
  });
  it("favours heavier items", () => {
    const rng = createRng(7);
    let heavy = 0;
    for (let i = 0; i < 2000; i++) if (weightedSample(rng, items, 1)[0]?.id === "a") heavy++;
    expect(heavy / 2000).toBeGreaterThan(0.45); // expected ~5/9
  });
});
