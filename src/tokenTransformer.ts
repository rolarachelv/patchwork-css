import { DesignToken, TokenMap, TransformOptions } from './types';

/**
 * Applies a series of transformations to a flat token map.
 * Supports value clamping, unit suffixing, and scale multiplication.
 */
export function transformTokens(
  tokens: TokenMap,
  options: TransformOptions = {}
): TokenMap {
  const result: TokenMap = {};

  for (const [key, token] of Object.entries(tokens)) {
    result[key] = transformToken(token, options);
  }

  return result;
}

export function transformToken(
  token: DesignToken,
  options: TransformOptions
): DesignToken {
  let value = token.value;

  if (typeof value === 'number') {
    if (options.scale !== undefined) {
      value = value * options.scale;
    }

    if (options.unit) {
      value = `${value}${options.unit}`;
    }

    if (options.clamp && typeof value === 'number') {
      const { min, max } = options.clamp;
      value = Math.min(Math.max(value, min), max);
    }
  }

  if (typeof value === 'string' && options.prefix) {
    if (!value.startsWith('$')) {
      value = `${options.prefix}${value}`;
    }
  }

  return { ...token, value };
}

export function applyTokenDefaults(
  tokens: TokenMap,
  defaults: Partial<DesignToken>
): TokenMap {
  const result: TokenMap = {};

  for (const [key, token] of Object.entries(tokens)) {
    result[key] = { ...defaults, ...token };
  }

  return result;
}
