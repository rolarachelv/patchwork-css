import { parseTokens } from './tokenParser';
import { generateCSS } from './cssGenerator';
import { TokenConfig, ThemeOptions, ThemeOutput } from './types';

/**
 * Builds a complete theme from a token config object.
 * Returns both the CSS string and the flat token map.
 */
export function buildTheme(
  config: TokenConfig,
  options: ThemeOptions = {}
): ThemeOutput {
  const { selector = ':root', prefix = '' } = options;

  const flatTokens = parseTokens(config, prefix);
  const css = generateCSS(flatTokens, { selector });

  return {
    tokens: flatTokens,
    css,
    selector,
  };
}

/**
 * Merges multiple token configs into one theme.
 * Later configs override earlier ones on key collision.
 */
export function mergeThemes(
  configs: TokenConfig[],
  options: ThemeOptions = {}
): ThemeOutput {
  const merged: TokenConfig = configs.reduce(
    (acc, config) => deepMerge(acc, config),
    {} as TokenConfig
  );
  return buildTheme(merged, options);
}

function deepMerge(target: TokenConfig, source: TokenConfig): TokenConfig {
  const result: TokenConfig = { ...target };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];
    if (
      typeof srcVal === 'object' &&
      srcVal !== null &&
      typeof tgtVal === 'object' &&
      tgtVal !== null
    ) {
      result[key] = deepMerge(tgtVal as TokenConfig, srcVal as TokenConfig);
    } else {
      result[key] = srcVal;
    }
  }
  return result;
}
