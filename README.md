# Guilty Species

A fantasy logic and deduction board game built with Node.js, TypeScript and React.

## 🎲 Concept

Five fantasy creatures.

Multiple statements.

A set of logical rules.

One culprit.

Your job is to determine who is guilty by connecting the statements and eliminating impossible candidates.

Unlike a traditional guessing game, the solution is not based on luck.

Every valid puzzle has exactly one logical solution.

---

## 🧙 The World

The game takes place in an original fantasy universe populated by creatures such as:

- Humans
- Orcs
- Elves
- Dragons
- Necrolas
- Goblins
- Golems
- and other original creatures

Each character belongs to a behavioral alignment:

- 🕊️ Pacifiste
- ⚔️ Belliqueux
- 🩸 Vengeur

---

## 🧠 Gameplay

A typical puzzle provides:

### Characters

A group of suspicious fantasy creatures.

### Statements

Each character makes one or more statements.

### Rules

Global constraints define how many characters tell the truth or how different characters relate to one another.

### Deduction

The player compares all available information and eliminates impossible candidates.

### Solution

There must always be exactly one valid culprit.

---

## ⚖️ Example

Imagine five characters:

```text
Elara      Elf
Gorak      Orc
Thalion    Human
Varek      Dragon
Neris      Necrolas
```

The puzzle might tell you:

```text
Exactly two characters are telling the truth.

Elara says:
"Varek is lying."

Gorak says:
"Neris is the culprit."

Thalion says:
"Elara is telling the truth."

Varek says:
"Gorak is lying."

Neris says:
"Le coupable est plus fort que moi."
```

The player must determine which combination of truth/lie assignments satisfies every rule.

Only one culprit should remain.

---

## 🗺️ Fantolia

Every character lives in one of six regions of Fantolia: Forêt mystique, Montagnes glacées, Désert aride, Marais des brumes, Plaines dorées and Terres d'ombre.

The map is **lore only**: no clue depends on regions. It frames the campaign, and the **Carte** button during a campaign level shows where each suspect comes from.

Borders are domain data (`src/domain/world/fantolia.ts`); the drawing lives in `src/ui/tokens/fantolia.ts`.

## 💪 Stats: Force and Intelligence

Every character has two stats from 1 to 10, printed on the card (`strength`, `intelligence` in `src/domain/characters/catalog.ts`). From *normal* (`statClues` in `DIFFICULTY_PARAMS`), statements can use them:

- thresholds: *« Le coupable a 6 ou plus en force »*, *« Le coupable a moins de 6 en intelligence »*;
- comparisons: *« Le coupable est plus fort que Gorak »* (strictly), *« … plus intelligent que moi »*.

The generator only emits stat clues that split the current cast (someone on each side), so none is vacuous.

## 📜 Rules and clues

- Characters never name a species. When they talk about the culprit's temperament they use plain words (« d'un naturel paisible », « d'un tempérament guerrier », « animé par la vengeance »); the words *pacifiste / belliqueux / vengeur* stay on the cards and in the rules.
- Count rules: exact (`Exactement 2 personnages disent la vérité`, `Exactement 1 personnage ment`) or ranges from *difficile* (`1 ou 2 personnages disent la vérité`).
- Culprit count, from *expert*: `Il y a 2 coupables` or `Il y a 1 ou 2 coupables`. Without this rule there is exactly one culprit. With several culprits, "culprit" predicates mean "at least one culprit" (and `expected: false` means none).
- Levels add characters, not clues: still one statement per character and one count rule. *Difficile* and *expert* also reject puzzles whose wrong hypotheses are all obviously off (`analyzePuzzle().nearMisses`, tuned in `DIFFICULTY_PARAMS`); uniqueness is never relaxed.

## 🧭 Game modes

- **Jeu libre**: a new generated puzzle every round; winning moves to the next difficulty.
- **Tutoriel**: three hand-written lessons (`src/domain/tutorial/tutorial.ts`) with a step-by-step coach that highlights the cards it talks about. Tests check each lesson is unique and that its steps conclude the solver's culprit. Winning moves to the next lesson; losing replays it.
- **Campagne — Le Cœur de Fantolia**: 18 fixed levels in 6 chapters, one per region, travelling along the borders (Forêt → Marais → Plaines → Montagnes → Désert → Terres d'ombre). Each chapter has a lore intro and each level a short case. A level opens once the previous one is won; stars come from attempts left (first try = 3, second = 2). Progress is saved in `localStorage` (`fantolia.campaign.v1`).

Campaign puzzles are **frozen data** (`src/domain/campaign/frozen-puzzles.ts`): characters, predicates and rules only. The text is re-rendered from the predicates and the answer comes from the solver, so generator changes never alter a level. Tests check that every level has exactly one solution, uses no stat clue below *normal*, and only names characters present in it.

To re-bake levels (keeping each level's cast and difficulty): `npx tsx scripts/bake-campaign.ts [levelId...] > src/domain/campaign/frozen-puzzles.ts` (no id = every level). To add a level, add it to `FROZEN_PUZZLES` and `LEVELS`, then bake it.

## 🔊 Audio

Music and sound effects are optional files in `public/audio/` (names in `src/infrastructure/audio/audio.ts`). A missing file stays silent. Volumes (général, musique, effets) are set from the gear button and saved in `localStorage` (`guilty-species.settings.v1`). Sound goes through Web Audio gain nodes so the sliders also work on iOS.

## 🎴 3D background

Floating character cards rendered with three.js (`src/ui/scene/cardsScene.ts`), loaded in a separate chunk.

Portraits are square illustrations with their own background (864×864 PNG sources in `art/portraits/<id>.png`, outside `public/` so they are never shipped): cards use 480px WebP (`public/portraits/card/`) and the 3D background uses 256px WebP (`public/portraits/thumbs/`). After adding or changing a portrait, regenerate both (needs Python + Pillow):

```bash
python -c "from PIL import Image; import glob, os; [(lambda im, n: (im.resize((480, 480), Image.LANCZOS).save(f'public/portraits/card/{n}.webp', 'WEBP', quality=82), im.resize((256, 256), Image.LANCZOS).save(f'public/portraits/thumbs/{n}.webp', 'WEBP', quality=82)))(Image.open(f).convert('RGB'), os.path.basename(f)[:-4]) for f in glob.glob('art/portraits/*.png')]"
```

With reduced motion or without WebGL, static cards are shown instead.

## 🧩 Puzzle Engine

The puzzle engine is independent from the React interface.

It is responsible for:

- generating puzzles;
- generating statements;
- applying constraints;
- solving puzzles;
- validating uniqueness;
- calculating difficulty;
- handling weighted character selection;
- supporting deterministic seeds.

---

## 🎴 Weighted Characters

Characters can have different generation weights.

Example:

| Character | Weight |
|---|---:|
| Human | 5 |
| Elf | 5 |
| Orc | 3 |
| Necrolas | 2 |
| Dragon | 1 |

Weights control how often characters appear.

They do not change the logical rules of the game.

---

## 🛠️ Tech Stack

- Node.js
- TypeScript
- React
- Motion
- Tailwind CSS / existing UI system
- Automated tests

---

## 🎨 Design

The visual identity combines:

- fantasy card games;
- modern board games;
- investigation interfaces;
- friendly colorful UI;
- subtle motion.

Animation and interaction inspiration:

- Motion UI
- KokonutUI
- OriginKit
- Manus

The project uses these references as inspiration rather than copying their designs.

---

## 🧪 Testing

The puzzle engine is tested independently from the UI.

Important guarantees:

```text
A valid puzzle has exactly one solution.
```

The generator must reject:

```text
0 solutions
```

and:

```text
2+ solutions
```

---

## 🚧 Roadmap

### Phase 1

- [ ] Project setup
- [ ] Character model
- [ ] Alignment system
- [ ] Statement model
- [ ] Basic logical predicates
- [ ] Puzzle solver
- [ ] Puzzle generator
- [ ] Uniqueness validation

### Phase 2

- [ ] Character cards
- [ ] Statement cards
- [ ] Rule cards
- [ ] Investigation screen
- [ ] Suspect selection
- [ ] Victory state
- [ ] Failure state

### Phase 3

- [ ] Difficulty system
- [ ] Weighted characters
- [ ] Seeded puzzles
- [ ] Hint system
- [ ] Puzzle explanations

### Future

- [ ] Daily puzzles
- [ ] Timed mode
- [ ] Multiplayer
- [ ] Custom puzzle creation
- [ ] Campaign mode
- [ ] More fantasy factions