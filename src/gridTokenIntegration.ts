import { generateGridScale, gridScaleToTokens, generateGridCSS, GridScaleConfig } from './gridScale';

export interface GridIntegrationResult {
  tokens: Record<string, string>;
  css: string;
}

/**
 * High-level helper: generate a grid scale from config, convert to tokens,
 * and emit CSS — all in one call.
 */
export function buildGridTokens(
  config: GridScaleConfig,
  selector = ':root'
): GridIntegrationResult {
  const scale = generateGridScale(config);
  const tokens = gridScaleToTokens(scale);
  const css = generateGridCSS(tokens, selector);
  return { tokens, css };
}

/**
 * Merge multiple grid token maps into a single flat token record.
 * Later maps win on key collision.
 */
export function mergeGridTokens(
  ...tokenMaps: Array<Record<string, string>>
): Record<string, string> {
  return Object.assign({}, ...tokenMaps);
}

/**
 * Return only the tokens whose keys match a given prefix segment.
 * e.g. filterGridTokens(tokens, 'columns') returns column-related tokens.
 */
export function filterGridTokens(
  tokens: Record<string, string>,
  segment: string
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).filter(([key]) => key.includes(segment))
  );
}
