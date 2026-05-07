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

/**
 * Looks up a border token value from a BorderScale by label.
 * Returns undefined if the label does not match any step.
 *
 * @param scale - The BorderScale to search.
 * @param label - The step label to look up (e.g. 'sm', 'md').
 * @param type  - Whether to retrieve the 'radius' or 'width' value.
 */
export function getBorderTokenValue(
  scale: BorderScale,
  label: string,
  type: 'radius' | 'width'
): string | undefined {
  const step = scale.steps.find((s: BorderScaleStep) => s.label === label);
  if (!step) return undefined;
  return type === 'radius' ? `${step.radius}px` : `${step.width}px`;
}

/**
 * Returns all step labels defined in a BorderScale.
 * Useful for iterating over available token names or validating label inputs.
 *
 * @param scale - The BorderScale to extract labels from.
 * @returns An array of label strings in the order they appear in the scale.
 */
export function getBorderScaleLabels(scale: BorderScale): string[] {
  return scale.steps.map((step: BorderScaleStep) => step.label);
}
