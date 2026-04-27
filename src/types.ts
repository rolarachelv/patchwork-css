/**
 * A nested object of token values (strings or further nested objects).
 */
export type TokenMap = {
  [key: string]: string | TokenMap;
};

/**
 * A flat map of dot-notation token keys to their string values.
 */
export type FlatTokenMap = Record<string, string>;

/**
 * The top-level configuration object loaded from a JSON config file.
 */
export interface PatchworkConfig {
  /** Optional prefix for all CSS custom properties (e.g. "pw" → --pw-color-primary) */
  prefix?: string;
  /** Design tokens organized by category */
  tokens: TokenMap;
  /** Optional theme overrides keyed by theme name */
  themes?: Record<string, TokenMap>;
  /** Output file path for generated CSS */
  output?: string;
}

/**
 * Options passed to the CSS generator.
 */
export interface GeneratorOptions {
  prefix?: string;
  selector?: string;
}
