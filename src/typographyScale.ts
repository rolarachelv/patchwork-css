import { DesignTokens } from './types';

export interface TypographyScaleOptions {
  baseSize: number;
  ratio: number;
  steps: number[];
  unit?: 'rem' | 'em' | 'px';
}

export interface TypographyScaleResult {
  tokens: DesignTokens;
  scale: Record<string, number>;
}

/**
 * Generates a modular typographic scale from a base size and ratio.
 */
export function generateTypographyScale(
  options: TypographyScaleOptions
): TypographyScaleResult {
  const { baseSize, ratio, steps, unit = 'rem' } = options;

  if (baseSize <= 0) throw new Error('baseSize must be a positive number');
  if (ratio <= 0) throw new Error('ratio must be a positive number');
  if (!steps.length) throw new Error('steps must be a non-empty array');

  const scale: Record<string, number> = {};
  const tokens: DesignTokens = { typography: { fontSize: {} } };

  for (const step of steps) {
    const value = roundTo(baseSize * Math.pow(ratio, step), 4);
    const label = stepLabel(step);
    scale[label] = value;
    (tokens.typography as any).fontSize[label] = `${value}${unit}`;
  }

  return { tokens, scale };
}

/**
 * Converts a numeric step index to a human-readable label.
 * e.g. -1 -> 'xs', 0 -> 'base', 1 -> 'lg'
 */
export function stepLabel(step: number): string {
  const labels: Record<number, string> = {
    '-3': 'xxs',
    '-2': 'xs',
    '-1': 'sm',
    '0': 'base',
    '1': 'lg',
    '2': 'xl',
    '3': '2xl',
    '4': '3xl',
    '5': '4xl',
  };
  return labels[String(step)] ?? (step < 0 ? `n${Math.abs(step)}` : `p${step}`);
}

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
