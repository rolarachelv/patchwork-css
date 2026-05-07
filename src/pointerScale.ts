/**
 * pointerScale.ts
 * Generates pointer/touch target size tokens for accessibility-compliant tap targets.
 */

export interface PointerScaleConfig {
  base?: number;
  steps?: number;
  unit?: string;
  prefix?: string;
}

export interface PointerScaleStep {
  label: string;
  size: number;
  unit: string;
  value: string;
}

function roundTo(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

function stepLabel(index: number, total: number): string {
  if (total === 1) return 'md';
  const labels = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  return labels[index] ?? `step-${index}`;
}

export function generatePointerScale(config: PointerScaleConfig = {}): PointerScaleStep[] {
  const base = config.base ?? 44;
  const steps = config.steps ?? 4;
  const unit = config.unit ?? 'px';

  return Array.from({ length: steps }, (_, i) => {
    const multiplier = 0.75 + i * 0.25;
    const size = roundTo(base * multiplier);
    return {
      label: stepLabel(i, steps),
      size,
      unit,
      value: `${size}${unit}`,
    };
  });
}

export function pointerScaleToTokens(
  scale: PointerScaleStep[],
  prefix = 'pointer'
): Record<string, string> {
  return Object.fromEntries(
    scale.map((step) => [`${prefix}-${step.label}`, step.value])
  );
}

export function pointerVar(label: string, prefix = 'pointer'): string {
  return `var(--${prefix}-${label})`;
}

export function generatePointerCSS(
  scale: PointerScaleStep[],
  prefix = 'pointer',
  selector = ':root'
): string {
  const declarations = scale
    .map((step) => `  --${prefix}-${step.label}: ${step.value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
