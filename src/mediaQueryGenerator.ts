import { DesignTokens, MediaQueryConfig } from './types';
import { generateCSS } from './cssGenerator';

/**
 * Generates CSS media query blocks from a breakpoints config.
 */
export function generateMediaQueries(
  tokens: DesignTokens,
  breakpoints: MediaQueryConfig
): string {
  const blocks: string[] = [];

  for (const [name, query] of Object.entries(breakpoints)) {
    const scoped = tokens[name];
    if (!scoped || typeof scoped !== 'object') continue;

    const css = generateCSS(scoped as DesignTokens, ':root');
    if (css.trim()) {
      blocks.push(`@media ${query} {\n${css}\n}`);
    }
  }

  return blocks.join('\n\n');
}

/**
 * Converts a breakpoint name to a conventional media query string.
 */
export function breakpointToMediaQuery(
  value: string | { min?: string; max?: string }
): string {
  if (typeof value === 'string') return value;

  const parts: string[] = [];
  if (value.min) parts.push(`(min-width: ${value.min})`);
  if (value.max) parts.push(`(max-width: ${value.max})`);

  return parts.join(' and ');
}

/**
 * Normalises a breakpoints map, resolving shorthand objects to query strings.
 */
export function normaliseBreakpoints(
  raw: Record<string, string | { min?: string; max?: string }>
): MediaQueryConfig {
  const result: MediaQueryConfig = {};
  for (const [key, val] of Object.entries(raw)) {
    result[key] = breakpointToMediaQuery(val);
  }
  return result;
}
