import { generateTransitionScale, transitionScaleToTokens, generateTransitionCSS, TransitionScaleConfig } from './transitionScale';

export interface TransitionTokenMap {
  duration: Record<string, string>;
  easing: Record<string, string>;
  shorthand: Record<string, string>;
}

export function buildTransitionTokenMap(config: TransitionScaleConfig = {}): TransitionTokenMap {
  const scale = generateTransitionScale(config);
  const flat = transitionScaleToTokens(scale);

  const duration: Record<string, string> = {};
  const easing: Record<string, string> = {};
  const shorthand: Record<string, string> = {};

  for (const [key, value] of Object.entries(flat)) {
    if (key.startsWith('transition-duration-')) {
      const label = key.replace('transition-duration-', '');
      duration[label] = value;
    } else if (key.startsWith('transition-easing-')) {
      const label = key.replace('transition-easing-', '');
      easing[label] = value;
    } else if (key.startsWith('transition-')) {
      const label = key.replace('transition-', '');
      shorthand[label] = value;
    }
  }

  return { duration, easing, shorthand };
}

export function transitionVar(step: string, type: 'duration' | 'easing' | 'shorthand' = 'shorthand'): string {
  if (type === 'duration') return `var(--transition-duration-${step})`;
  if (type === 'easing') return `var(--transition-easing-${step})`;
  return `var(--transition-${step})`;
}

export function mergeTransitionTokens(
  base: TransitionTokenMap,
  overrides: Partial<TransitionTokenMap>
): TransitionTokenMap {
  return {
    duration: { ...base.duration, ...(overrides.duration ?? {}) },
    easing: { ...base.easing, ...(overrides.easing ?? {}) },
    shorthand: { ...base.shorthand, ...(overrides.shorthand ?? {}) },
  };
}

export function generateTransitionCSSFromConfig(
  config: TransitionScaleConfig = {},
  selector = ':root'
): string {
  const scale = generateTransitionScale(config);
  return generateTransitionCSS(scale, selector);
}
