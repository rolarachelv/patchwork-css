import { generateElevationScale, elevationScaleToTokens, ElevationScaleConfig } from './elevationScale';

export interface ElevationTokenConfig {
  steps?: number;
  baseBlur?: number;
  baseSpread?: number;
  baseOffsetY?: number;
  baseOpacity?: number;
  color?: string;
  selector?: string;
}

export function buildElevationTokens(
  config: ElevationTokenConfig = {}
): Record<string, string> {
  const scaleConfig: ElevationScaleConfig = {
    steps: config.steps,
    baseBlur: config.baseBlur,
    baseSpread: config.baseSpread,
    baseOffsetY: config.baseOffsetY,
    baseOpacity: config.baseOpacity,
    color: config.color,
  };
  const scale = generateElevationScale(scaleConfig);
  return elevationScaleToTokens(scale);
}

export function mergeElevationTokens(
  base: Record<string, string>,
  overrides: Record<string, string>
): Record<string, string> {
  return { ...base, ...overrides };
}

export function filterElevationTokens(
  tokens: Record<string, string>,
  predicate: (key: string, value: string) => boolean
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).filter(([k, v]) => predicate(k, v))
  );
}

export function generateElevationCSSFromConfig(
  config: ElevationTokenConfig = {}
): string {
  const tokens = buildElevationTokens(config);
  const selector = config.selector ?? ':root';
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
