export type PositionValue = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

export interface PositionScaleConfig {
  values?: PositionValue[];
  prefix?: string;
}

export interface PositionToken {
  key: string;
  value: PositionValue;
  cssVar: string;
}

const DEFAULT_POSITIONS: PositionValue[] = [
  'static',
  'relative',
  'absolute',
  'fixed',
  'sticky',
];

export function generatePositionScale(config: PositionScaleConfig = {}): PositionToken[] {
  const values = config.values ?? DEFAULT_POSITIONS;
  const prefix = config.prefix ?? 'position';

  return values.map((value) => ({
    key: `${prefix}-${value}`,
    value,
    cssVar: `--${prefix}-${value}`,
  }));
}

export function positionScaleToTokens(
  tokens: PositionToken[]
): Record<string, string> {
  return Object.fromEntries(tokens.map((t) => [t.key, t.value]));
}

export function positionVar(value: PositionValue, prefix = 'position'): string {
  return `var(--${prefix}-${value})`;
}

export function generatePositionCSS(
  tokens: PositionToken[],
  selector = ':root'
): string {
  const declarations = tokens
    .map((t) => `  ${t.cssVar}: ${t.value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
