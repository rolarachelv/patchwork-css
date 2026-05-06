import {
  generateAspectRatioScale,
  aspectRatioScaleToTokens,
  aspectRatioVar,
  generateAspectRatioCSS,
} from "./aspectRatioScale";

describe("generateAspectRatioScale", () => {
  it("returns default ratios when no options provided", () => {
    const scale = generateAspectRatioScale();
    expect(scale.length).toBeGreaterThan(0);
    const names = scale.map((t) => t.name);
    expect(names).toContain("square");
    expect(names).toContain("video");
    expect(names).toContain("portrait");
  });

  it("square token has correct value", () => {
    const scale = generateAspectRatioScale();
    const square = scale.find((t) => t.name === "square");
    expect(square).toBeDefined();
    expect(square!.value).toBe("1 / 1");
    expect(square!.numerator).toBe(1);
    expect(square!.denominator).toBe(1);
  });

  it("video token has correct value", () => {
    const scale = generateAspectRatioScale();
    const video = scale.find((t) => t.name === "video");
    expect(video!.value).toBe("16 / 9");
    expect(video!.label).toBe("16/9");
  });

  it("merges custom ratios with defaults", () => {
    const scale = generateAspectRatioScale({
      ratios: { ultrawide: [32, 9] },
    });
    const names = scale.map((t) => t.name);
    expect(names).toContain("ultrawide");
    expect(names).toContain("square");
  });

  it("custom ratio overrides default", () => {
    const scale = generateAspectRatioScale({
      ratios: { video: [4, 3] },
    });
    const video = scale.find((t) => t.name === "video");
    expect(video!.value).toBe("4 / 3");
  });
});

describe("aspectRatioScaleToTokens", () => {
  it("produces a token map with default prefix", () => {
    const scale = generateAspectRatioScale();
    const tokens = aspectRatioScaleToTokens(scale);
    expect(tokens["aspect-square"]).toBe("1 / 1");
    expect(tokens["aspect-video"]).toBe("16 / 9");
  });

  it("respects custom prefix", () => {
    const scale = generateAspectRatioScale();
    const tokens = aspectRatioScaleToTokens(scale, "ratio");
    expect(tokens["ratio-square"]).toBe("1 / 1");
  });
});

describe("aspectRatioVar", () => {
  it("returns a CSS var reference", () => {
    expect(aspectRatioVar("video")).toBe("var(--aspect-video)");
  });

  it("respects custom prefix", () => {
    expect(aspectRatioVar("square", "ratio")).toBe("var(--ratio-square)");
  });
});

describe("generateAspectRatioCSS", () => {
  it("outputs :root block with declarations", () => {
    const scale = generateAspectRatioScale();
    const css = generateAspectRatioCSS(scale);
    expect(css).toContain(":root {");
    expect(css).toContain("--aspect-square: 1 / 1;");
    expect(css).toContain("--aspect-video: 16 / 9;");
  });

  it("respects custom selector", () => {
    const scale = generateAspectRatioScale();
    const css = generateAspectRatioCSS(scale, "aspect", ".theme");
    expect(css).toContain(".theme {");
  });
});
