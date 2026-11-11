import type { Character } from "./types";

export const CHARACTER_CATALOG: readonly Character[] = [
  { id: "elara", name: "Elara", species: "elfe", alignment: "pacifiste", region: "foret", strength: 4, intelligence: 8, weight: 5, description: "Gardienne des clairières." },
  { id: "thalion", name: "Thalion", species: "humain", alignment: "pacifiste", region: "plaines", strength: 3, intelligence: 9, weight: 5, description: "Scribe du village." },
  { id: "aldric", name: "Aldric", species: "humain", alignment: "belliqueux", region: "montagnes", strength: 7, intelligence: 6, weight: 5, description: "Capitaine de la milice." },
  { id: "gorak", name: "Gorak", species: "orc", alignment: "belliqueux", region: "desert", strength: 9, intelligence: 4, weight: 3, description: "Forgeron aux poings lourds." },
  { id: "brumm", name: "Brumm", species: "troll", alignment: "belliqueux", region: "marais", strength: 10, intelligence: 2, weight: 3, description: "Gardien du pont." },
  { id: "mira", name: "Mira", species: "gobelin", alignment: "vengeur", region: "ombres", strength: 3, intelligence: 7, weight: 3, description: "Voleuse rancunière." },
  { id: "pip", name: "Pip", species: "gobelin", alignment: "pacifiste", region: "plaines", strength: 2, intelligence: 5, weight: 3, description: "Cuisinier ambulant." },
  { id: "ondine", name: "Ondine", species: "sylphe", alignment: "pacifiste", region: "foret", strength: 2, intelligence: 6, weight: 4, description: "Messagère des vents." },
  { id: "neris", name: "Neris", species: "nécrolas", alignment: "vengeur", region: "ombres", strength: 4, intelligence: 9, weight: 2, description: "Veilleuse des cryptes." },
  { id: "karn", name: "Karn", species: "golem", alignment: "vengeur", region: "montagnes", strength: 9, intelligence: 3, weight: 2, description: "Sentinelle de pierre." },
  { id: "sombrelame", name: "Sombrelame", species: "vampire", alignment: "vengeur", region: "marais", strength: 7, intelligence: 8, weight: 2, description: "Noble des nuits froides." },
  { id: "varek", name: "Varek", species: "dragon", alignment: "belliqueux", region: "desert", strength: 10, intelligence: 10, weight: 1, description: "Ancien gardien du trésor." },
];
