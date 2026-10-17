import { describe, expect, it } from "vitest";
import { CHARACTER_CATALOG } from "../characters/catalog";
import { renderRule } from "../rules/rule";
import { renderStatement } from "./render";

describe("statement rendering", () => {
  const chars = CHARACTER_CATALOG;

  it("describes the culprit's temperament without alignment words", () => {
    expect(renderStatement({ type: "culpritAlignment", alignment: "belliqueux", expected: true }, chars)).toBe("Le coupable est d'un tempérament guerrier.");
    expect(renderStatement({ type: "culpritAlignment", alignment: "pacifiste", expected: false }, chars)).toBe("Le coupable n'est pas d'un naturel paisible.");
  });

  it("switches to plural phrasing when several culprits are possible", () => {
    const ctx = { multiCulprit: true };
    expect(renderStatement({ type: "culpritIs", characterId: "gorak", expected: true }, chars, ctx)).toBe("Gorak est coupable.");
    expect(renderStatement({ type: "culpritAlignment", alignment: "vengeur", expected: false }, chars, ctx)).toBe("Aucun coupable n'est animé par la vengeance.");
  });

  it("speaks in the first person about one's own neighbors", () => {
    const p = { type: "culpritNeighborOf", characterId: "elara", expected: true } as const;
    expect(renderStatement(p, chars, { speakerId: "elara" })).toBe("Un de mes voisins est coupable.");
    expect(renderStatement(p, chars, { speakerId: "gorak" })).toBe("Un voisin de Elara est coupable.");
  });

  it("keeps composite clues readable", () => {
    const text = renderStatement(
      { type: "or", operands: [{ type: "culpritNeighborOf", characterId: "gorak", expected: true }, { type: "characterTruth", characterId: "mira", expected: false }] },
      chars,
      { speakerId: "elara" },
    );
    expect(text).toBe("Un voisin de Gorak est coupable, ou Mira ment.");
  });

  it("renders the new rules", () => {
    expect(renderRule({ type: "liarCount", count: 1 })).toBe("Exactement 1 personnage ment.");
    expect(renderRule({ type: "truthCountOneOf", counts: [2, 1] })).toBe("1 ou 2 personnages disent la vérité.");
    expect(renderRule({ type: "liarCountOneOf", counts: [3, 2] })).toBe("2 ou 3 personnages mentent.");
    expect(renderRule({ type: "culpritCount", counts: [2] })).toBe("Il y a 2 coupables.");
    expect(renderRule({ type: "culpritCount", counts: [1, 2] })).toBe("Il y a 1 ou 2 coupables.");
  });
});
