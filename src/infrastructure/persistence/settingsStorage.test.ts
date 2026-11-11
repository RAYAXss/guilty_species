import { describe, expect, it } from "vitest";
import { DEFAULT_VOLUMES, parseVolumes } from "./settingsStorage";

describe("parseVolumes", () => {
  it("reads valid volumes", () => {
    expect(parseVolumes('{"master":0.5,"music":0,"sfx":1}')).toEqual({ master: 0.5, music: 0, sfx: 1 });
  });

  it("falls back per field on invalid values", () => {
    expect(parseVolumes('{"master":7,"music":"1","sfx":0.3}')).toEqual({ master: DEFAULT_VOLUMES.master, music: DEFAULT_VOLUMES.music, sfx: 0.3 });
  });

  it("survives corrupt or missing data", () => {
    expect(parseVolumes(null)).toEqual(DEFAULT_VOLUMES);
    expect(parseVolumes("{oops")).toEqual(DEFAULT_VOLUMES);
    expect(parseVolumes("42")).toEqual(DEFAULT_VOLUMES);
  });
});
