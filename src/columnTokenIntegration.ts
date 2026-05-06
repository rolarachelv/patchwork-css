import { generateColumnScale, columnScaleToTokens, generateColumnCSS, ColumnScaleConfig } from './columnScale';

export function buildColumnTokens(
  config: ColumnScaleConfig = {}
): Record<string, string> {
  const scale = generateColumnScale(config);
  return columnScaleToTokens(scale);
}

export function mergeColumnTokens(
  base: Record<string, string>,
  overrides: Record<string, string>
): Record<string, string> {
  return { ...base, ...overrides };
}

export function filterColumnTokens(
  tokens: Record<string, string>,
  predicate: (key: string, value: string) => boolean
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).filter(([key, value]) => predicate(key, value))
  );
}

export function generateColumnCSSFromConfig(config: ColumnScaleConfig = {}): string {
  const scale = generateColumnScale(config);
  return generateColumnCSS(scale);
}
