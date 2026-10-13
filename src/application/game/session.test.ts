import { describe, expect, it } from "vitest";
import { gameReducer, initialState, nextDifficulty, type GameState } from "./session";

const started = (over: Partial<GameState> = {}): GameState =>
  gameReducer({ ...initialState, ...over }, { type: "start", seed: 7 });

const innocentOf = (s: GameState) => s.round!.puzzle.characters.find((c) => c.id !== s.round!.culpritId)!.id;
const innocents = (s: GameState) => s.round!.puzzle.characters.filter((c) => c.id !== s.round!.culpritId).map((c) => c.id);

describe("game session", () => {
  it("starts a round with the chosen number of characters and 2 attempts", () => {
    const s = started({ characterCount: 6 });
    expect(s.screen).toBe("playing");
    expect(s.round?.puzzle.characters).toHaveLength(6);
    expect(s.round?.attemptsLeft).toBe(2);
  });

  it("clamps the character count", () => {
    expect(gameReducer(initialState, { type: "setCharacterCount", count: 99 }).characterCount).toBe(8);
    expect(gameReducer(initialState, { type: "setCharacterCount", count: 0 }).characterCount).toBe(3);
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

  it("caps difficulty at expert", () => {
    expect(nextDifficulty("expert")).toBe("expert");
  });
});
