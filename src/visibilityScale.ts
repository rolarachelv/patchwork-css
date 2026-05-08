export type VisibilityValue = 'visible' | 'hidden' | 'collapse';

export interface VisibilityScaleConfig {
  values?: VisibilityValue[];
  prefix?: string;
}

export interface VisibilityToken {
  key: string;
  value: VisibilityValue;
  cssVar: string;
}

const DEFAULT_VALUES: VisibilityValue[] = ['visible', 'hidden', 'collapse'];

export function generateVisibilityScale(
  config: VisibilityScaleConfig = {}
): VisibilityToken[] {
  const values = config.values ?? DEFAULT_VALUES;
  const prefix = config.prefix ?? 'visibility';

  return values.map((value) => ({
    key: `${prefix}-${value}`,
    value,
    cssVar: `--${prefix}-${value}`,
  }));
}

export function visibilityScaleToTokens(
  tokens: VisibilityToken[]
): Record<string, string> {
  return tokens.reduce<Record<string, string>>((acc, token) => {
    acc[token.key] = token.value;
    return acc;
  }, {});
}

export function visibilityVar(value: VisibilityValue, prefix = 'visibility'): string {
  return `var(--${prefix}-${value})`;
}

export function generateVisibilityCSS(
  tokens: VisibilityToken[],
  selector = ':root'
): string {
  const declarations = tokens
    .map((token) => `  ${token.cssVar}: ${token.value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
