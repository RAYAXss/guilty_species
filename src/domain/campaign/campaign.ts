import { CHARACTER_CATALOG } from "../characters/catalog";
import type { Character } from "../characters/types";
import type { Puzzle } from "../puzzle/types";
import { culpritCountsOf } from "../rules/rule";
import { renderStatement } from "../statements/render";
import { FROZEN_PUZZLES } from "./frozen-puzzles";
import type { CampaignProgress, Chapter, Level } from "./types";

/** The journey follows the borders of Fantolia, from the forest to the Terres d'ombre. */
export const CHAPTERS: readonly Chapter[] = [
  {
    region: "foret",
    title: "I. Le vol du Cœur",
    lore: "Cette nuit, le Cœur de Fantolia, la gemme qui garde les six régions en paix, a disparu de son autel sous le Grand Chêne. Les gardiens font appel à toi, l'enquêteur qui sait écouter les mensonges. La piste commence ici, parmi les clairières.",
  },
  {
    region: "marais",
    title: "II. Les brumes qui mentent",
    lore: "Des éclats du Cœur ont été vus près des eaux mortes. Dans le Marais des brumes, chacun connaît son voisin… et chacun a une raison de le dénoncer.",
  },
  {
    region: "plaines",
    title: "III. La foire des Plaines dorées",
    lore: "La foire bat son plein et un marchand vend des pierres trop brillantes. Les témoins sont nombreux, les rumeurs plus encore.",
  },
  {
    region: "montagnes",
    title: "IV. Le silence des cimes",
    lore: "Les messagers ne redescendent plus des Montagnes glacées. Là-haut, chacun garde un secret, et le froid fait taire les bavards.",
  },
  {
    region: "desert",
    title: "V. Le trésor du dragon",
    lore: "Varek, le vieux dragon, prétend que le Cœur lui revient. Dans le Désert aride, les témoins se taisent dès qu'on parle de trésor.",
  },
  {
    region: "ombres",
    title: "VI. Au bout de la nuit",
    lore: "Toutes les pistes mènent aux Terres d'ombre. Le voleur s'y cache, peut-être avec un complice. Démasque-le, et la paix reviendra sur Fantolia.",
  },
];

export const LEVELS: readonly Level[] = [
  { id: "foret-1", region: "foret", title: "L'autel vide", story: "Trois créatures veillaient près de l'autel. L'une d'elles a emporté le Cœur." },
  { id: "foret-2", region: "foret", title: "Traces dans la mousse", story: "Des empreintes mènent à un campement. Quatre voyageurs y dorment… ou font semblant." },
  { id: "foret-3", region: "foret", title: "Le gardien endormi", story: "Quelqu'un a versé une potion dans la tisane du gardien. Qui tenait la louche ?" },
  { id: "marais-1", region: "marais", title: "Le passeur", story: "Le passeur a fait traverser un voleur cette nuit. Il refuse de dire lequel." },
  { id: "marais-2", region: "marais", title: "Le pont aux crapauds", story: "Un éclat du Cœur a été jeté sous un vieux pont. Les voisins se renvoient la faute." },
  { id: "marais-3", region: "marais", title: "Feux follets", story: "Des lumières ont guidé le voleur dans les brumes. Quelqu'un les a allumées." },
  { id: "plaines-1", region: "plaines", title: "L'étal du marchand", story: "Une pierre volée était exposée à l'étal. Qui l'a déposée là ?" },
  { id: "plaines-2", region: "plaines", title: "La cuisine de Pip", story: "La marmite de Pip cachait un éclat. Pip jure qu'il n'y est pour rien." },
  { id: "plaines-3", region: "plaines", title: "La charrette vers les cimes", story: "Une charrette est partie vers les montagnes avant l'aube. Quelqu'un l'a chargée." },
  { id: "montagnes-1", region: "montagnes", title: "Le col fermé", story: "Le col est fermé depuis le vol. Pourtant, quelqu'un l'a franchi cette nuit." },
  { id: "montagnes-2", region: "montagnes", title: "Le témoin muet", story: "Une sentinelle a vu passer le voleur mais refuse de parler. Les autres témoins, eux, parlent trop." },
  { id: "montagnes-3", region: "montagnes", title: "L'avalanche", story: "Une avalanche a coupé la route du désert. Elle n'était pas naturelle." },
  { id: "desert-1", region: "desert", title: "La forge abandonnée", story: "On a forgé un coffret à la taille exacte du Cœur. Pour qui ?" },
  { id: "desert-2", region: "desert", title: "Les dunes chantantes", story: "Le vent a effacé les traces. Il ne reste que les paroles des témoins." },
  { id: "desert-3", region: "desert", title: "Le marché sous la lune", story: "Un marché s'est conclu sous la lune. L'acheteur se cache parmi les témoins." },
  { id: "ombres-1", region: "ombres", title: "La crypte ouverte", story: "Une porte de crypte qui devait rester close a été ouverte de l'intérieur." },
  { id: "ombres-2", region: "ombres", title: "Le bal des ombres", story: "Tous les suspects sont réunis au bal de Sombrelame. Les voleurs pourraient être deux." },
  { id: "ombres-3", region: "ombres", title: "Le Cœur retrouvé", story: "Le Cœur pulse dans l'obscurité. Désigne le voleur, et rends la paix à Fantolia." },
];

/** Builds the playable puzzle; the text always comes from the predicates. */
export function levelPuzzle(levelId: string, catalog: readonly Character[] = CHARACTER_CATALOG): Puzzle {
  const frozen = FROZEN_PUZZLES.find((p) => p.id === levelId);
  if (!frozen) throw new Error(`Unknown level: ${levelId}`);
  const characters = frozen.characterIds.map((id) => {
    const c = catalog.find((x) => x.id === id);
    if (!c) throw new Error(`Unknown character in level ${levelId}: ${id}`);
    return c;
  });
  const multiCulprit = culpritCountsOf(frozen.rules).some((n) => n > 1);
  return {
    id: `campaign-${levelId}`,
    seed: 0,
    difficulty: frozen.difficulty,
    characters,
    rules: frozen.rules,
    statements: frozen.statements.map((s, i) => ({
      id: `${s.characterId}-s${i}`,
      characterId: s.characterId,
      predicate: s.predicate,
      text: renderStatement(s.predicate, characters, { speakerId: s.characterId, multiCulprit }),
    })),
  };
}

/** A level is open when every level before it has been won. */
export function isUnlocked(progress: CampaignProgress, levelId: string): boolean {
  const i = LEVELS.findIndex((l) => l.id === levelId);
  if (i < 0) return false;
  return i === 0 || (progress[LEVELS[i - 1]!.id] ?? 0) > 0;
}

/** Stars come from attempts left at the win: first try = 3, second try = 2. */
export function starsFor(attemptsLeft: number): number {
  return Math.max(1, Math.min(3, attemptsLeft + 1));
}

/** Keeps the best score. */
export function recordWin(progress: CampaignProgress, levelId: string, attemptsLeft: number): CampaignProgress {
  return { ...progress, [levelId]: Math.max(progress[levelId] ?? 0, starsFor(attemptsLeft)) };
}

export function nextLevelId(levelId: string): string | null {
  const i = LEVELS.findIndex((l) => l.id === levelId);
  return LEVELS[i + 1]?.id ?? null;
}
