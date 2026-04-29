export interface AnimationStep {
  label: string;
  duration: string;
  easing: string;
}

export interface AnimationScaleOptions {
  steps: number;
  baseDuration: number;
  durationUnit?: 'ms' | 's';
  durationMultiplier?: number;
  easings?: string[];
}

const DEFAULT_EASINGS = [
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
];

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function stepLabel(index: number, total: number): string {
  if (total === 1) return 'base';
  const labels = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
  if (total <= labels.length) return labels[index];
  return `step-${index + 1}`;
}

/**
 * Generates an animation scale with duration and easing values.
 * Duration grows by multiplier at each step.
 */
export function generateAnimationScale(
  options: AnimationScaleOptions
): AnimationStep[] {
  const {
    steps,
    baseDuration,
    durationUnit = 'ms',
    durationMultiplier = 1.5,
    easings = DEFAULT_EASINGS,
  } = options;

  const scale: AnimationStep[] = [];

  for (let i = 0; i < steps; i++) {
    const rawDuration = baseDuration * Math.pow(durationMultiplier, i);
    const duration =
      durationUnit === 's'
        ? `${roundTo(rawDuration / 1000, 3)}s`
        : `${roundTo(rawDuration, 0)}ms`;

    const easing = easings[i % easings.length];
    const label = stepLabel(i, steps);

    scale.push({ label, duration, easing });
  }

  return scale;
}
