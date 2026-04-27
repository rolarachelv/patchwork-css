/**
 * Raw JSON config shape accepted by patchwork-css.
 * Supports arbitrary nesting; leaf values must be strings or numbers.
 */
export type DesignConfig = {
  [key: string]: string | number | DesignConfig;
};

/**
 * Flat map of token key → string value produced after parsing.
 * Keys use kebab-case dot-flattened notation (e.g. "color-primary-500").
 */
export type DesignTokens = Record<string, string>;

/**
 * Options for CSS custom property generation.
 */
export interface CSSGeneratorOptions {
  /** Prefix prepended to every CSS variable name. Defaults to "pw". */
  prefix?: string;
  /** Selector that wraps the :root block. Defaults to ":root". */
  selector?: string;
}
