import { generateShadowScale } from './shadowScale';
import { generateCSS, tokenKeyToCSSVar } from './cssGenerator';
import { ShadowScaleOptions, FlatTokenMap } from './types';

/**
 * Converts a shadow scale into a flat token map compatible with the CSS generator.
 */
export function shadowScaleToTokens(
  options: ShadowScaleOptions,
  prefix = 'shadow',
): FlatTokenMap {
  const scale = generateShadowScale(options);
  const tokens: FlatTokenMap = {};

  for (const [key, shadow] of Object.entries(scale)) {
    tokens[`${prefix}-${key}`] = shadow.value;
  }

  return tokens;
}

/**
 * Generates CSS custom properties for a shadow scale.
 */
export function generateShadowCSS(
  options: ShadowScaleOptions,
  prefix = 'shadow',
  cssPrefix = 'pw',
): string {
  const tokens = shadowScaleToTokens(options, prefix);
  return generateCSS(tokens, cssPrefix);
}

/**
 * Returns the CSS variable name for a given shadow step.
 */
export function shadowVar(step: string, prefix = 'shadow', cssPrefix = 'pw'): string {
  return `var(${tokenKeyToCSSVar(`${prefix}-${step}`, cssPrefix)})`;
}

/**
 * Returns an object mapping each shadow step to its corresponding CSS variable reference.
 * Useful for generating utility classes or consuming the full scale at once.
 *
 * @example
 * // { sm: 'var(--pw-shadow-sm)', md: 'var(--pw-shadow-md)', ... }
 * const vars = shadowVarMap(options);
 */
export function shadowVarMap(
  options: ShadowScaleOptions,
  prefix = 'shadow',
  cssPrefix = 'pw',
): Record<string, string> {
  const scale = generateShadowScale(options);
  return Object.fromEntries(
    Object.keys(scale).map((step) => [step, shadowVar(step, prefix, cssPrefix)]),
  );
}
