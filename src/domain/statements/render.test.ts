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

  it("renders stat thresholds, with « Aucun » for the plural negation", () => {
    const p = { type: "culpritStatAtLeast", stat: "strength", value: 6, expected: true } as const;
    expect(renderStatement(p, chars)).toBe("Le coupable a 6 ou plus en force.");
    expect(renderStatement({ ...p, expected: false }, chars)).toBe("Le coupable a moins de 6 en force.");
    expect(renderStatement(p, chars, { multiCulprit: true })).toBe("Au moins un coupable a 6 ou plus en force.");
    expect(renderStatement({ ...p, expected: false }, chars, { multiCulprit: true })).toBe("Aucun coupable n'a 6 ou plus en force.");
  });

  it("renders stat comparisons, in the first person about oneself", () => {
    const p = { type: "culpritStatAbove", stat: "intelligence", characterId: "gorak", expected: true } as const;
    expect(renderStatement(p, chars, { speakerId: "elara" })).toBe("Le coupable est plus intelligent que Gorak.");
    expect(renderStatement(p, chars, { speakerId: "gorak" })).toBe("Le coupable est plus intelligent que moi.");
    expect(renderStatement({ ...p, stat: "strength", expected: false }, chars)).toBe("Le coupable n'est pas plus fort que Gorak.");
    expect(renderStatement({ ...p, characterId: "elara" }, chars)).toBe("Le coupable est plus intelligent qu'Elara.");
    expect(renderStatement({ ...p, expected: false }, chars, { multiCulprit: true })).toBe("Aucun coupable n'est plus intelligent que Gorak.");
  });

  it("keeps composite clues readable", () => {
    const text = renderStatement(
      { type: "or", operands: [{ type: "culpritStatAbove", stat: "strength", characterId: "gorak", expected: true }, { type: "characterTruth", characterId: "mira", expected: false }] },
      chars,
      { speakerId: "elara" },
    );
    expect(text).toBe("Le coupable est plus fort que Gorak, ou Mira ment.");
  });

  it("speaks in the first person when the speaker accuses or clears themselves", () => {
    const self = { type: "culpritIs", characterId: "gorak", expected: true } as const;
    expect(renderStatement(self, chars, { speakerId: "gorak" })).toBe("Je suis coupable.");
    expect(renderStatement({ ...self, expected: false }, chars, { speakerId: "gorak", multiCulprit: true })).toBe("Je ne suis pas coupable.");
    expect(renderStatement(self, chars, { speakerId: "elara" })).toBe("Le coupable est Gorak.");
    expect(
      renderStatement({ type: "or", operands: [{ type: "characterTruth", characterId: "mira", expected: false }, self] }, chars, { speakerId: "gorak" }),
    ).toBe("Mira ment, ou je suis coupable.");
  });

  it("renders the new rules", () => {
    expect(renderRule({ type: "liarCount", count: 1 })).toBe("Exactement 1 personnage ment.");
    expect(renderRule({ type: "truthCountOneOf", counts: [2, 1] })).toBe("1 ou 2 personnages disent la vérité.");
    expect(renderRule({ type: "liarCountOneOf", counts: [3, 2] })).toBe("2 ou 3 personnages mentent.");
    expect(renderRule({ type: "culpritCount", counts: [2] })).toBe("Il y a 2 coupables.");
    expect(renderRule({ type: "culpritCount", counts: [1, 2] })).toBe("Il y a 1 ou 2 coupables.");
  });
});
