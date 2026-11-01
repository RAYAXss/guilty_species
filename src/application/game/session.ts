import { clampCharacterCount } from "../../domain/generator/difficulty";
import { generatePuzzle } from "../../domain/generator/generate";
import { culpritCountsOf } from "../../domain/rules/rule";
import type { Difficulty, Puzzle } from "../../domain/puzzle/types";

export const DIFFICULTY_ORDER: readonly Difficulty[] = ["facile", "normal", "difficile", "expert"];
export const MAX_ATTEMPTS = 2;

export function nextDifficulty(d: Difficulty): Difficulty {
  const i = DIFFICULTY_ORDER.indexOf(d);
  return DIFFICULTY_ORDER[Math.min(i + 1, DIFFICULTY_ORDER.length - 1)] as Difficulty;
}

export interface Round {
  puzzle: Puzzle;
  /** Private to the application layer: the UI never reads it. */
  culpritIds: string[];
  attemptsLeft: number;
  /** Characters proven innocent by a wrong accusation. */
  innocentIds: string[];
}

export type Feedback =
  /** `correctCount`: how many of the accused really are culprits (always 0 when there is a single culprit). */
  | { kind: "retry"; accusedIds: string[]; correctCount: number }
  | { kind: "won"; culpritIds: string[] }
  | { kind: "lost"; culpritIds: string[] };

export interface GameState {
  screen: "menu" | "playing";
  difficulty: Difficulty;
  characterCount: number;
  round: Round | null;
  feedback: Feedback | null;
  /** Result of the last finished round, shown on the menu. */
  lastResult: "won" | "lost" | null;
}

export type GameAction =
  | { type: "setCharacterCount"; count: number }
  | { type: "setDifficulty"; difficulty: Difficulty }
  | { type: "start"; seed: number }
  | { type: "accuse"; characterIds: string[] }
  | { type: "dismissFeedback" }
  | { type: "quit" };

export const initialState: GameState = {
  screen: "menu",
  difficulty: "facile",
  characterCount: 4,
  round: null,
  feedback: null,
  lastResult: null,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "setCharacterCount":
      return { ...state, characterCount: clampCharacterCount(state.difficulty, action.count) };

    case "setDifficulty":
      return {
        ...state,
        difficulty: action.difficulty,
        characterCount: clampCharacterCount(action.difficulty, state.characterCount),
        lastResult: null,
      };

    case "start": {
      const { puzzle, solution } = generatePuzzle({
        difficulty: state.difficulty,
        seed: action.seed,
        characterCount: state.characterCount,
      });
      const round: Round = { puzzle, culpritIds: solution.culpritIds, attemptsLeft: MAX_ATTEMPTS, innocentIds: [] };
      return { ...state, screen: "playing", round, feedback: null, lastResult: null };
    }

    case "accuse": {
      const { round } = state;
      if (state.screen !== "playing" || !round || state.feedback) return state;
      const ids = [...new Set(action.characterIds)];
      if (!culpritCountsOf(round.puzzle.rules).includes(ids.length)) return state;
      if (ids.some((id) => round.innocentIds.includes(id) || !round.puzzle.characters.some((c) => c.id === id))) return state;

      const correctCount = ids.filter((id) => round.culpritIds.includes(id)).length;
      if (ids.length === round.culpritIds.length && correctCount === ids.length) {
        return { ...state, feedback: { kind: "won", culpritIds: round.culpritIds } };
      }
      const attemptsLeft = round.attemptsLeft - 1;
      // Accused characters are cleared only when none of them is a culprit.
      const innocentIds = correctCount === 0 ? [...round.innocentIds, ...ids] : round.innocentIds;
      const next: Round = { ...round, attemptsLeft, innocentIds };
      return {
        ...state,
        round: next,
        feedback:
          attemptsLeft > 0
            ? { kind: "retry", accusedIds: ids, correctCount }
            : { kind: "lost", culpritIds: round.culpritIds },
      };
    }

    case "dismissFeedback": {
      const { feedback } = state;
      if (!feedback) return state;
      if (feedback.kind === "retry") return { ...state, feedback: null };
      // Round over: back to the menu. Win => next difficulty, loss => same difficulty.
      const difficulty = feedback.kind === "won" ? nextDifficulty(state.difficulty) : state.difficulty;
      return {
        ...state,
        screen: "menu",
        round: null,
        feedback: null,
        lastResult: feedback.kind,
        difficulty,
        characterCount: clampCharacterCount(difficulty, state.characterCount),
      };
    }

    case "quit":
      return { ...state, screen: "menu", round: null, feedback: null };
  }
}
