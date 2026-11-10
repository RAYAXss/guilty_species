import type { Volumes } from "../audio/audio";

const KEY = "guilty-species.settings.v1";

export const DEFAULT_VOLUMES: Volumes = { master: 0.8, music: 0.6, sfx: 0.8 };

/** Untrusted input: keeps each volume only if it is a number in 0..1. */
export function parseVolumes(raw: string | null): Volumes {
  let data: unknown;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }
  const obj = typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
  const pick = (key: keyof Volumes) => {
    const v = obj[key];
    return typeof v === "number" && v >= 0 && v <= 1 ? v : DEFAULT_VOLUMES[key];
  };
  return { master: pick("master"), music: pick("music"), sfx: pick("sfx") };
}

export function loadVolumes(storage: Storage | undefined = globalThis.localStorage): Volumes {
  try {
    return parseVolumes(storage?.getItem(KEY) ?? null);
  } catch {
    return DEFAULT_VOLUMES;
  }
}

export function saveVolumes(volumes: Volumes, storage: Storage | undefined = globalThis.localStorage): void {
  try {
    storage?.setItem(KEY, JSON.stringify(volumes));
  } catch {
    // Private mode or full quota: settings stay in memory for this session.
  }
}
