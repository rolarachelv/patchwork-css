export type ListStyleType =
  | 'none'
  | 'disc'
  | 'circle'
  | 'square'
  | 'decimal'
  | 'decimal-leading-zero'
  | 'lower-roman'
  | 'upper-roman'
  | 'lower-alpha'
  | 'upper-alpha';

export interface ListStyleScaleConfig {
  types?: ListStyleType[];
  prefix?: string;
}

export interface ListStyleToken {
  name: string;
  value: string;
}

const DEFAULT_TYPES: ListStyleType[] = [
  'none',
  'disc',
  'circle',
  'square',
  'decimal',
  'lower-roman',
  'upper-roman',
  'lower-alpha',
  'upper-alpha',
];

export function generateListStyleScale(
  config: ListStyleScaleConfig = {}
): ListStyleToken[] {
  const types = config.types ?? DEFAULT_TYPES;
  return types.map((type) => ({ name: type, value: type }));
}

export function listStyleScaleToTokens(
  tokens: ListStyleToken[],
  prefix = 'list-style'
): Record<string, string> {
  return Object.fromEntries(
    tokens.map(({ name, value }) => [`${prefix}-${name}`, value])
  );
}

export function listStyleVar(name: string, prefix = 'list-style'): string {
  return `var(--${prefix}-${name})`;
}

export function generateListStyleCSS(
  tokens: Record<string, string>,
  selector = ':root'
): string {
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
