export type OverflowValue =
  | 'visible'
  | 'hidden'
  | 'clip'
  | 'scroll'
  | 'auto'
  | 'overlay';

export interface OverflowScaleConfig {
  values?: OverflowValue[];
  prefix?: string;
  includeAxes?: boolean;
}

export interface OverflowToken {
  key: string;
  value: OverflowValue;
  axis?: 'x' | 'y' | null;
}

const DEFAULT_VALUES: OverflowValue[] = ['visible', 'hidden', 'clip', 'scroll', 'auto'];

export function generateOverflowScale(config: OverflowScaleConfig = {}): OverflowToken[] {
  const values = config.values ?? DEFAULT_VALUES;
  const includeAxes = config.includeAxes ?? true;
  const tokens: OverflowToken[] = [];

  for (const value of values) {
    tokens.push({ key: value, value, axis: null });
    if (includeAxes) {
      tokens.push({ key: `${value}-x`, value, axis: 'x' });
      tokens.push({ key: `${value}-y`, value, axis: 'y' });
    }
  }

  return tokens;
}

export function overflowScaleToTokens(
  tokens: OverflowToken[],
  prefix = 'overflow'
): Record<string, string> {
  return Object.fromEntries(
    tokens.map((t) => [`${prefix}-${t.key}`, t.value])
  );
}

export function overflowVar(key: string, prefix = 'overflow'): string {
  return `var(--${prefix}-${key})`;
}

export function generateOverflowCSS(
  tokens: Record<string, string>,
  selector = ':root'
): string {
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
