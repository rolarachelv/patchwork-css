import { generateDisplayScale, displayScaleToTokens, generateDisplayCSS, DisplayScaleConfig, DisplayToken } from './displayScale';

export function buildDisplayTokens(
  config: DisplayScaleConfig = {},
  prefix = 'display'
): Record<string, string> {
  const tokens = generateDisplayScale(config);
  return displayScaleToTokens(tokens, prefix);
}

export function mergeDisplayTokens(
  base: Record<string, string>,
  overrides: Record<string, string>
): Record<string, string> {
  return { ...base, ...overrides };
}

export function filterDisplayTokens(
  tokens: Record<string, string>,
  keys: string[]
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).filter(([key]) => keys.includes(key))
  );
}

export function generateDisplayCSSFromConfig(
  config: DisplayScaleConfig = {},
  prefix = 'display'
): string {
  const tokens: DisplayToken[] = generateDisplayScale(config);
  return generateDisplayCSS(tokens, prefix);
}
