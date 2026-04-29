import { generateAnimationScale, AnimationScaleOptions } from './animationScale';
import { generateCSS } from './cssGenerator';
import { TokenMap } from './types';

export interface AnimationTokens {
  duration: Record<string, string>;
  easing: Record<string, string>;
}

/**
 * Converts an animation scale into a flat token map suitable for CSS generation.
 */
export function animationScaleToTokens(
  options: AnimationScaleOptions
): TokenMap {
  const scale = generateAnimationScale(options);
  const tokens: TokenMap = {};

  for (const step of scale) {
    tokens[`animation-duration-${step.label}`] = step.duration;
    tokens[`animation-easing-${step.label}`] = step.easing;
  }

  return tokens;
}

/**
 * Generates a CSS string of custom properties for animation tokens.
 */
export function generateAnimationCSS(
  options: AnimationScaleOptions,
  selector = ':root'
): string {
  const tokens = animationScaleToTokens(options);
  return generateCSS(tokens, selector);
}

/**
 * Returns the CSS variable reference for an animation duration step.
 */
export function animationDurationVar(label: string): string {
  return `var(--animation-duration-${label})`;
}

/**
 * Returns the CSS variable reference for an animation easing step.
 */
export function animationEasingVar(label: string): string {
  return `var(--animation-easing-${label})`;
}
