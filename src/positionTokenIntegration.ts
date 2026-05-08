import {
  generatePositionScale,
  positionScaleToTokens,
  generatePositionCSS,
  PositionScaleConfig,
  PositionToken,
} from './positionScale';

export function buildPositionTokens(
  config: PositionScaleConfig = {}
): Record<string, string> {
  const scale = generatePositionScale(config);
  return positionScaleToTokens(scale);
}

export function mergePositionTokens(
  base: Record<string, string>,
  overrides: Record<string, string>
): Record<string, string> {
  return { ...base, ...overrides };
}

export function filterPositionTokens(
  tokens: Record<string, string>,
  keys: string[]
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).filter(([key]) => keys.includes(key))
  );
}

export function generatePositionCSSFromConfig(
  config: PositionScaleConfig = {},
  selector = ':root'
): string {
  const scale = generatePositionScale(config);
  return generatePositionCSS(scale, selector);
}
