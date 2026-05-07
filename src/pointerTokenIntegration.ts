/**
 * pointerTokenIntegration.ts
 * Integration helpers for composing pointer scale tokens with the broader token system.
 */

import { generatePointerScale, pointerScaleToTokens, generatePointerCSS, PointerScaleConfig } from './pointerScale';

export function buildPointerTokens(
  config: PointerScaleConfig = {},
  prefix = 'pointer'
): Record<string, string> {
  const scale = generatePointerScale(config);
  return pointerScaleToTokens(scale, prefix);
}

export function mergePointerTokens(
  base: Record<string, string>,
  overrides: Record<string, string> = {}
): Record<string, string> {
  return { ...base, ...overrides };
}

export function filterPointerTokens(
  tokens: Record<string, string>,
  prefix = 'pointer'
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).filter(([key]) => key.startsWith(`${prefix}-`))
  );
}

export function generatePointerCSSFromConfig(
  config: PointerScaleConfig = {},
  prefix = 'pointer',
  selector = ':root'
): string {
  const scale = generatePointerScale(config);
  return generatePointerCSS(scale, prefix, selector);
}
