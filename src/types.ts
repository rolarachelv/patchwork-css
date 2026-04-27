export type TokenValue = string | number;

export interface TokenConfig {
  [key: string]: TokenValue | TokenConfig;
}

export type FlatTokenMap = Record<string, TokenValue>;

export interface CSSGeneratorOptions {
  selector?: string;
}

export interface ThemeOptions {
  /** CSS selector to scope the custom properties under. Defaults to ':root' */
  selector?: string;
  /** Optional prefix prepended to all token keys */
  prefix?: string;
}

export interface ThemeOutput {
  /** Flat map of token key -> value */
  tokens: FlatTokenMap;
  /** Generated CSS string */
  css: string;
  /** The selector used in the CSS output */
  selector: string;
}
