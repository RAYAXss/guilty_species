import { describe, expect, it } from "vitest";
import { CHARACTER_CATALOG } from "../characters/catalog";
import { solve } from "../solver/solve";
import { lessonPuzzle, nextLessonId, TUTORIAL_LESSONS } from "./tutorial";

describe("tutorial lessons", () => {
  it.each(TUTORIAL_LESSONS.map((l) => l.id))("%s has one solution, the one its steps conclude", (id) => {
    const lesson = TUTORIAL_LESSONS.find((l) => l.id === id)!;
    const solutions = solve(lessonPuzzle(id));
    expect(solutions).toHaveLength(1);
    expect(solutions[0]!.culpritIds).toEqual(lesson.culpritIds);
  });

  it("only names and highlights characters of the lesson", () => {
    for (const lesson of TUTORIAL_LESSONS) {
      const cast = lesson.puzzle.characterIds;
      for (const step of lesson.steps) {
        for (const id of step.focusIds) expect(cast).toContain(id);
        for (const c of CHARACTER_CATALOG) {
          if (new RegExp(`\\b${c.name}\\b`).test(step.text)) expect(cast).toContain(c.id);
        }
      }
    }
  });

  it("teaches stat clues at least once", () => {
    expect(JSON.stringify(TUTORIAL_LESSONS)).toContain("culpritStat");
  });

  it("chains lessons and ends after the last one", () => {
    expect(nextLessonId(TUTORIAL_LESSONS[0]!.id)).toBe(TUTORIAL_LESSONS[1]!.id);
    expect(nextLessonId(TUTORIAL_LESSONS[TUTORIAL_LESSONS.length - 1]!.id)).toBeNull();
  });
});
