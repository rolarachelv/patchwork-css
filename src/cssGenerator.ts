import { TokenMap } from './types';

export interface CSSGeneratorOptions {
  selector?: string;
  indent?: string;
  sortKeys?: boolean;
}

const DEFAULT_OPTIONS: Required<CSSGeneratorOptions> = {
  selector: ':root',
  indent: '  ',
  sortKeys: false,
};

/**
 * Converts a flat token map into a CSS custom properties string.
 *
 * @param tokens - Flat map of token paths to their values
 * @param options - Optional formatting options
 * @returns A CSS string containing custom property declarations
 */
export function generateCSS(
  tokens: TokenMap,
  options: CSSGeneratorOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  let keys = Object.keys(tokens);
  if (opts.sortKeys) {
    keys = keys.sort();
  }

  if (keys.length === 0) {
    return `${opts.selector} {\n}`;
  }

  const declarations = keys
    .map((key) => {
      const varName = tokenKeyToCSSVar(key);
      const value = tokens[key];
      return `${opts.indent}${varName}: ${value};`;
    })
    .join('\n');

  return `${opts.selector} {\n${declarations}\n}`;
}

/**
 * Converts a dot-separated token key to a CSS custom property name.
 * e.g. "color.primary.500" -> "--color-primary-500"
 */
export function tokenKeyToCSSVar(key: string): string {
  const sanitized = key
    .replace(/\./g, '-')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `--${sanitized}`;
}
