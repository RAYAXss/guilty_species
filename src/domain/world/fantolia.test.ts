import { describe, expect, it } from "vitest";
import { REGION_IDS, adjacentRegions } from "./fantolia";

describe("fantolia adjacency", () => {
  it("is symmetric", () => {
    for (const region of REGION_IDS) {
      for (const neighbor of adjacentRegions(region)) {
        expect(adjacentRegions(neighbor)).toContain(region);
      }
    }
  });
});
