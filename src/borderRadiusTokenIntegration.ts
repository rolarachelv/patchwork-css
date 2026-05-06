import { generateBorderRadiusScale, borderRadiusScaleToTokens, generateBorderRadiusCSS, BorderRadiusScaleOptions } from './borderRadiusScale';

export interface BorderRadiusTokenConfig {
  steps?: number;
  base?: number;
  unit?: string;
  includeRound?: boolean;
  includeFull?: boolean;
  prefix?: string;
  selector?: string;
}

export function buildBorderRadiusTokens(
  config: BorderRadiusTokenConfig = {}
): Record<string, string> {
  const { prefix = 'border-radius', ...scaleOptions } = config;
  const scale = generateBorderRadiusScale(scaleOptions as BorderRadiusScaleOptions);
  return borderRadiusScaleToTokens(scale, prefix);
}

export function mergeBorderRadiusTokens(
  base: Record<string, string>,
  overrides: Record<string, string>
): Record<string, string> {
  return { ...base, ...overrides };
}

export function filterBorderRadiusTokens(
  tokens: Record<string, string>,
  prefix = 'border-radius'
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).filter(([key]) => key.startsWith(prefix))
  );
}

export function generateBorderRadiusCSSFromConfig(
  config: BorderRadiusTokenConfig = {}
): string {
  const { prefix = 'border-radius', selector = ':root', ...scaleOptions } = config;
  const scale = generateBorderRadiusScale(scaleOptions as BorderRadiusScaleOptions);
  return generateBorderRadiusCSS(scale, prefix, selector);
}
