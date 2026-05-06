import {
  generateFontWeightScale,
  fontWeightScaleToTokens,
  fontWeightVar,
  generateFontWeightCSS,
} from "./fontWeightScale";

describe("generateFontWeightScale", () => {
  it("returns default weights when no options provided", () => {
    const scale = generateFontWeightScale();
    expect(scale.length).toBe(9);
    expect(scale.find((t) => t.label === "regular")?.value).toBe(400);
    expect(scale.find((t) => t.label === "bold")?.value).toBe(700);
  });

  it("uses custom weights when provided", () => {
    const scale = generateFontWeightScale({
      weights: { normal: 400, heavy: 800 },
    });
    expect(scale).toHaveLength(2);
    expect(scale[0]).toEqual({ name: "font-weight-normal", label: "normal", value: 400 });
    expect(scale[1]).toEqual({ name: "font-weight-heavy", label: "heavy", value: 800 });
  });

  it("assigns correct name format", () => {
    const scale = generateFontWeightScale({ weights: { thin: 100 } });
    expect(scale[0].name).toBe("font-weight-thin");
  });
});

describe("fontWeightScaleToTokens", () => {
  it("converts scale to token map with default prefix", () => {
    const scale = generateFontWeightScale({ weights: { bold: 700, light: 300 } });
    const tokens = fontWeightScaleToTokens(scale);
    expect(tokens["fw-bold"]).toBe("700");
    expect(tokens["fw-light"]).toBe("300");
  });

  it("uses custom prefix", () => {
    const scale = generateFontWeightScale({ weights: { medium: 500 } });
    const tokens = fontWeightScaleToTokens(scale, "weight");
    expect(tokens["weight-medium"]).toBe("500");
  });
});

describe("fontWeightVar", () => {
  it("returns a CSS variable reference with default prefix", () => {
    expect(fontWeightVar("bold")).toBe("var(--fw-bold)");
  });

  it("uses custom prefix", () => {
    expect(fontWeightVar("light", "weight")).toBe("var(--weight-light)");
  });
});

describe("generateFontWeightCSS", () => {
  it("generates :root CSS block with default prefix", () => {
    const scale = generateFontWeightScale({ weights: { regular: 400 } });
    const css = generateFontWeightCSS(scale);
    expect(css).toContain(":root");
    expect(css).toContain("--fw-regular: 400;");
  });

  it("uses custom selector", () => {
    const scale = generateFontWeightScale({ weights: { bold: 700 } });
    const css = generateFontWeightCSS(scale, "fw", ".theme");
    expect(css).toContain(".theme {");
  });

  it("includes all scale entries", () => {
    const scale = generateFontWeightScale({ weights: { thin: 100, black: 900 } });
    const css = generateFontWeightCSS(scale);
    expect(css).toContain("--fw-thin: 100;");
    expect(css).toContain("--fw-black: 900;");
  });
});
