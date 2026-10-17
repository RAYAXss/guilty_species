import { describe, expect, it } from "vitest";
import { CHARACTER_CATALOG } from "../characters/catalog";
import { REGION_IDS, adjacentRegions, areNeighbors, neighborsOf, type RegionId } from "./fantolia";

describe("Fantolia", () => {
  it("has symmetric borders and no region next to itself", () => {
    for (const a of REGION_IDS) {
      expect(areNeighbors(a, a)).toBe(false);
      for (const b of adjacentRegions(a)) expect(areNeighbors(b, a)).toBe(true);
    }
  });

  it("connects every region to the rest of the map", () => {
    const seen = new Set<RegionId>([REGION_IDS[0]]);
    const queue: RegionId[] = [REGION_IDS[0]];
    while (queue.length) {
      for (const next of adjacentRegions(queue.shift()!)) {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    expect(seen.size).toBe(REGION_IDS.length);
  });

  it("puts every catalog character in a known region", () => {
    for (const c of CHARACTER_CATALOG) expect(REGION_IDS).toContain(c.region);
  });

  it("neighbors live in bordering regions, never in the same one", () => {
    const elara = CHARACTER_CATALOG.find((c) => c.id === "elara")!;
    const neighbors = neighborsOf(CHARACTER_CATALOG, "elara");
    expect(neighbors.length).toBeGreaterThan(0);
    for (const n of neighbors) {
      expect(n.region).not.toBe(elara.region);
      expect(areNeighbors(elara.region, n.region)).toBe(true);
    }
  });
});
