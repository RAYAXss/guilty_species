import { useCallback, useEffect, useReducer } from "react";
import { gameReducer, initialState } from "../../application/game/session";
import { LEVELS } from "../../domain/campaign/campaign";
import type { Difficulty } from "../../domain/puzzle/types";
import { loadProgress, saveProgress } from "../../infrastructure/persistence/campaignStorage";
import { randomSeed } from "../../infrastructure/random/seed";

/** Thin bridge between React and the application layer: no game logic here. */
export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState, (s) => ({
    ...s,
    progress: loadProgress(LEVELS.map((l) => l.id)),
  }));

  useEffect(() => saveProgress(state.progress), [state.progress]);

  return {
    state,
    setCharacterCount: useCallback((count: number) => dispatch({ type: "setCharacterCount", count }), []),
    setDifficulty: useCallback((difficulty: Difficulty) => dispatch({ type: "setDifficulty", difficulty }), []),
    start: useCallback(() => dispatch({ type: "start", seed: randomSeed() }), []),
    openCampaign: useCallback(() => dispatch({ type: "openCampaign" }), []),
    openMenu: useCallback(() => dispatch({ type: "openMenu" }), []),
    startLevel: useCallback((levelId: string) => dispatch({ type: "startLevel", levelId }), []),
    accuse: useCallback((characterIds: string[]) => dispatch({ type: "accuse", characterIds }), []),
    dismissFeedback: useCallback(() => dispatch({ type: "dismissFeedback" }), []),
    quit: useCallback(() => dispatch({ type: "quit" }), []),
  };
}
