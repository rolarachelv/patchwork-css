export interface LetterSpacingScaleOptions {
  steps?: number;
  base?: number;
  unit?: string;
  ratio?: number;
}

export interface LetterSpacingStep {
  label: string;
  value: number;
  unit: string;
  css: string;
}

export interface LetterSpacingScale {
  steps: LetterSpacingStep[];
  unit: string;
  base: number;
}

function roundTo(value: number, decimals = 4): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

function stepLabel(index: number, total: number): string {
  if (total === 1) return 'base';
  const labels = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  if (total <= labels.length) return labels[index];
  return `step-${index + 1}`;
}

export function generateLetterSpacingScale(
  options: LetterSpacingScaleOptions = {}
): LetterSpacingScale {
  const {
    steps = 5,
    base = 0,
    unit = 'em',
    ratio = 0.025,
  } = options;

  const scaleSteps: LetterSpacingStep[] = Array.from({ length: steps }, (_, i) => {
    const offset = (i - Math.floor(steps / 2)) * ratio;
    const value = roundTo(base + offset);
    const label = stepLabel(i, steps);
    return {
      label,
      value,
      unit,
      css: `${value}${unit}`,
    };
  });

  return { steps: scaleSteps, unit, base };
}

export function letterSpacingScaleToTokens(
  scale: LetterSpacingScale
): Record<string, string> {
  return Object.fromEntries(
    scale.steps.map((step) => [`letter-spacing-${step.label}`, step.css])
  );
}

export function letterSpacingVar(label: string): string {
  return `var(--letter-spacing-${label})`;
}

export function generateLetterSpacingCSS(
  tokens: Record<string, string>,
  selector = ':root'
): string {
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
