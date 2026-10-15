/** Card colors per creature type (presentation only). */
export const speciesStyle: Record<string, { soft: string; solid: string }> = {
  humain: { soft: "#e9c9a0", solid: "#b8692a" },
  elfe: { soft: "#e6dc9c", solid: "#a88a12" },
  orc: { soft: "#b9d19a", solid: "#4f7f2e" },
  dragon: { soft: "#eab5a5", solid: "#b5321f" },
  "nécrolas": { soft: "#c9c1e6", solid: "#4b3d9a" },
  gobelin: { soft: "#d3e08f", solid: "#78991a" },
  sylphe: { soft: "#b6dcee", solid: "#2a80ad" },
  troll: { soft: "#bccbd6", solid: "#4a6b82" },
  golem: { soft: "#d6cfbf", solid: "#7a7262" },
  vampire: { soft: "#e5b3c2", solid: "#8e1535" },
};
export const speciesColors = (species: string) => speciesStyle[species] ?? speciesStyle["humain"]!;
