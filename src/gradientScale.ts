import { hexToRgb, withOpacity } from './colorUtils';

export interface GradientStop {
  color: string;
  position?: number;
  opacity?: number;
}

export interface GradientConfig {
  direction?: string;
  stops: GradientStop[];
}

export interface GradientScale {
  [key: string]: string;
}

export function roundTo(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

export function stepLabel(index: number, total: number): string {
  if (total === 1) return '100';
  const step = Math.round((index / (total - 1)) * 900 + 100);
  return String(step);
}

export function buildStopValue(stop: GradientStop): string {
  const { color, position, opacity } = stop;
  const resolvedColor = opacity !== undefined ? withOpacity(color, opacity) : color;
  return position !== undefined
    ? `${resolvedColor} ${roundTo(position * 100)}%`
    : resolvedColor;
}

export function generateGradientScale(
  gradients: GradientConfig[],
  prefix = 'gradient'
): GradientScale {
  const scale: GradientScale = {};

  gradients.forEach((config, index) => {
    const label = stepLabel(index, gradients.length);
    const direction = config.direction ?? 'to bottom';
    const stops = config.stops.map(buildStopValue).join(', ');
    scale[`${prefix}-${label}`] = `linear-gradient(${direction}, ${stops})`;
  });

  return scale;
}
