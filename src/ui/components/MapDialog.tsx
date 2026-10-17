import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { MapPin, X } from "lucide-react";
import type { Character } from "../../domain/characters/types";
import { REGION_IDS, REGION_NAMES, adjacentRegions, neighborsOf, type RegionId } from "../../domain/world/fantolia";
import { motionTokens } from "../tokens/motion";
import { MAP_VIEWBOX, regionStyle } from "../tokens/fantolia";
import { portraitSrc } from "../tokens/portrait";
import { speciesColors } from "../tokens/species";

interface Props {
  characters: Character[];
  onClose: () => void;
}

/** Simple map of Fantolia: pick a creature to see which regions border its own. */
export function MapDialog({ characters, onClose }: Props) {
  const [focusId, setFocusId] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const focus = characters.find((c) => c.id === focusId);
  const neighborRegions: RegionId[] = focus ? adjacentRegions(focus.region) : [];
  const neighbors = focus ? neighborsOf(characters, focus.id) : [];

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/75 p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionTokens.duration.fast }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-title"
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={motionTokens.spring.soft}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-card border-2 border-sun bg-surface p-3 text-ink shadow-[0_8px_0_#07050d] sm:p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="map-title" className="font-display text-xl font-extrabold sm:text-2xl">
            Carte de Fantolia
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fermer la carte"
            className="inline-flex size-11 items-center justify-center rounded-lg border-2 border-ink/30 hover:border-ink"
          >
            <X size={20} aria-hidden />
          </button>
        </div>
        <p className="mt-1 text-sm font-semibold text-muted sm:text-base">
          Un voisin vit dans une région qui touche celle de la créature. Touche une créature pour voir ses voisins.
        </p>

        <svg
          viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
          className="mt-3 block h-auto w-full rounded-lg border-2 border-ink/40 bg-[#8fb7c9]"
          role="group"
          aria-label="Carte des six régions de Fantolia"
        >
          <defs>
            <pattern id="neighbor-hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="12" height="12" fill="none" />
              <line x1="0" y1="0" x2="0" y2="12" stroke="#8f2d3c" strokeWidth="5" strokeOpacity="0.45" />
            </pattern>
          </defs>

          {REGION_IDS.map((id) => {
            const style = regionStyle[id];
            const own = focus?.region === id;
            const next = neighborRegions.includes(id);
            return (
              <g key={id}>
                <polygon
                  points={style.points}
                  fill={style.fill}
                  stroke={own ? "#d1a03a" : next ? "#8f2d3c" : "#1f1830"}
                  strokeWidth={own || next ? 5 : 2}
                  strokeDasharray={next ? "10 6" : undefined}
                  strokeLinejoin="round"
                />
                {next && <polygon points={style.points} fill="url(#neighbor-hatch)" pointerEvents="none" />}
                <text
                  x={style.label[0]}
                  y={style.label[1]}
                  textAnchor="middle"
                  className="fill-[#1f1830] font-display text-[19px] font-bold"
                  pointerEvents="none"
                >
                  {REGION_NAMES[id]}
                </text>
                {(own || next) && (
                  <text x={style.label[0]} y={style.label[1] + 20} textAnchor="middle" className="fill-[#1f1830] text-[15px] font-bold" pointerEvents="none">
                    {own ? "★ Sa région" : "↔ Voisine"}
                  </text>
                )}
              </g>
            );
          })}

          {REGION_IDS.map((id) => {
            const [lx, ly] = regionStyle[id].label;
            const residents = characters.filter((c) => c.region === id);
            const gap = 64;
            return residents.map((c, i) => {
              const cx = lx + (i - (residents.length - 1) / 2) * gap;
              const cy = ly + 56;
              const picked = c.id === focusId;
              const colors = speciesColors(c.species);
              return (
                <g
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={picked}
                  aria-label={`${c.name}, ${REGION_NAMES[c.region]}`}
                  className="cursor-pointer outline-none [&:focus-visible>circle]:stroke-[#d1a03a]"
                  onClick={() => setFocusId((cur) => (cur === c.id ? null : c.id))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setFocusId((cur) => (cur === c.id ? null : c.id));
                    }
                  }}
                >
                  <circle cx={cx} cy={cy} r={picked ? 27 : 24} fill={colors.soft} stroke={picked ? "#d1a03a" : colors.solid} strokeWidth={picked ? 5 : 3} />
                  <text x={cx} y={cy + 7} textAnchor="middle" className="fill-[#1f1830] font-display text-[20px] font-bold" pointerEvents="none">
                    {c.name.charAt(0)}
                  </text>
                  <clipPath id={`clip-${c.id}`}>
                    <circle cx={cx} cy={cy} r={21} />
                  </clipPath>
                  <image
                    href={portraitSrc(c)}
                    x={cx - 24}
                    y={cy - 26}
                    width={48}
                    height={48}
                    clipPath={`url(#clip-${c.id})`}
                    preserveAspectRatio="xMidYMin slice"
                    pointerEvents="none"
                  />
                  <text x={cx} y={cy + 42} textAnchor="middle" className="fill-[#1f1830] text-[14px] font-bold" pointerEvents="none">
                    {c.name}
                  </text>
                </g>
              );
            });
          })}
        </svg>

        <p className="mt-3 flex items-start gap-2 text-sm font-bold sm:text-base" aria-live="polite">
          <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <span>
            {!focus
              ? "Aucune créature choisie."
              : neighbors.length > 0
                ? `Voisins de ${focus.name} : ${neighbors.map((n) => `${n.name} (${REGION_NAMES[n.region]})`).join(", ")}.`
                : `${focus.name} n'a aucun voisin parmi les suspects.`}
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
}
