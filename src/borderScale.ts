import { DesignToken } from './types';

export interface BorderScaleOptions {
  baseRadius?: number;
  radiusSteps?: number;
  radiusUnit?: 'px' | 'rem';
  widths?: number[];
  widthUnit?: 'px';
}

const DEFAULT_OPTIONS: Required<BorderScaleOptions> = {
  baseRadius: 4,
  radiusSteps: 6,
  radiusUnit: 'px',
  widths: [1, 2, 4, 8],
  widthUnit: 'px',
};

export function generateBorderScale(
  options: BorderScaleOptions = {}
): Record<string, DesignToken> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const tokens: Record<string, DesignToken> = {};

  // Radius tokens: none, sm, md, lg, xl, 2xl, full
  tokens['border-radius-none'] = { value: '0px', type: 'border-radius' };

  for (let i = 1; i <= opts.radiusSteps; i++) {
    const label = stepLabel(i, opts.radiusSteps);
    const value = roundTo(opts.baseRadius * Math.pow(1.5, i - 1), 2);
    tokens[`border-radius-${label}`] = {
      value: `${value}${opts.radiusUnit}`,
      type: 'border-radius',
    };
  }

  tokens['border-radius-full'] = { value: '9999px', type: 'border-radius' };

  // Width tokens
  opts.widths.forEach((w) => {
    tokens[`border-width-${w}`] = {
      value: `${w}${opts.widthUnit}`,
      type: 'border-width',
    };
  });

  return tokens;
}

export function stepLabel(index: number, total: number): string {
  const labels = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
  if (total <= labels.length) {
    return labels[index - 1] ?? `step-${index}`;
  }
  return `step-${index}`;
}

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
