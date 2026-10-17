import type { Character } from "./types";

export const CHARACTER_CATALOG: readonly Character[] = [
  { id: "elara", name: "Elara", species: "elfe", alignment: "pacifiste", region: "foret", weight: 5, description: "Gardienne des clairières." },
  { id: "thalion", name: "Thalion", species: "humain", alignment: "pacifiste", region: "plaines", weight: 5, description: "Scribe du village." },
  { id: "aldric", name: "Aldric", species: "humain", alignment: "belliqueux", region: "plaines", weight: 5, description: "Capitaine de la milice." },
  { id: "gorak", name: "Gorak", species: "orc", alignment: "belliqueux", region: "desert", weight: 3, description: "Forgeron aux poings lourds." },
  { id: "brumm", name: "Brumm", species: "troll", alignment: "belliqueux", region: "desert", weight: 3, description: "Gardien du pont." },
  { id: "mira", name: "Mira", species: "gobelin", alignment: "vengeur", region: "marais", weight: 3, description: "Voleuse rancunière." },
  { id: "pip", name: "Pip", species: "gobelin", alignment: "pacifiste", region: "marais", weight: 3, description: "Cuisinier ambulant." },
  { id: "ondine", name: "Ondine", species: "sylphe", alignment: "pacifiste", region: "foret", weight: 4, description: "Messagère des vents." },
  { id: "neris", name: "Neris", species: "nécrolas", alignment: "vengeur", region: "ombres", weight: 2, description: "Veilleuse des cryptes." },
  { id: "karn", name: "Karn", species: "golem", alignment: "vengeur", region: "montagnes", weight: 2, description: "Sentinelle de pierre." },
  { id: "sombrelame", name: "Sombrelame", species: "vampire", alignment: "vengeur", region: "ombres", weight: 2, description: "Noble des nuits froides." },
  { id: "varek", name: "Varek", species: "dragon", alignment: "belliqueux", region: "montagnes", weight: 1, description: "Ancien gardien du trésor." },
];
