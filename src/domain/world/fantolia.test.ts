import { describe, expect, it } from "vitest";
import { REGION_IDS, adjacentRegions, neighborsOf } from "./fantolia";
import { evaluatePredicate } from "../statements/predicate";
import { renderStatement } from "../statements/render";
import type { Character } from "../characters/types";

const chars: Character[] = [
  { id: "elara", name: "Elara", species: "elfe", alignment: "pacifiste", region: "foret", weight: 5 },
  { id: "aldric", name: "Aldric", species: "humain", alignment: "belliqueux", region: "montagnes", weight: 5 },
  { id: "gorak", name: "Gorak", species: "orc", alignment: "belliqueux", region: "desert", weight: 3 },
];

describe("fantolia adjacency", () => {
  it("is symmetric", () => {
    for (const region of REGION_IDS) {
      for (const neighbor of adjacentRegions(region)) {
        expect(adjacentRegions(neighbor)).toContain(region);
      }
    }
  });
});

describe("culpritNeighborOf predicate", () => {
  it("is true when culprit lives in a bordering region", () => {
    // foret borders montagnes, so aldric (montagnes) is a neighbor of elara (foret)
    const result = evaluatePredicate(
      { type: "culpritNeighborOf", characterId: "elara", expected: true },
      chars,
      { culpritIds: ["aldric"], assignments: { elara: true, aldric: false, gorak: true } },
    );
    expect(result).toBe(true);
  });

  it("is false when culprit lives in a non-bordering region", () => {
    // foret does not border desert, so gorak (desert) is not a neighbor of elara (foret)
    const result = evaluatePredicate(
      { type: "culpritNeighborOf", characterId: "elara", expected: true },
      chars,
      { culpritIds: ["gorak"], assignments: { elara: true, aldric: true, gorak: false } },
    );
    expect(result).toBe(false);
  });
});

describe("neighbor rendering", () => {
  it("uses 'un voisin d'Elara' for another speaker", () => {
    const text = renderStatement(
      { type: "culpritNeighborOf", characterId: "elara", expected: true },
      chars,
      "aldric",
    );
    expect(text).toBe("Un voisin d'Elara est coupable.");
  });

  it("uses 'un de mes voisins' when the speaker is the subject", () => {
    const text = renderStatement(
      { type: "culpritNeighborOf", characterId: "elara", expected: true },
      chars,
      "elara",
    );
    expect(text).toBe("Un de mes voisins est coupable.");
  });
});
