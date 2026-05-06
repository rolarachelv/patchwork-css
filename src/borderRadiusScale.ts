export interface BorderRadiusScaleOptions {
  steps?: number;
  base?: number;
  unit?: string;
  includeRound?: boolean;
  includeFull?: boolean;
  prefix?: string;
}

export interface BorderRadiusStep {
  label: string;
  value: string;
}

export interface BorderRadiusScale {
  steps: BorderRadiusStep[];
  round?: string;
  full?: string;
}

function roundTo(value: number, decimals = 4): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

function stepLabel(index: number, steps: number): string {
  if (steps <= 1) return 'default';
  const labels = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
  return labels[index] ?? `step-${index + 1}`;
}

export function generateBorderRadiusScale(options: BorderRadiusScaleOptions = {}): BorderRadiusScale {
  const {
    steps = 5,
    base = 4,
    unit = 'px',
    includeRound = true,
    includeFull = true,
  } = options;

  const scaleSteps: BorderRadiusStep[] = Array.from({ length: steps }, (_, i) => {
    const value = roundTo(base * (i + 1));
    return {
      label: stepLabel(i, steps),
      value: `${value}${unit}`,
    };
  });

  const scale: BorderRadiusScale = { steps: scaleSteps };

  if (includeRound) scale.round = '50%';
  if (includeFull) scale.full = '9999px';

  return scale;
}

export function borderRadiusScaleToTokens(
  scale: BorderRadiusScale,
  prefix = 'border-radius'
): Record<string, string> {
  const tokens: Record<string, string> = {};

  for (const step of scale.steps) {
    tokens[`${prefix}-${step.label}`] = step.value;
  }

  if (scale.round !== undefined) tokens[`${prefix}-round`] = scale.round;
  if (scale.full !== undefined) tokens[`${prefix}-full`] = scale.full;

  return tokens;
}

export function borderRadiusVar(label: string, prefix = 'border-radius'): string {
  return `var(--${prefix}-${label})`;
}

export function generateBorderRadiusCSS(
  scale: BorderRadiusScale,
  prefix = 'border-radius',
  selector = ':root'
): string {
  const tokens = borderRadiusScaleToTokens(scale, prefix);
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
