import { thawPuzzle } from "../campaign/campaign";
import type { FrozenPuzzle } from "../campaign/types";
import type { Puzzle } from "../puzzle/types";

export interface TutorialStep {
  text: string;
  /** Cards to highlight while this step is shown. */
  focusIds: string[];
}

export interface TutorialLesson {
  id: string;
  title: string;
  puzzle: FrozenPuzzle;
  /** Guided reasoning, from the rules to the culprit. */
  steps: TutorialStep[];
  /** What the steps conclude; tests check it against the solver. */
  culpritIds: string[];
}

export const TUTORIAL_LESSONS: readonly TutorialLesson[] = [
  {
    id: "contradiction",
    title: "Leçon 1 · La contradiction",
    puzzle: {
      id: "contradiction",
      difficulty: "facile",
      characterIds: ["pip", "elara", "gorak"],
      statements: [
        { characterId: "pip", predicate: { type: "culpritIs", characterId: "gorak", expected: true } },
        { characterId: "elara", predicate: { type: "culpritIs", characterId: "gorak", expected: false } },
        { characterId: "gorak", predicate: { type: "characterTruth", characterId: "pip", expected: true } },
      ],
      rules: [{ type: "liarCount", count: 1 }],
    },
    steps: [
      { text: "Chaque personnage fait une affirmation. La règle en haut dit combien mentent : ici, exactement 1.", focusIds: [] },
      {
        text: "Le symbole en haut à gauche d'une carte montre le tempérament : feuille = pacifiste (« d'un naturel paisible »), épées = belliqueux (« d'un tempérament guerrier »), flamme = vengeur (« animé par la vengeance »). La légende est sous les règles.",
        focusIds: [],
      },
      { text: "Pip dit que le coupable est Gorak, Elara dit le contraire. Ils ne peuvent pas avoir raison tous les deux : l'un des deux ment.", focusIds: ["pip", "elara"] },
      { text: "Il n'y a qu'un seul menteur, et c'est forcément Pip ou Elara. Donc Gorak dit la vérité.", focusIds: ["gorak"] },
      { text: "Gorak dit vrai : Pip dit la vérité. Le menteur est donc Elara.", focusIds: ["gorak", "pip"] },
      { text: "Pip dit vrai : le coupable est Gorak. Touche sa carte, puis Accuser !", focusIds: ["gorak"] },
    ],
    culpritIds: ["gorak"],
  },
  {
    id: "chaine",
    title: "Leçon 2 · Le même camp",
    puzzle: {
      id: "chaine",
      difficulty: "facile",
      characterIds: ["ondine", "thalion", "mira", "brumm"],
      statements: [
        { characterId: "ondine", predicate: { type: "characterTruth", characterId: "thalion", expected: true } },
        { characterId: "thalion", predicate: { type: "culpritIs", characterId: "mira", expected: true } },
        { characterId: "mira", predicate: { type: "culpritIs", characterId: "brumm", expected: true } },
        { characterId: "brumm", predicate: { type: "characterTruth", characterId: "ondine", expected: true } },
      ],
      rules: [{ type: "liarCount", count: 1 }],
    },
    steps: [
      { text: "Quand quelqu'un dit « X dit la vérité », les deux sont dans le même camp : ils disent vrai ensemble, ou mentent ensemble.", focusIds: [] },
      { text: "Brumm soutient Ondine, et Ondine soutient Thalion : ces trois-là sont dans le même camp.", focusIds: ["brumm", "ondine", "thalion"] },
      { text: "S'ils mentaient, il y aurait 3 menteurs. La règle n'en permet qu'un : ils disent donc tous la vérité.", focusIds: ["brumm", "ondine", "thalion"] },
      { text: "Le seul menteur est Mira. Elle accuse Brumm… pour se couvrir ?", focusIds: ["mira"] },
      { text: "Thalion dit vrai : le coupable est Mira. Accuse-la !", focusIds: ["mira"] },
    ],
    culpritIds: ["mira"],
  },
  {
    id: "stats",
    title: "Leçon 3 · Force et Intelligence",
    puzzle: {
      id: "stats",
      difficulty: "normal",
      characterIds: ["pip", "elara", "karn", "gorak"],
      statements: [
        { characterId: "pip", predicate: { type: "culpritStatAtLeast", stat: "strength", value: 5, expected: true } },
        { characterId: "elara", predicate: { type: "culpritStatAbove", stat: "intelligence", characterId: "gorak", expected: true } },
        { characterId: "karn", predicate: { type: "culpritIs", characterId: "pip", expected: true } },
        { characterId: "gorak", predicate: { type: "culpritIs", characterId: "karn", expected: false } },
      ],
      rules: [{ type: "liarCount", count: 1 }],
    },
    steps: [
      { text: "Chaque carte affiche deux stats de 1 à 10 : la Force et l'Intelligence. Certains indices en parlent.", focusIds: [] },
      { text: "Karn accuse Pip, mais Pip n'a que 2 en force. Pip, lui, dit que le coupable a 5 ou plus en force. L'un des deux ment.", focusIds: ["pip", "karn"] },
      { text: "Un seul personnage ment : Elara et Gorak disent donc la vérité.", focusIds: ["elara", "gorak"] },
      { text: "Elara dit vrai : le coupable est plus intelligent que Gorak (4). Il reste Pip (5) et Elara (8).", focusIds: ["pip", "elara"] },
      { text: "Si Pip disait vrai, le coupable aurait aussi 5 ou plus en force. Ni Pip ni Elara n'en ont autant : Pip ment, Karn dit vrai.", focusIds: ["pip", "karn"] },
      { text: "Karn dit vrai : le coupable est Pip. À toi de jouer !", focusIds: ["pip"] },
    ],
    culpritIds: ["pip"],
  },
];

export function findLesson(lessonId: string): TutorialLesson | undefined {
  return TUTORIAL_LESSONS.find((l) => l.id === lessonId);
}

export function lessonPuzzle(lessonId: string): Puzzle {
  const lesson = findLesson(lessonId);
  if (!lesson) throw new Error(`Unknown lesson: ${lessonId}`);
  return thawPuzzle(lesson.puzzle, `tutorial-${lessonId}`);
}

export function nextLessonId(lessonId: string): string | null {
  const i = TUTORIAL_LESSONS.findIndex((l) => l.id === lessonId);
  return TUTORIAL_LESSONS[i + 1]?.id ?? null;
}
