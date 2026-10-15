import { useEffect, useState, type ReactNode } from "react";
import type { CharacterAlignment } from "../../domain/characters/types";
import { alignmentStyle } from "../tokens/alignment";

interface SpeciesArt {
  skin: string;
  shade: string;
  /** Drawn behind the head (hair, wings, hood). */
  back?: ReactNode;
  /** Drawn on top of the face (hair fringe, tusks, horns...). */
  front?: ReactNode;
  eyes?: { white: string; pupil: string; glow?: boolean; slit?: boolean };
  mouth?: ReactNode;
  headRx?: number;
}

const smile = <path d="M86 122 Q100 134 114 122" stroke="#4a2a2a" strokeWidth="4" fill="none" strokeLinecap="round" />;
const grin = (
  <g>
    <path d="M82 120 Q100 142 118 120 Z" fill="#4a1f2a" />
    <path d="M86 120 l4 8 l4 -8 M106 120 l4 8 l4 -8" fill="#fff" stroke="#fff" strokeWidth="1" />
  </g>
);

const ART: Record<string, SpeciesArt> = {
  humain: {
    skin: "#f2c29b", shade: "#dca47a",
    back: <path d="M52 100 Q50 40 100 40 Q150 40 148 100 Q140 70 100 66 Q60 70 52 100Z" fill="#6b4226" />,
    front: <path d="M54 92 Q56 48 100 46 Q144 48 146 92 Q130 66 100 70 Q72 66 54 92Z" fill="#7d4e2d" />,
  },
  elfe: {
    skin: "#f7dcc0", shade: "#e2bf9d",
    back: <path d="M50 70 Q60 30 100 30 Q140 30 150 70 L156 190 Q130 160 128 120 L72 120 Q70 160 44 190Z" fill="#e8e1b8" />,
    front: (
      <g>
        <path d="M56 92 L22 70 L58 114Z M144 92 L178 70 L142 114Z" fill="#f7dcc0" stroke="#e2bf9d" strokeWidth="2" />
        <path d="M56 88 Q60 46 100 44 Q140 46 144 88 Q128 62 100 64 Q72 62 56 88Z" fill="#f1ecc9" />
        <path d="M92 52 l8 -14 l8 14Z" fill="#ffc83d" />
      </g>
    ),
    eyes: { white: "#fff", pupil: "#2a8f6a" },
  },
  orc: {
    skin: "#82b95b", shade: "#639a41", headRx: 50,
    back: <path d="M48 96 Q50 44 100 44 Q150 44 152 96Z" fill="#3e3a2a" />,
    front: (
      <g>
        <path d="M70 84 L92 92 M130 84 L108 92" stroke="#2f4a1d" strokeWidth="6" strokeLinecap="round" />
        <path d="M82 124 l-4 -16 l12 10Z M118 124 l4 -16 l-12 10Z" fill="#fff8e1" />
        <path d="M56 70 Q100 30 144 70 Q100 54 56 70Z" fill="#3e3a2a" />
      </g>
    ),
    eyes: { white: "#ffefb0", pupil: "#8a1f1f" },
    mouth: <path d="M82 122 Q100 114 118 122" stroke="#2f4a1d" strokeWidth="5" fill="none" strokeLinecap="round" />,
  },
  dragon: {
    skin: "#e8573f", shade: "#c2402c",
    back: <path d="M70 60 L78 24 L92 54 L100 16 L108 54 L122 24 L130 60Z" fill="#ffc83d" />,
    front: (
      <g>
        <path d="M60 62 Q44 30 34 24 Q46 52 56 76Z M140 62 Q156 30 166 24 Q154 52 144 76Z" fill="#fff0cf" />
        <ellipse cx="100" cy="118" rx="26" ry="18" fill="#f48b6c" />
        <circle cx="90" cy="116" r="3.5" fill="#7a2418" /><circle cx="110" cy="116" r="3.5" fill="#7a2418" />
      </g>
    ),
    eyes: { white: "#ffe27a", pupil: "#2a1010", slit: true },
    mouth: <path d="M88 130 Q100 138 112 130" stroke="#7a2418" strokeWidth="4" fill="none" strokeLinecap="round" />,
  },
  "nécrolas": {
    skin: "#d9d0f2", shade: "#b6a9dd",
    back: <path d="M38 190 Q30 40 100 28 Q170 40 162 190 Q132 150 130 110 L70 110 Q68 150 38 190Z" fill="#2c2552" />,
    front: <path d="M96 52 l4 -8 l4 8 l-4 8Z" fill="#5ff2d0" />,
    eyes: { white: "#1b1638", pupil: "#5ff2d0", glow: true },
    mouth: <path d="M90 124 L110 124" stroke="#2c2552" strokeWidth="4" strokeLinecap="round" />,
  },
  gobelin: {
    skin: "#a6d94f", shade: "#85b838",
    front: (
      <g>
        <path d="M58 96 L8 62 L56 120Z M142 96 L192 62 L144 120Z" fill="#a6d94f" stroke="#85b838" strokeWidth="2" />
        <path d="M96 100 Q112 118 100 124 Q92 120 96 100Z" fill="#85b838" />
      </g>
    ),
    eyes: { white: "#fff7b0", pupil: "#3a2a00" },
    mouth: grin,
  },
  sylphe: {
    skin: "#c6ecff", shade: "#9fd4f0",
    back: (
      <g opacity="0.8">
        <path d="M100 150 Q10 90 20 30 Q80 50 100 130Z" fill="#e3f6ff" stroke="#9fd4f0" strokeWidth="2" />
        <path d="M100 150 Q190 90 180 30 Q120 50 100 130Z" fill="#e3f6ff" stroke="#9fd4f0" strokeWidth="2" />
      </g>
    ),
    front: (
      <g>
        <path d="M54 92 Q52 44 100 42 Q150 44 146 92 Q150 130 132 142 Q140 100 100 72 Q62 100 68 142 Q50 130 54 92Z" fill="#8fb7ff" />
        <path d="M150 52 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4Z" fill="#fff" />
      </g>
    ),
    eyes: { white: "#fff", pupil: "#3a5fd0" },
  },
  troll: {
    skin: "#8aa3b4", shade: "#6c869a", headRx: 54,
    back: <path d="M44 92 Q46 40 100 40 Q154 40 156 92Z" fill="#4f8f3a" />,
    front: (
      <g>
        <path d="M60 64 q6 -22 14 -4 q6 -26 16 -2 q8 -22 14 0 q8 -24 16 0 q8 -22 14 2 q8 -16 10 6 Q100 50 60 64Z" fill="#5da346" />
        <ellipse cx="100" cy="112" rx="14" ry="16" fill="#6c869a" />
        <path d="M70 82 L90 90 M130 82 L110 90" stroke="#3d5163" strokeWidth="6" strokeLinecap="round" />
      </g>
    ),
    eyes: { white: "#fff", pupil: "#243746" },
    mouth: <path d="M80 130 Q100 140 120 130" stroke="#3d5163" strokeWidth="5" fill="none" strokeLinecap="round" />,
  },
  golem: {
    skin: "#b4aea2", shade: "#8f897d", headRx: 50,
    front: (
      <g>
        <path d="M70 62 L84 78 L76 92" stroke="#6f695e" strokeWidth="3" fill="none" />
        <path d="M130 120 L118 130 L126 142" stroke="#6f695e" strokeWidth="3" fill="none" />
        <path d="M60 60 q10 -12 24 -4 q-8 14 -24 4Z" fill="#6fae4f" />
      </g>
    ),
    eyes: { white: "#ffb347", pupil: "#ffb347", glow: true },
    mouth: <rect x="86" y="120" width="28" height="6" rx="2" fill="#6f695e" />,
  },
  vampire: {
    skin: "#efe6f0", shade: "#d3c5d6",
    back: <path d="M30 190 L50 90 Q60 30 100 30 Q140 30 150 90 L170 190 L130 150 L70 150Z" fill="#7a1230" />,
    front: (
      <g>
        <path d="M54 92 Q58 44 100 44 Q142 44 146 92 Q130 60 108 72 L100 62 L92 72 Q70 60 54 92Z" fill="#1c1a24" />
        <path d="M91 124 l3 10 l3 -10Z M104 124 l3 10 l3 -10Z" fill="#fff" stroke="#d3c5d6" />
      </g>
    ),
    eyes: { white: "#fff", pupil: "#c1143a" },
    mouth: <path d="M88 122 Q100 128 112 122" stroke="#7a1230" strokeWidth="4" fill="none" strokeLinecap="round" />,
  },
};

function SvgPortrait({ species, alignment, className }: { species: string; alignment: CharacterAlignment; className?: string }) {
  const art = ART[species] ?? ART["humain"]!;
  const cloak = alignmentStyle[alignment].solid;
  const eyes = art.eyes ?? { white: "#fff", pupil: "#2b2140" };
  const rx = art.headRx ?? 46;

  return (
    <svg viewBox="0 0 200 220" overflow="visible" className={className} role="img" aria-label={`Portrait : ${species}`}>
      {art.back}
      <path d="M10 300 L10 220 C18 160 58 146 100 146 C142 146 182 160 190 220 L190 300Z" fill={cloak} />
      <path d="M72 148 Q100 176 128 148" fill="none" stroke="#ffffff55" strokeWidth="6" strokeLinecap="round" />
      <rect x="84" y="126" width="32" height="30" rx="10" fill={art.shade} />
      <ellipse cx="100" cy="96" rx={rx} ry="50" fill={art.skin} />
      <circle cx="72" cy="110" r="7" fill="#ff8aa0" opacity="0.28" />
      <circle cx="128" cy="110" r="7" fill="#ff8aa0" opacity="0.28" />
      {[80, 120].map((x) => (
        <g key={x}>
          {eyes.glow && <circle cx={x} cy="98" r="11" fill={eyes.pupil} opacity="0.35" />}
          <ellipse cx={x} cy="98" rx="8" ry={eyes.slit ? 8 : 9} fill={eyes.white} />
          <ellipse cx={x} cy="99" rx={eyes.slit ? 2.5 : 4.5} ry={eyes.slit ? 7 : 5} fill={eyes.pupil} />
        </g>
      ))}
      {art.mouth ?? smile}
      {art.front}
    </svg>
  );
}

interface PortraitProps {
  species: string;
  alignment: CharacterAlignment;
  /** Character name, used for the accessible label of PNG portraits. */
  name?: string;
  /** PNG portrait URL. If missing or failing to load, the SVG illustration is used. */
  src?: string;
  className?: string;
}

/** PNG portrait with a graceful fallback to the species SVG. Same 200x220 box either way. */
export function Portrait({ species, alignment, name, src, className }: PortraitProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) return <SvgPortrait species={species} alignment={alignment} className={className} />;
  return (
    <img
      src={src}
      alt={name ? `Portrait de ${name}, ${species}` : `Portrait : ${species}`}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={`${className ?? ""} aspect-[200/220] object-contain object-bottom select-none`}
    />
  );
}
