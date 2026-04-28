import { BorderScale, BorderScaleStep } from './types';

export type BorderTokenMap = Record<string, string>;

/**
 * Converts a BorderScale into a flat token map suitable for CSS generation.
 * Adds convenience tokens: border-radius-none (0px) and border-radius-full (9999px).
 */
export function borderScaleToTokens(scale: BorderScale): BorderTokenMap {
  const tokens: BorderTokenMap = {};

  tokens['border-radius-none'] = '0px';

  scale.steps.forEach((step: BorderScaleStep) => {
    tokens[`border-radius-${step.label}`] = `${step.radius}px`;
    tokens[`border-width-${step.label}`] = `${step.width}px`;
  });

  tokens['border-radius-full'] = '9999px';

  return tokens;
}

/**
 * Generates a :root CSS block containing custom properties for all border tokens.
 */
export function generateBorderCSS(scale: BorderScale): string {
  const tokens = borderScaleToTokens(scale);
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `:root {\n${declarations}\n}`;
}

/**
 * Returns a CSS var() reference for a border-radius custom property.
 */
export function borderRadiusVar(step: number | string): string {
  return `var(--border-radius-${step})`;
}

/**
 * Returns a CSS var() reference for a border-width custom property.
 */
export function borderWidthVar(step: number | string): string {
  return `var(--border-width-${step})`;
}
