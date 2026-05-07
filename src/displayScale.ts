export type DisplayValue =
  | 'block'
  | 'inline'
  | 'inline-block'
  | 'flex'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'none'
  | 'contents'
  | 'flow-root'
  | 'table'
  | 'table-cell'
  | 'table-row';

export interface DisplayScaleConfig {
  prefix?: string;
  values?: DisplayValue[];
}

export interface DisplayToken {
  key: string;
  value: DisplayValue;
}

const DEFAULT_VALUES: DisplayValue[] = [
  'block',
  'inline',
  'inline-block',
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
  'none',
  'contents',
  'flow-root',
];

export function generateDisplayScale(config: DisplayScaleConfig = {}): DisplayToken[] {
  const values = config.values ?? DEFAULT_VALUES;
  return values.map((value) => ({ key: value, value }));
}

export function displayScaleToTokens(
  tokens: DisplayToken[],
  prefix = 'display'
): Record<string, string> {
  return Object.fromEntries(tokens.map(({ key, value }) => [`${prefix}-${key}`, value]));
}

export function displayVar(key: string, prefix = 'display'): string {
  return `var(--${prefix}-${key})`;
}

export function generateDisplayCSS(
  tokens: DisplayToken[],
  prefix = 'display'
): string {
  const declarations = tokens
    .map(({ key, value }) => `  --${prefix}-${key}: ${value};`)
    .join('\n');
  return `:root {\n${declarations}\n}`;
}
