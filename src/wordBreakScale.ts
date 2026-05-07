export type WordBreakValue =
  | 'normal'
  | 'break-all'
  | 'keep-all'
  | 'break-word'
  | 'inherit'
  | 'initial'
  | 'unset';

export interface WordBreakScaleOptions {
  values?: WordBreakValue[];
  prefix?: string;
}

export interface WordBreakToken {
  name: string;
  value: WordBreakValue;
  variable: string;
}

const DEFAULT_VALUES: WordBreakValue[] = [
  'normal',
  'break-all',
  'keep-all',
  'break-word',
];

export function generateWordBreakScale(
  options: WordBreakScaleOptions = {}
): WordBreakToken[] {
  const { values = DEFAULT_VALUES, prefix = 'word-break' } = options;
  return values.map((value) => ({
    name: `${prefix}-${value}`,
    value,
    variable: `--${prefix}-${value}`,
  }));
}

export function wordBreakScaleToTokens(
  tokens: WordBreakToken[]
): Record<string, string> {
  return tokens.reduce<Record<string, string>>((acc, token) => {
    acc[token.name] = token.value;
    return acc;
  }, {});
}

export function wordBreakVar(value: WordBreakValue, prefix = 'word-break'): string {
  return `var(--${prefix}-${value})`;
}

export function generateWordBreakCSS(
  tokens: WordBreakToken[],
  selector = ':root'
): string {
  const declarations = tokens
    .map((t) => `  ${t.variable}: ${t.value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
