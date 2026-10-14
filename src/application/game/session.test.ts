import { describe, expect, it } from "vitest";
import { gameReducer, initialState, nextDifficulty, type GameState } from "./session";

const started = (over: Partial<GameState> = {}): GameState =>
  gameReducer({ ...initialState, ...over }, { type: "start", seed: 7 });

const innocentOf = (s: GameState) => s.round!.puzzle.characters.find((c) => c.id !== s.round!.culpritId)!.id;
const innocents = (s: GameState) => s.round!.puzzle.characters.filter((c) => c.id !== s.round!.culpritId).map((c) => c.id);

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
    expect(at("expert", 99)).toBe(8);
  });

  it("re-clamps the count when the difficulty changes", () => {
    const s = gameReducer({ ...initialState, difficulty: "expert", characterCount: 8 }, { type: "setDifficulty", difficulty: "facile" });
    expect(s.characterCount).toBe(4);
  });

  it("win: returns to menu with the next difficulty", () => {
    let s = started();
    s = gameReducer(s, { type: "accuse", characterId: s.round!.culpritId });
    expect(s.feedback?.kind).toBe("won");
    s = gameReducer(s, { type: "dismissFeedback" });
    expect(s).toMatchObject({ screen: "menu", difficulty: "normal", lastResult: "won" });
  });

  it("first mistake: one retry, the accused is marked innocent", () => {
    let s = started();
    const wrong = innocentOf(s);
    s = gameReducer(s, { type: "accuse", characterId: wrong });
    expect(s.feedback).toEqual({ kind: "retry", accusedId: wrong });
    expect(s.round?.attemptsLeft).toBe(1);
    s = gameReducer(s, { type: "dismissFeedback" });
    expect(s.screen).toBe("playing");
    // an already-eliminated character cannot be accused again
    expect(gameReducer(s, { type: "accuse", characterId: wrong })).toBe(s);
  });

  it("retry can still win", () => {
    let s = started();
    s = gameReducer(s, { type: "accuse", characterId: innocentOf(s) });
    s = gameReducer(s, { type: "dismissFeedback" });
    s = gameReducer(s, { type: "accuse", characterId: s.round!.culpritId });
    expect(s.feedback?.kind).toBe("won");
  });

  it("second mistake: round lost, back to menu at the same difficulty", () => {
    let s = started({ difficulty: "difficile" });
    const [a, b] = innocents(s);
    s = gameReducer(s, { type: "accuse", characterId: a! });
    s = gameReducer(s, { type: "dismissFeedback" });
    s = gameReducer(s, { type: "accuse", characterId: b! });
    expect(s.feedback?.kind).toBe("lost");
    s = gameReducer(s, { type: "dismissFeedback" });
    expect(s).toMatchObject({ screen: "menu", difficulty: "difficile", lastResult: "lost" });
  });

  it("ignores accusations while a feedback is displayed", () => {
    let s = started();
    s = gameReducer(s, { type: "accuse", characterId: innocentOf(s) });
    expect(gameReducer(s, { type: "accuse", characterId: s.round!.culpritId })).toBe(s);
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
