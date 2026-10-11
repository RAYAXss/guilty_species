import type { Character } from "./types";

export const CHARACTER_CATALOG: readonly Character[] = [
  { id: "elara", name: "Elara", species: "elfe", alignment: "pacifiste", weight: 5, description: "Gardienne des clairières." },
  { id: "thalion", name: "Thalion", species: "humain", alignment: "pacifiste", weight: 5, description: "Scribe du village." },
  { id: "aldric", name: "Aldric", species: "humain", alignment: "belliqueux", weight: 5, description: "Capitaine de la milice." },
  { id: "gorak", name: "Gorak", species: "orc", alignment: "belliqueux", weight: 3, description: "Forgeron aux poings lourds." },
  { id: "brumm", name: "Brumm", species: "troll", alignment: "belliqueux", weight: 3, description: "Gardien du pont." },
  { id: "mira", name: "Mira", species: "gobelin", alignment: "vengeur", weight: 3, description: "Voleuse rancunière." },
  { id: "pip", name: "Pip", species: "gobelin", alignment: "pacifiste", weight: 3, description: "Cuisinier ambulant." },
  { id: "ondine", name: "Ondine", species: "sylphe", alignment: "pacifiste", weight: 4, description: "Messagère des vents." },
  { id: "neris", name: "Neris", species: "nécrolas", alignment: "vengeur", weight: 2, description: "Veilleuse des cryptes." },
  { id: "karn", name: "Karn", species: "golem", alignment: "vengeur", weight: 2, description: "Sentinelle de pierre." },
  { id: "sombrelame", name: "Sombrelame", species: "vampire", alignment: "vengeur", weight: 2, description: "Noble des nuits froides." },
  { id: "varek", name: "Varek", species: "dragon", alignment: "belliqueux", weight: 1, description: "Ancien gardien du trésor." },
];
