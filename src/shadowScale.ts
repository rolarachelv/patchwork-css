import { ShadowScaleOptions, ShadowToken } from './types';

/**
 * Generates a shadow scale from a base configuration.
 */
export function generateShadowScale(options: ShadowScaleOptions): Record<string, ShadowToken> {
  const {
    steps = 5,
    baseColor = '0,0,0',
    baseOpacity = 0.1,
    baseBlur = 4,
    baseSpread = 0,
    baseOffsetY = 2,
    opacityStep = 0.06,
    blurStep = 8,
    offsetYStep = 4,
  } = options;

  const scale: Record<string, ShadowToken> = {};

  for (let i = 1; i <= steps; i++) {
    const label = stepLabel(i);
    const opacity = roundTo(baseOpacity + opacityStep * (i - 1), 3);
    const blur = baseBlur + blurStep * (i - 1);
    const offsetY = baseOffsetY + offsetYStep * (i - 1);
    const spread = baseSpread;

    scale[label] = {
      value: buildShadowValue(baseColor, opacity, blur, spread, offsetY),
      offsetY,
      blur,
      spread,
      color: `rgba(${baseColor},${opacity})`,
    };
  }

  return scale;
}

export function buildShadowValue(
  color: string,
  opacity: number,
  blur: number,
  spread: number,
  offsetY: number,
): string {
  return `0 ${offsetY}px ${blur}px ${spread}px rgba(${color},${opacity})`;
}

export function stepLabel(index: number): string {
  const labels = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  if (index <= labels.length) return labels[index - 1];
  return `step-${index}`;
}

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
