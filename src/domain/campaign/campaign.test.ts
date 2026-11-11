import { describe, expect, it } from "vitest";
import { CHARACTER_CATALOG } from "../characters/catalog";
import { DIFFICULTY_PARAMS } from "../generator/difficulty";
import { culpritCountsOf } from "../rules/rule";
import { solve } from "../solver/solve";
import { areNeighbors } from "../world/fantolia";
import { CHAPTERS, LEVELS, isUnlocked, levelPuzzle, nextLevelId, recordWin } from "./campaign";
import { FROZEN_PUZZLES } from "./frozen-puzzles";

describe("campaign levels", () => {
  it.each(LEVELS.map((l) => l.id))("%s has exactly one solution", (id) => {
    expect(solve(levelPuzzle(id))).toHaveLength(1);
  });

  it("has unique ids, one frozen puzzle per level and no orphan puzzle", () => {
    const ids = LEVELS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(FROZEN_PUZZLES.map((p) => p.id).sort()).toEqual([...ids].sort());
  });

  it("never uses stat clues where the difficulty does not allow them", () => {
    for (const p of FROZEN_PUZZLES) {
      if (DIFFICULTY_PARAMS[p.difficulty].statClues) continue;
      expect(JSON.stringify(p.statements)).not.toContain("culpritStat");
    }
  });

  it("uses « at least one » wording when several culprits are possible", () => {
    for (const level of LEVELS) {
      const puzzle = levelPuzzle(level.id);
      if (!culpritCountsOf(puzzle.rules).some((n) => n > 1)) continue;
      for (const s of puzzle.statements) expect(s.text).not.toMatch(/Le coupable/);
    }
  });

  it("keeps the two-thieves level multi-culprit, and only that one", () => {
    const multi = LEVELS.filter((l) => culpritCountsOf(levelPuzzle(l.id).rules).some((n) => n > 1)).map((l) => l.id);
    expect(multi).toEqual(["ombres-2"]);
  });

    it("only names characters who are actually in the level", () => {
    for (const level of LEVELS) {
      const cast = levelPuzzle(level.id).characters.map((c) => c.id);
      for (const c of CHARACTER_CATALOG) {
        if (new RegExp(`\\b${c.name}\\b`).test(`${level.title} ${level.story}`)) expect(cast).toContain(c.id);
      }
    }
  });

  it("travels across bordering regions, chapter after chapter", () => {
    for (let i = 1; i < CHAPTERS.length; i++) expect(areNeighbors(CHAPTERS[i - 1]!.region, CHAPTERS[i]!.region)).toBe(true);
    for (const level of LEVELS) expect(CHAPTERS.map((c) => c.region)).toContain(level.region);
  });
});

describe("campaign progress", () => {
  const [first, second, third] = LEVELS.map((l) => l.id) as [string, string, string];

  it("opens levels one after the other", () => {
    expect(isUnlocked({}, first)).toBe(true);
    expect(isUnlocked({}, second)).toBe(false);
    const p = recordWin({}, first, 1);
    expect(isUnlocked(p, second)).toBe(true);
    expect(isUnlocked(p, third)).toBe(false);
    expect(isUnlocked(p, "unknown")).toBe(false);
  });

  it("gives 3 stars on the first try, 2 on the second, and keeps the best", () => {
    expect(recordWin({}, first, 2)[first]).toBe(3);
    expect(recordWin({}, first, 1)[first]).toBe(2);
    expect(recordWin({ [first]: 3 }, first, 1)[first]).toBe(3);
  });

  it("chains to the next level and ends after the last one", () => {
    expect(nextLevelId(first)).toBe(second);
    expect(nextLevelId(LEVELS[LEVELS.length - 1]!.id)).toBeNull();
  });
});
