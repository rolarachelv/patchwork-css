import {
  generateFilterScale,
  filterScaleToTokens,
  filterVar,
  generateFilterCSS,
  FilterScaleConfig,
} from "./filterScale";

describe("generateFilterScale", () => {
  it("returns default scale with correct structure", () => {
    const scale = generateFilterScale();
    expect(scale).toHaveProperty("blur");
    expect(scale).toHaveProperty("brightness");
    expect(scale).toHaveProperty("contrast");
    expect(scale).toHaveProperty("saturate");
  });

  it("generates correct number of blur steps", () => {
    const scale = generateFilterScale({ blurSteps: 4 });
    expect(scale.blur).toHaveLength(4);
  });

  it("generates correct blur values", () => {
    const scale = generateFilterScale({ blurBase: 2, blurUnit: "px", blurSteps: 3 });
    expect(scale.blur[0].value).toBe("blur(2px)");
    expect(scale.blur[1].value).toBe("blur(4px)");
    expect(scale.blur[2].value).toBe("blur(6px)");
  });

  it("generates correct brightness values", () => {
    const scale = generateFilterScale({
      brightnessSteps: 3,
      brightnessBase: 0.5,
      brightnessIncrement: 0.5,
    });
    expect(scale.brightness[0].value).toBe("brightness(0.5)");
    expect(scale.brightness[1].value).toBe("brightness(1)");
    expect(scale.brightness[2].value).toBe("brightness(1.5)");
  });

  it("assigns correct labels based on step position", () => {
    const scale = generateFilterScale({ blurSteps: 3 });
    expect(scale.blur[0].label).toBe("0");
    expect(scale.blur[1].label).toBe("50");
    expect(scale.blur[2].label).toBe("100");
  });

  it("handles single step with label 'default'", () => {
    const scale = generateFilterScale({ blurSteps: 1 });
    expect(scale.blur[0].label).toBe("default");
  });
});

describe("filterScaleToTokens", () => {
  it("produces flat token map with correct keys", () => {
    const scale = generateFilterScale({ blurSteps: 2, brightnessSteps: 2, contrastSteps: 2, saturateSteps: 2 });
    const tokens = filterScaleToTokens(scale);
    expect(Object.keys(tokens).some((k) => k.startsWith("filter-blur-"))).toBe(true);
    expect(Object.keys(tokens).some((k) => k.startsWith("filter-brightness-"))).toBe(true);
  });

  it("token values match generated values", () => {
    const scale = generateFilterScale({ blurSteps: 1, brightnessSteps: 1, contrastSteps: 1, saturateSteps: 1 });
    const tokens = filterScaleToTokens(scale);
    expect(tokens["filter-blur-default"]).toBe(scale.blur[0].value);
  });
});

describe("filterVar", () => {
  it("returns correct CSS variable reference", () => {
    expect(filterVar("blur", "50")).toBe("var(--filter-blur-50)");
    expect(filterVar("brightness", "default")).toBe("var(--filter-brightness-default)");
  });
});

describe("generateFilterCSS", () => {
  it("wraps tokens in :root block by default", () => {
    const scale = generateFilterScale({ blurSteps: 1, brightnessSteps: 1, contrastSteps: 1, saturateSteps: 1 });
    const css = generateFilterCSS(scale);
    expect(css).toMatch(/^:root \{/);
    expect(css).toMatch(/--filter-blur-/);
  });

  it("respects custom selector", () => {
    const scale = generateFilterScale({ blurSteps: 1, brightnessSteps: 1, contrastSteps: 1, saturateSteps: 1 });
    const css = generateFilterCSS(scale, ".theme");
    expect(css).toMatch(/^\.theme \{/);
  });

  it("each declaration ends with semicolon", () => {
    const scale = generateFilterScale({ blurSteps: 2, brightnessSteps: 2, contrastSteps: 2, saturateSteps: 2 });
    const css = generateFilterCSS(scale);
    const lines = css.split("\n").filter((l) => l.trim().startsWith("--"));
    lines.forEach((line) => expect(line.trim()).toMatch(/;$/));
  });
});
