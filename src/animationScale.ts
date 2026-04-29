/**
 * animationScale.ts
 * Generates animation/transition design tokens (duration, easing, delay).
 */

export interface AnimationScaleOptions {
  durationBase?: number; // ms
  durationSteps?: number;
  durationMultiplier?: number;
  easings?: Record<string, string>;
}

export interface AnimationScale {
  duration: Record<string, string>;
  easing: Record<string, string>;
}

const DEFAULT_EASINGS: Record<string, string> = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
};

export function generateAnimationScale(
  options: AnimationScaleOptions = {}
): AnimationScale {
  const {
    durationBase = 100,
    durationSteps = 6,
    durationMultiplier = 2,
    easings = DEFAULT_EASINGS,
  } = options;

  const duration: Record<string, string> = {};

  for (let i = 0; i < durationSteps; i++) {
    const label = stepLabel(i);
    const value = roundTo(durationBase * Math.pow(durationMultiplier, i), 0);
    duration[label] = `${value}ms`;
  }

  return {
    duration,
    easing: { ...easings },
  };
}

export function stepLabel(index: number): string {
  const labels = ['fastest', 'faster', 'fast', 'normal', 'slow', 'slower', 'slowest'];
  return labels[index] ?? `step-${index}`;
}

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
