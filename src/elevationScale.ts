export interface ElevationStep {
  level: number;
  label: string;
  boxShadow: string;
}

export interface ElevationScaleConfig {
  steps?: number;
  baseBlur?: number;
  baseSpread?: number;
  baseOffsetY?: number;
  baseOpacity?: number;
  color?: string;
}

export interface ElevationScale {
  steps: ElevationStep[];
}

function roundTo(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

function stepLabel(index: number, total: number): string {
  if (total <= 1) return 'base';
  if (index === 0) return 'none';
  if (index === total - 1) return 'high';
  return `level-${index}`;
}

export function generateElevationScale(config: ElevationScaleConfig = {}): ElevationScale {
  const {
    steps = 6,
    baseBlur = 4,
    baseSpread = -1,
    baseOffsetY = 2,
    baseOpacity = 0.12,
    color = '0,0,0',
  } = config;

  const result: ElevationStep[] = [];

  for (let i = 0; i < steps; i++) {
    const factor = i === 0 ? 0 : i;
    const blur = roundTo(baseBlur * factor);
    const spread = roundTo(baseSpread * factor);
    const offsetY = roundTo(baseOffsetY * factor);
    const opacity = roundTo(Math.min(baseOpacity * (1 + factor * 0.15), 0.5));

    const boxShadow =
      i === 0
        ? 'none'
        : `0 ${offsetY}px ${blur}px ${spread}px rgba(${color},${opacity})`;

    result.push({
      level: i,
      label: stepLabel(i, steps),
      boxShadow,
    });
  }

  return { steps: result };
}

export function elevationScaleToTokens(scale: ElevationScale): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const step of scale.steps) {
    tokens[`elevation-${step.label}`] = step.boxShadow;
  }
  return tokens;
}

export function elevationVar(label: string): string {
  return `var(--elevation-${label})`;
}

export function generateElevationCSS(scale: ElevationScale, selector = ':root'): string {
  const tokens = elevationScaleToTokens(scale);
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
