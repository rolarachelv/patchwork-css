export interface DesignToken {
  value: string | number;
  type?: string;
  description?: string;
  group?: string;
  [key: string]: unknown;
}

export type TokenMap = Record<string, DesignToken>;

export interface TokenConfig {
  tokens: Record<string, unknown>;
  themes?: Record<string, Record<string, unknown>>;
  breakpoints?: Record<string, string | number>;
  options?: ConfigOptions;
}

export interface ConfigOptions {
  prefix?: string;
  outputFormat?: 'css' | 'json' | 'both';
  outputPath?: string;
  selector?: string;
}

export interface TransformOptions {
  scale?: number;
  unit?: string;
  prefix?: string;
  clamp?: {
    min: number;
    max: number;
  };
}

export interface ComposedOutput {
  css?: string;
  json?: string;
}

export interface ResolvedTokenMap extends TokenMap {
  [key: string]: DesignToken;
}
