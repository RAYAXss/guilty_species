import { useCallback, useReducer } from "react";
import { gameReducer, initialState } from "../../application/game/session";
import type { Difficulty } from "../../domain/puzzle/types";
import { randomSeed } from "../../infrastructure/random/seed";

/** Thin bridge between React and the application layer: no game logic here. */
export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return {
    state,
    setCharacterCount: useCallback((count: number) => dispatch({ type: "setCharacterCount", count }), []),
    setDifficulty: useCallback((difficulty: Difficulty) => dispatch({ type: "setDifficulty", difficulty }), []),
    start: useCallback(() => dispatch({ type: "start", seed: randomSeed() }), []),
    accuse: useCallback((characterId: string) => dispatch({ type: "accuse", characterId }), []),
    dismissFeedback: useCallback(() => dispatch({ type: "dismissFeedback" }), []),
    quit: useCallback(() => dispatch({ type: "quit" }), []),
  };
}
