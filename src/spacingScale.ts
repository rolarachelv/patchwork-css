import { DesignTokens } from './types';

export type SpacingStrategy = 'linear' | 'exponential' | 'fibonacci';

export interface SpacingScaleOptions {
  base: number;
  steps: number;
  strategy?: SpacingStrategy;
  unit?: 'rem' | 'px';
}

/**
 * Generates a spacing scale using the chosen strategy.
 */
export function generateSpacingScale(options: SpacingScaleOptions): DesignTokens {
  const { base, steps, strategy = 'linear', unit = 'rem' } = options;

  if (base <= 0) throw new Error('base must be a positive number');
  if (steps < 1) throw new Error('steps must be at least 1');

  const values = buildValues(base, steps, strategy);
  const spacing: Record<string, string> = {};

  values.forEach((value, index) => {
    const key = String((index + 1) * (strategy === 'linear' ? 1 : 1));
    spacing[key] = `${round(value)}${unit}`;
  });

  return { spacing };
}

function buildValues(base: number, steps: number, strategy: SpacingStrategy): number[] {
  switch (strategy) {
    case 'linear':
      return Array.from({ length: steps }, (_, i) => base * (i + 1));

    case 'exponential':
      return Array.from({ length: steps }, (_, i) => base * Math.pow(2, i));

    case 'fibonacci': {
      const fibs = fibSequence(steps);
      const scale = base / fibs[0];
      return fibs.map(f => f * scale);
    }
  }
}

function fibSequence(length: number): number[] {
  const seq = [1, 1];
  while (seq.length < length) {
    seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  }
  return seq.slice(0, length);
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
