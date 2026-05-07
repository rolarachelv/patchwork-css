import { generateOverflowScale, overflowScaleToTokens, generateOverflowCSS, OverflowScaleConfig } from './overflowScale';

export function buildOverflowTokens(
  config: OverflowScaleConfig = {},
  prefix = 'overflow'
): Record<string, string> {
  const scale = generateOverflowScale(config);
  return overflowScaleToTokens(scale, prefix);
}

export function mergeOverflowTokens(
  base: Record<string, string>,
  overrides: Record<string, string>
): Record<string, string> {
  return { ...base, ...overrides };
}

export function filterOverflowTokens(
  tokens: Record<string, string>,
  predicate: (key: string, value: string) => boolean
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).filter(([key, value]) => predicate(key, value))
  );
}

export function generateOverflowCSSFromConfig(
  config: OverflowScaleConfig = {},
  selector = ':root',
  prefix = 'overflow'
): string {
  const tokens = buildOverflowTokens(config, prefix);
  return generateOverflowCSS(tokens, selector);
}
