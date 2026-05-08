export interface BoxShadowStep {
  label: string;
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius: number;
  color: string;
  value: string;
}

export interface BoxShadowScaleConfig {
  steps?: number;
  baseOffsetY?: number;
  baseBlur?: number;
  baseSpread?: number;
  color?: string;
  prefix?: string;
}

function roundTo(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

function stepLabel(index: number, total: number): string {
  if (total <= 1) return 'default';
  const labels = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
  if (total <= labels.length) return labels[index];
  return `step-${index + 1}`;
}

export function generateBoxShadowScale(config: BoxShadowScaleConfig = {}): BoxShadowStep[] {
  const {
    steps = 5,
    baseOffsetY = 2,
    baseBlur = 4,
    baseSpread = 0,
    color = 'rgba(0,0,0,0.15)',
  } = config;

  return Array.from({ length: steps }, (_, i) => {
    const factor = i + 1;
    const offsetX = 0;
    const offsetY = roundTo(baseOffsetY * factor);
    const blurRadius = roundTo(baseBlur * factor);
    const spreadRadius = roundTo(baseSpread * factor);
    const label = stepLabel(i, steps);
    const value = `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${color}`;

    return { label, offsetX, offsetY, blurRadius, spreadRadius, color, value };
  });
}

export function boxShadowScaleToTokens(
  scale: BoxShadowStep[],
  prefix = 'box-shadow'
): Record<string, string> {
  return Object.fromEntries(
    scale.map(step => [`${prefix}-${step.label}`, step.value])
  );
}

export function boxShadowVar(label: string, prefix = 'box-shadow'): string {
  return `var(--${prefix}-${label})`;
}

export function generateBoxShadowCSS(
  tokens: Record<string, string>,
  selector = ':root'
): string {
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
