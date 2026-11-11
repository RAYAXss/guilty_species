import { Flame, Leaf, Swords } from "lucide-react";
import { ALIGNMENTS, type CharacterAlignment } from "../../domain/characters/types";
import { alignmentStyle } from "../tokens/alignment";

const alignmentIcons = { pacifiste: Leaf, belliqueux: Swords, vengeur: Flame } as const;

/** Symbol only, for the card corner. Its name shows in a tooltip on hover (the card's aria-label says it too). */
export function AlignmentSymbol({ alignment }: { alignment: CharacterAlignment }) {
  const s = alignmentStyle[alignment];
  const Icon = alignmentIcons[alignment];
  return (
    <span className="group/align absolute left-1.5 top-1.5 z-10 sm:left-2 sm:top-2">
      <span className={`grid size-8 place-items-center border-2 shadow-[0_2px_6px_rgba(0,0,0,0.5)] sm:size-9 ${s.bg} ${s.text} ${s.border} ${s.radius}`}>
        <Icon className="size-4 sm:size-5" strokeWidth={2.5} aria-hidden />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-full mt-1 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-bold text-surface opacity-0 shadow-md transition-opacity duration-150 group-hover/align:opacity-100 sm:text-sm"
      >
        {s.label}
      </span>
    </span>
  );
}

/** Key for the corner symbols: touch screens have no hover, so the meaning must be on screen. */
export function AlignmentLegend() {
  return (
    <ul aria-label="Symboles de tempérament" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-muted sm:text-sm">
      {ALIGNMENTS.map((a) => {
        const s = alignmentStyle[a];
        const Icon = alignmentIcons[a];
        return (
          <li key={a} className="flex items-center gap-1">
            <span className={`grid size-6 place-items-center border-2 ${s.bg} ${s.text} ${s.border} ${s.radius}`}>
              <Icon className="size-3.5" strokeWidth={2.5} aria-hidden />
            </span>
            {s.label}
          </li>
        );
      })}
    </ul>
  );
}
