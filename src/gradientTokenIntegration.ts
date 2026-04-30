import { generateGradientScale, GradientScaleOptions, GradientStep } from './gradientScale';

export interface GradientTokenMap {
  [key: string]: string;
}

/**
 * Converts a gradient scale into a flat token map.
 */
export function gradientScaleToTokens(
  options: GradientScaleOptions,
  prefix = 'gradient'
): GradientTokenMap {
  const scale = generateGradientScale(options);
  const tokens: GradientTokenMap = {};

  for (const step of scale) {
    const key = `${prefix}-${step.label}`;
    tokens[key] = step.value;
  }

  return tokens;
}

/**
 * Returns the CSS custom property name for a gradient step.
 */
export function gradientVar(label: string, prefix = 'gradient'): string {
  return `var(--${prefix}-${label})`;
}

/**
 * Returns a map of label -> CSS var reference for all steps in a scale.
 */
export function gradientVarMap(
  options: GradientScaleOptions,
  prefix = 'gradient'
): Record<string, string> {
  const scale = generateGradientScale(options);
  const map: Record<string, string> = {};

  for (const step of scale) {
    map[step.label] = gradientVar(step.label, prefix);
  }

  return map;
}

/**
 * Generates a CSS block of custom properties for a gradient scale.
 */
export function generateGradientCSS(
  options: GradientScaleOptions,
  prefix = 'gradient',
  selector = ':root'
): string {
  const tokens = gradientScaleToTokens(options, prefix);
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');

  return `${selector} {\n${declarations}\n}`;
}
