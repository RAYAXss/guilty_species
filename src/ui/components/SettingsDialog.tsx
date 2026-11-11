import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Music, Volume2, Wand2, X } from "lucide-react";
import type { Volumes } from "../../infrastructure/audio/audio";
import { motionTokens } from "../tokens/motion";

interface Props {
  volumes: Volumes;
  onChange: (volumes: Volumes) => void;
  onClose: () => void;
}

const SLIDERS = [
  { key: "master", label: "Volume général", Icon: Volume2 },
  { key: "music", label: "Musique", Icon: Music },
  { key: "sfx", label: "Effets sonores", Icon: Wand2 },
] as const;

export function SettingsDialog({ volumes, onChange, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: motionTokens.duration.fast }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={motionTokens.spring.soft}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-card border-2 border-sun bg-surface p-5 text-ink shadow-[0_6px_0_#07050d]"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="settings-title" className="font-display text-xl font-extrabold">
            Réglages
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fermer les réglages"
            className="inline-flex size-11 items-center justify-center rounded-lg border-2 border-ink/30 hover:border-ink"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className="mt-4 grid gap-5">
          {SLIDERS.map(({ key, label, Icon }) => {
            const value = Math.round(volumes[key] * 100);
            return (
              <label key={key} className="grid gap-2">
                <span className="flex items-center justify-between gap-2 font-bold">
                  <span className="flex items-center gap-2">
                    <Icon size={20} className="text-primary" aria-hidden />
                    {label}
                  </span>
                  <span className="tabular-nums text-muted">{value} %</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={value}
                  onChange={(e) => onChange({ ...volumes, [key]: Number(e.target.value) / 100 })}
                  className="h-11 w-full cursor-pointer accent-primary"
                />
              </label>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
