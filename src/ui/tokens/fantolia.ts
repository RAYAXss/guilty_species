import type { RegionId } from "../../domain/world/fantolia";

/** Presentation data for the Fantolia map (the domain only knows ids and borders). */
export const MAP_VIEWBOX = { width: 600, height: 400 } as const;

export const regionStyle: Record<RegionId, { points: string; label: [number, number]; fill: string }> = {
  foret: { points: "0,0 210,0 190,190 0,210", label: [95, 92], fill: "#b7d8a0" },
  montagnes: { points: "210,0 400,0 410,230 190,190", label: [300, 92], fill: "#d3e5f3" },
  desert: { points: "400,0 600,0 600,200 410,230", label: [505, 92], fill: "#ecca8c" },
  marais: { points: "0,210 190,190 220,400 0,400", label: [100, 292], fill: "#a6c7b9" },
  plaines: { points: "190,190 410,230 380,400 220,400", label: [300, 304], fill: "#dbe8a6" },
  ombres: { points: "410,230 600,200 600,400 380,400", label: [500, 304], fill: "#cfc0e6" },
};
