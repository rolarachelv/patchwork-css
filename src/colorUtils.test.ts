import {
  hexToRgb,
  rgbToHex,
  withOpacity,
  relativeLuminance,
  contrastRatio,
} from "./colorUtils";

describe("hexToRgb", () => {
  it("parses a 6-digit hex string", () => {
    expect(hexToRgb("#3b82f6")).toEqual({ r: 59, g: 130, b: 246 });
  });

  it("parses a 3-digit hex string by expanding it", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("accepts hex without leading #", () => {
    expect(hexToRgb("ff0000")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("throws on an invalid hex string", () => {
    expect(() => hexToRgb("#gg0000")).toThrow();
    expect(() => hexToRgb("#12")).toThrow();
  });
});

describe("rgbToHex", () => {
  it("converts RGB back to hex", () => {
    expect(rgbToHex({ r: 59, g: 130, b: 246 })).toBe("#3b82f6");
  });

  it("clamps values outside 0-255", () => {
    expect(rgbToHex({ r: -10, g: 300, b: 128 })).toBe("#00ff80");
  });

  it("round-trips with hexToRgb", () => {
    const original = "#a1b2c3";
    expect(rgbToHex(hexToRgb(original))).toBe(original);
  });
});

describe("withOpacity", () => {
  it("returns a valid rgba string", () => {
    expect(withOpacity("#ff0000", 0.5)).toBe("rgba(255, 0, 0, 0.5)");
  });

  it("clamps alpha to [0, 1]", () => {
    expect(withOpacity("#000000", 2)).toBe("rgba(0, 0, 0, 1)");
    expect(withOpacity("#ffffff", -1)).toBe("rgba(255, 255, 255, 0)");
  });
});

describe("relativeLuminance", () => {
  it("returns 0 for pure black", () => {
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 5);
  });

  it("returns 1 for pure white", () => {
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
  });
});

describe("contrastRatio", () => {
  it("returns 21 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
  });

  it("returns 1 for identical colours", () => {
    expect(contrastRatio("#3b82f6", "#3b82f6")).toBeCloseTo(1, 5);
  });

  it("is commutative", () => {
    const a = "#3b82f6";
    const b = "#1e293b";
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });
});
