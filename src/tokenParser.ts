import { DesignConfig, DesignTokens } from './types';

/**
 * Parses a raw JSON config object into a flat map of design tokens.
 * Supports nested objects using dot-notation keys.
 */
export function parseTokens(config: DesignConfig): DesignTokens {
  const tokens: DesignTokens = {};

  function flatten(obj: Record<string, unknown>, prefix: string): void {
    for (const [key, value] of Object.entries(obj)) {
      const tokenKey = prefix ? `${prefix}-${key}` : key;

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        flatten(value as Record<string, unknown>, tokenKey);
      } else if (typeof value === 'string' || typeof value === 'number') {
        tokens[tokenKey] = String(value);
      } else {
        console.warn(`[patchwork-css] Skipping unsupported token value at "${tokenKey}": ${JSON.stringify(value)}`);
      }
    }
  }

  flatten(config as Record<string, unknown>, '');
  return tokens;
}
