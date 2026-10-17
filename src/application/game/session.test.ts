import { describe, expect, it } from "vitest";
import { gameReducer, initialState, nextDifficulty, type GameState } from "./session";

const started = (over: Partial<GameState> = {}): GameState =>
  gameReducer({ ...initialState, ...over }, { type: "start", seed: 7 });

const innocents = (s: GameState) => s.round!.puzzle.characters.filter((c) => !s.round!.culpritIds.includes(c.id)).map((c) => c.id);
const innocentOf = (s: GameState) => innocents(s)[0]!;
const accuse = (s: GameState, ...characterIds: string[]) => gameReducer(s, { type: "accuse", characterIds });

describe("game session", () => {
  it("starts a round with the chosen number of characters and 2 attempts", () => {
    const s = started({ difficulty: "difficile", characterCount: 6 });
    expect(s.screen).toBe("playing");
    expect(s.round?.puzzle.characters).toHaveLength(6);
    expect(s.round?.attemptsLeft).toBe(2);
  });

  it("keeps the character count inside the difficulty range", () => {
    const at = (difficulty: GameState["difficulty"], count: number) =>
      gameReducer({ ...initialState, difficulty }, { type: "setCharacterCount", count }).characterCount;
    expect(at("facile", 8)).toBe(4);
    expect(at("facile", 0)).toBe(3);
    expect(at("expert", 3)).toBe(6);
    expect(at("expert", 99)).toBe(9);
  });

  it("re-clamps the count when the difficulty changes", () => {
    const s = gameReducer({ ...initialState, difficulty: "expert", characterCount: 9 }, { type: "setDifficulty", difficulty: "facile" });
    expect(s.characterCount).toBe(4);
  });

  it("win: returns to menu with the next difficulty", () => {
    let s = started();
    s = accuse(s, ...s.round!.culpritIds);
    expect(s.feedback?.kind).toBe("won");
    s = gameReducer(s, { type: "dismissFeedback" });
    expect(s).toMatchObject({ screen: "menu", difficulty: "normal", lastResult: "won" });
  });

  it("first mistake: one retry, the accused is marked innocent", () => {
    let s = started();
    const wrong = innocentOf(s);
    s = accuse(s, wrong);
    expect(s.feedback).toEqual({ kind: "retry", accusedIds: [wrong], correctCount: 0 });
    expect(s.round?.attemptsLeft).toBe(1);
    s = gameReducer(s, { type: "dismissFeedback" });
    expect(s.screen).toBe("playing");
    // an already-eliminated character cannot be accused again
    expect(accuse(s, wrong)).toBe(s);
  });

  it("retry can still win", () => {
    let s = started();
    s = accuse(s, innocentOf(s));
    s = gameReducer(s, { type: "dismissFeedback" });
    s = accuse(s, ...s.round!.culpritIds);
    expect(s.feedback?.kind).toBe("won");
  });

  it("second mistake: round lost, back to menu at the same difficulty", () => {
    let s = started({ difficulty: "difficile" });
    const [a, b] = innocents(s);
    s = accuse(s, a!);
    s = gameReducer(s, { type: "dismissFeedback" });
    s = accuse(s, b!);
    expect(s.feedback?.kind).toBe("lost");
    s = gameReducer(s, { type: "dismissFeedback" });
    expect(s).toMatchObject({ screen: "menu", difficulty: "difficile", lastResult: "lost" });
  });

  it("ignores accusations while a feedback is displayed", () => {
    let s = started();
    s = accuse(s, innocentOf(s));
    expect(accuse(s, ...s.round!.culpritIds)).toBe(s);
  });

  describe("several culprits (expert)", () => {
    const expertWithCulprits = (): GameState => {
      for (let seed = 1; seed < 200; seed++) {
        const s = gameReducer({ ...initialState, difficulty: "expert", characterCount: 6 }, { type: "start", seed });
        if (s.round!.culpritIds.length === 2) return s;
      }
      throw new Error("no 2-culprit puzzle found");
    };

    it("only accepts a number of suspects allowed by the rule", () => {
      const s = expertWithCulprits();
      const rule = s.round!.puzzle.rules.find((r) => r.type === "culpritCount");
      expect(rule).toBeDefined();
      const [one] = s.round!.culpritIds;
      const exactlyTwo = rule?.type === "culpritCount" && rule.counts.length === 1;
      if (exactlyTwo) expect(accuse(s, one!)).toBe(s);
      expect(accuse(s, ...innocents(s).slice(0, 3))).toBe(s);
    });

    it("wins only with the complete culprit set", () => {
      const s = expertWithCulprits();
      expect(accuse(s, ...s.round!.culpritIds).feedback?.kind).toBe("won");
    });

    it("tells how many accused are right, and clears them only when none is", () => {
      const s = expertWithCulprits();
      const [culprit] = s.round!.culpritIds;
      const half = accuse(s, culprit!, innocentOf(s));
      expect(half.feedback).toMatchObject({ kind: "retry", correctCount: 1 });
      expect(half.round?.innocentIds).toEqual([]);
      const none = accuse(s, ...innocents(s).slice(0, 2));
      expect(none.feedback).toMatchObject({ kind: "retry", correctCount: 0 });
      expect(none.round?.innocentIds).toHaveLength(2);
    });
  });

  it("lets the player pick any difficulty from the menu", () => {
    const s = gameReducer(initialState, { type: "setDifficulty", difficulty: "expert" });
    expect(s.difficulty).toBe("expert");
    expect(gameReducer(s, { type: "start", seed: 3 }).round?.puzzle.difficulty).toBe("expert");
  });

  it("caps difficulty at expert", () => {
    expect(nextDifficulty("expert")).toBe("expert");
  });
});
