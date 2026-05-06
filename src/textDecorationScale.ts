export interface TextDecorationScaleOptions {
  prefix?: string;
  lines?: string[];
  styles?: string[];
  thicknesses?: number[];
  unit?: string;
}

export interface TextDecorationToken {
  line: string;
  style: string;
  thickness: number;
  unit: string;
  value: string;
}

export type TextDecorationScale = Record<string, TextDecorationToken>;

const DEFAULT_LINES = ['none', 'underline', 'overline', 'line-through'];
const DEFAULT_STYLES = ['solid', 'dashed', 'dotted', 'wavy'];
const DEFAULT_THICKNESSES = [1, 2, 4];

export function generateTextDecorationScale(
  options: TextDecorationScaleOptions = {}
): TextDecorationScale {
  const {
    lines = DEFAULT_LINES,
    styles = DEFAULT_STYLES,
    thicknesses = DEFAULT_THICKNESSES,
    unit = 'px',
  } = options;

  const scale: TextDecorationScale = {};

  for (const line of lines) {
    if (line === 'none') {
      scale['none'] = { line: 'none', style: '', thickness: 0, unit, value: 'none' };
      continue;
    }
    for (const style of styles) {
      for (const thickness of thicknesses) {
        const key = `${line}-${style}-${thickness}`;
        const value = `${line} ${style} ${thickness}${unit}`;
        scale[key] = { line, style, thickness, unit, value };
      }
    }
  }

  return scale;
}

export function textDecorationScaleToTokens(
  scale: TextDecorationScale,
  prefix = 'text-decoration'
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(scale).map(([key, token]) => [`${prefix}-${key}`, token.value])
  );
}

export function textDecorationVar(key: string, prefix = 'text-decoration'): string {
  return `var(--${prefix}-${key})`;
}

export function generateTextDecorationCSS(
  scale: TextDecorationScale,
  prefix = 'text-decoration'
): string {
  const declarations = Object.entries(scale)
    .map(([key, token]) => `  --${prefix}-${key}: ${token.value};`)
    .join('\n');
  return `:root {\n${declarations}\n}`;
}
