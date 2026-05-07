/**
 * textTransformScale.ts
 * Generates text-transform design tokens and CSS custom properties.
 */

export type TextTransformValue =
  | 'none'
  | 'uppercase'
  | 'lowercase'
  | 'capitalize'
  | 'full-width'
  | 'full-size-kana';

export interface TextTransformScaleConfig {
  values?: TextTransformValue[];
  prefix?: string;
}

export interface TextTransformScale {
  [key: string]: TextTransformValue;
}

const DEFAULT_VALUES: TextTransformValue[] = [
  'none',
  'uppercase',
  'lowercase',
  'capitalize',
];

export function generateTextTransformScale(
  config: TextTransformScaleConfig = {}
): TextTransformScale {
  const values = config.values ?? DEFAULT_VALUES;
  const scale: TextTransformScale = {};
  for (const value of values) {
    const key = value === 'none' ? 'none' : value;
    scale[key] = value;
  }
  return scale;
}

export function textTransformScaleToTokens(
  scale: TextTransformScale,
  prefix = 'text-transform'
): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const [key, value] of Object.entries(scale)) {
    tokens[`${prefix}-${key}`] = value;
  }
  return tokens;
}

export function textTransformVar(key: string, prefix = 'text-transform'): string {
  return `var(--${prefix}-${key})`;
}

export function generateTextTransformCSS(
  scale: TextTransformScale,
  prefix = 'text-transform',
  selector = ':root'
): string {
  const tokens = textTransformScaleToTokens(scale, prefix);
  const declarations = Object.entries(tokens)
    .map(([token, value]) => `  --${token}: ${value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
