// ─── Token Types ────────────────────────────────────────────────────────────

export type TokenValue = string | number;

export interface TokenMap {
  [key: string]: TokenValue | TokenMap;
}

export interface FlatTokenMap {
  [key: string]: TokenValue;
}

// ─── Config Types ────────────────────────────────────────────────────────────

export interface PatchworkConfig {
  prefix?: string;
  tokens?: TokenMap;
  themes?: Record<string, TokenMap>;
  breakpoints?: Record<string, string | number>;
  typography?: TypographyScaleOptions;
  spacing?: SpacingScaleOptions;
  shadows?: ShadowScaleOptions;
  output?: OutputOptions;
}

export interface OutputOptions {
  path?: string;
  format?: 'css' | 'json' | 'both';
  minify?: boolean;
}

// ─── Scale Types ─────────────────────────────────────────────────────────────

export interface TypographyScaleOptions {
  baseSize?: number;
  ratio?: number;
  steps?: number;
  unit?: string;
}

export interface SpacingScaleOptions {
  base?: number;
  steps?: number;
  unit?: string;
  strategy?: 'linear' | 'fibonacci' | 'exponential';
}

export interface ShadowScaleOptions {
  steps?: number;
  baseColor?: string;
  baseOpacity?: number;
  baseBlur?: number;
  baseSpread?: number;
  baseOffsetY?: number;
  opacityStep?: number;
  blurStep?: number;
  offsetYStep?: number;
}

export interface ShadowToken {
  value: string;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
}

// ─── Theme Types ─────────────────────────────────────────────────────────────

export interface ThemeConfig {
  base: TokenMap;
  overrides?: Record<string, TokenMap>;
}
