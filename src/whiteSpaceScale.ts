export type WhiteSpaceValue =
  | 'normal'
  | 'nowrap'
  | 'pre'
  | 'pre-wrap'
  | 'pre-line'
  | 'break-spaces';

export interface WhiteSpaceScaleConfig {
  values?: WhiteSpaceValue[];
  prefix?: string;
}

export interface WhiteSpaceToken {
  key: string;
  value: WhiteSpaceValue;
  cssVar: string;
}

const DEFAULT_VALUES: WhiteSpaceValue[] = [
  'normal',
  'nowrap',
  'pre',
  'pre-wrap',
  'pre-line',
  'break-spaces',
];

export function generateWhiteSpaceScale(
  config: WhiteSpaceScaleConfig = {}
): WhiteSpaceToken[] {
  const values = config.values ?? DEFAULT_VALUES;
  const prefix = config.prefix ?? 'white-space';

  return values.map((value) => ({
    key: `${prefix}-${value.replace(/\s+/g, '-')}`,
    value,
    cssVar: `--${prefix}-${value.replace(/\s+/g, '-')}`,
  }));
}

export function whiteSpaceScaleToTokens(
  scale: WhiteSpaceToken[]
): Record<string, string> {
  return Object.fromEntries(scale.map((t) => [t.key, t.value]));
}

export function whiteSpaceVar(value: WhiteSpaceValue, prefix = 'white-space'): string {
  return `var(--${prefix}-${value.replace(/\s+/g, '-')})`;
}

export function generateWhiteSpaceCSS(
  config: WhiteSpaceScaleConfig = {}
): string {
  const scale = generateWhiteSpaceScale(config);
  const declarations = scale
    .map((t) => `  ${t.cssVar}: ${t.value};`)
    .join('\n');
  return `:root {\n${declarations}\n}`;
}
