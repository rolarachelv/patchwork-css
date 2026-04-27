export type TokenValue = string | number;

export type DesignTokens = {
  [key: string]: TokenValue | DesignTokens;
};

export type FlatTokens = Record<string, TokenValue>;

export type MediaQueryConfig = Record<string, string>;

export interface ThemeConfig {
  /** Base design tokens applied globally. */
  tokens: DesignTokens;
  /** Optional breakpoint-scoped token overrides. */
  breakpoints?: Record<string, string | { min?: string; max?: string }>;
  /** Optional named themes (e.g. dark mode). */
  themes?: Record<string, DesignTokens>;
}

export interface PatchworkConfig {
  /** Output file path for the generated CSS. */
  output: string;
  /** CSS selector to scope root custom properties. Defaults to ':root'. */
  selector?: string;
  /** One or more theme configurations. */
  theme: ThemeConfig;
}

export interface ParsedTokens {
  flat: FlatTokens;
  raw: DesignTokens;
}

export interface GeneratedOutput {
  css: string;
  mediaQueries: string;
  themes: Record<string, string>;
}
