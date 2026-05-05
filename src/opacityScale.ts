/**
 * Generates a consistent opacity scale and related CSS custom properties.
 */

export interface OpacityScaleConfig {
  steps?: number;
  min?: number;
  max?: number;
  prefix?: string;
}

export interface OpacityStep {
  label: string;
  value: number;
}

export interface OpacityScale {
  steps: OpacityStep[];
}

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function stepLabel(index: number, total: number, prefix: string): string {
  if (total === 1) return `${prefix}-100`;
  const percentage = Math.round((index / (total - 1)) * 100);
  return `${prefix}-${percentage}`;
}

export function generateOpacityScale(config: OpacityScaleConfig = {}): OpacityScale {
  const {
    steps = 5,
    min = 0,
    max = 1,
    prefix = 'opacity',
  } = config;

  if (steps < 1) throw new Error('steps must be at least 1');
  if (min < 0 || min > 1) throw new Error('min must be between 0 and 1');
  if (max < 0 || max > 1) throw new Error('max must be between 0 and 1');
  if (min >= max) throw new Error('min must be less than max');

  const result: OpacityStep[] = [];

  for (let i = 0; i < steps; i++) {
    const raw = steps === 1 ? max : min + (i / (steps - 1)) * (max - min);
    const value = roundTo(raw, 4);
    const label = stepLabel(i, steps, prefix);
    result.push({ label, value });
  }

  return { steps: result };
}

export function opacityScaleToTokens(scale: OpacityScale): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const step of scale.steps) {
    tokens[step.label] = String(step.value);
  }
  return tokens;
}

export function generateOpacityCSS(scale: OpacityScale, prefix = 'opacity'): string {
  const lines: string[] = [':root {'];
  for (const step of scale.steps) {
    const varName = `--${step.label.replace(/[^a-z0-9-]/gi, '-')}`;
    lines.push(`  ${varName}: ${step.value};`);
  }
  lines.push('}');
  return lines.join('\n');
}

export function opacityVar(label: string): string {
  return `var(--${label.replace(/[^a-z0-9-]/gi, '-')})`;
}
