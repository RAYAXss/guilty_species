import type { CampaignProgress } from "../../domain/campaign/types";

const KEY = "fantolia.campaign.v1";

/** Untrusted input: keeps only known level ids with a star count in 1..3. */
export function parseProgress(raw: string | null, knownIds: readonly string[]): CampaignProgress {
  if (!raw) return {};
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return {};
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) return {};
  const progress: CampaignProgress = {};
  for (const [id, stars] of Object.entries(data)) {
    if (knownIds.includes(id) && typeof stars === "number" && Number.isInteger(stars) && stars >= 1 && stars <= 3) progress[id] = stars;
  }
  return progress;
}

export function loadProgress(knownIds: readonly string[], storage: Storage | undefined = globalThis.localStorage): CampaignProgress {
  try {
    return parseProgress(storage?.getItem(KEY) ?? null, knownIds);
  } catch {
    return {};
  }
}

export function saveProgress(progress: CampaignProgress, storage: Storage | undefined = globalThis.localStorage): void {
  try {
    storage?.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Private mode or full quota: progress stays in memory for this session.
  }
}
