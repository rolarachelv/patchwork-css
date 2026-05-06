import { generateFontWeightScale, fontWeightScaleToTokens, generateFontWeightCSS, FontWeightScaleOptions, FontWeightToken } from "./fontWeightScale";

export interface FontWeightConfig {
  weights?: Record<string, number>;
  prefix?: string;
  selector?: string;
}

export function buildFontWeightTokens(
  config: FontWeightConfig = {}
): Record<string, string> {
  const scale = generateFontWeightScale({ weights: config.weights });
  return fontWeightScaleToTokens(scale, config.prefix ?? "fw");
}

export function mergeFontWeightTokens(
  base: Record<string, string>,
  overrides: Record<string, string>
): Record<string, string> {
  return { ...base, ...overrides };
}

export function filterFontWeightTokens(
  tokens: Record<string, string>,
  predicate: (key: string, value: string) => boolean
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).filter(([k, v]) => predicate(k, v))
  );
}

export function generateFontWeightCSSFromConfig(
  config: FontWeightConfig = {}
): string {
  const scale = generateFontWeightScale({ weights: config.weights });
  return generateFontWeightCSS(
    scale,
    config.prefix ?? "fw",
    config.selector ?? ":root"
  );
}
