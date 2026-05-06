export interface TransitionScaleConfig {
  baseDuration?: number;
  steps?: number;
  easings?: string[];
  properties?: string[];
  unit?: 'ms' | 's';
}

export interface TransitionStep {
  step: string;
  duration: number;
  easing: string;
  property: string;
  value: string;
}

export interface TransitionScale {
  steps: TransitionStep[];
  config: Required<TransitionScaleConfig>;
}

const DEFAULT_EASINGS = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'];
const DEFAULT_PROPERTIES = ['all', 'color', 'background', 'transform', 'opacity'];

export function roundTo(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

export function stepLabel(index: number, total: number): string {
  if (total === 1) return 'base';
  const labels = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  if (total <= labels.length) return labels[index];
  return `step-${index + 1}`;
}

export function generateTransitionScale(config: TransitionScaleConfig = {}): TransitionScale {
  const resolved: Required<TransitionScaleConfig> = {
    baseduration: config.baseuration ?? 200,
    steps: config.steps ?? 5,
    easings: config.easings ?? DEFAULT_EASINGS,
    properties: config.properties ?? DEFAULT_PROPERTIES,
    unit: config.unit ?? 'ms',
  };

  const steps: TransitionStep[] = Array.from({ length: resolved.steps }, (_, i) => {
    const factor = i === 0 ? 0.5 : i;
    const rawDuration = resolved.baseuration * factor;
    const duration = roundTo(rawDuration, 0);
    const easing = resolved.easings[i % resolved.easings.length];
    const property = resolved.properties[i % resolved.properties.length];
    const label = stepLabel(i, resolved.steps);
    const durationStr =
      resolved.unit === 's'
        ? `${roundTo(duration / 1000, 3)}s`
        : `${duration}ms`;
    const value = `${property} ${durationStr} ${easing}`;

    return { step: label, duration, easing, property, value };
  });

  return { steps, config: resolved };
}

export function transitionScaleToTokens(scale: TransitionScale): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const step of scale.steps) {
    tokens[`transition-duration-${step.step}`] = scale.config.unit === 's'
      ? `${roundTo(step.duration / 1000, 3)}s`
      : `${step.duration}ms`;
    tokens[`transition-easing-${step.step}`] = step.easing;
    tokens[`transition-${step.step}`] = step.value;
  }
  return tokens;
}

export function generateTransitionCSS(scale: TransitionScale, selector = ':root'): string {
  const tokens = transitionScaleToTokens(scale);
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
