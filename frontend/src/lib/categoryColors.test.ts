import { getCategoryColor } from "./categoryColors";

describe("getCategoryColor", () => {
  it("returns a hex color string", () => {
    expect(getCategoryColor(0)).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("is stable for the same index", () => {
    expect(getCategoryColor(2)).toBe(getCategoryColor(2));
  });

  it("wraps around when the index exceeds the palette length", () => {
    // The palette has 8 colors, so index 8 should equal index 0.
    expect(getCategoryColor(8)).toBe(getCategoryColor(0));
    expect(getCategoryColor(9)).toBe(getCategoryColor(1));
  });
});
