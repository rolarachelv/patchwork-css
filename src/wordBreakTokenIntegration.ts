import {
  generateWordBreakScale,
  wordBreakScaleToTokens,
  generateWordBreakCSS,
  WordBreakScaleOptions,
  WordBreakToken,
} from './wordBreakScale';

export function buildWordBreakTokens(
  options?: WordBreakScaleOptions
): Record<string, string> {
  const scale = generateWordBreakScale(options);
  return wordBreakScaleToTokens(scale);
}

export function mergeWordBreakTokens(
  base: Record<string, string>,
  overrides: Record<string, string>
): Record<string, string> {
  return { ...base, ...overrides };
}

export function filterWordBreakTokens(
  tokens: Record<string, string>,
  predicate: (key: string, value: string) => boolean
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).filter(([k, v]) => predicate(k, v))
  );
}

export function generateWordBreakCSSFromConfig(
  options?: WordBreakScaleOptions,
  selector = ':root'
): string {
  const scale = generateWordBreakScale(options);
  return generateWordBreakCSS(scale, selector);
}
