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

/**
 * Rename all token keys by replacing an old prefix with a new one.
 * Useful when integrating grid tokens into a larger design token namespace.
 *
 * e.g. renameGridTokenPrefix(tokens, '--grid', '--layout') would turn
 * '--grid-columns-2' into '--layout-columns-2'.
 */
export function renameGridTokenPrefix(
  tokens: Record<string, string>,
  oldPrefix: string,
  newPrefix: string
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [
      key.startsWith(oldPrefix) ? newPrefix + key.slice(oldPrefix.length) : key,
      value,
    ])
  );
}
