import { describe, expect, it } from "vitest";
import { parseProgress } from "./campaignStorage";

describe("parseProgress", () => {
  const known = ["foret-1", "foret-2"];

  it("reads valid progress", () => {
    expect(parseProgress('{"foret-1":3,"foret-2":2}', known)).toEqual({ "foret-1": 3, "foret-2": 2 });
  });

  it("drops unknown levels and invalid star counts", () => {
    expect(parseProgress('{"foret-1":7,"foret-2":"3","ghost":3}', known)).toEqual({});
  });

  it("survives corrupt or unexpected data", () => {
    expect(parseProgress(null, known)).toEqual({});
    expect(parseProgress("{oops", known)).toEqual({});
    expect(parseProgress("[1,2]", known)).toEqual({});
    expect(parseProgress("42", known)).toEqual({});
  });
});
