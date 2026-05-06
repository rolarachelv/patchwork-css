import {
  generateTransitionScale,
  transitionScaleToTokens,
  generateTransitionCSS,
  stepLabel,
  roundTo,
} from './transitionScale';

describe('roundTo', () => {
  it('rounds to given decimal places', () => {
    expect(roundTo(1.2345, 2)).toBe(1.23);
    expect(roundTo(200.999, 0)).toBe(201);
  });
});

describe('stepLabel', () => {
  it('returns "base" for a single step', () => {
    expect(stepLabel(0, 1)).toBe('base');
  });

  it('returns named labels for small step counts', () => {
    expect(stepLabel(0, 5)).toBe('xs');
    expect(stepLabel(2, 5)).toBe('md');
    expect(stepLabel(4, 5)).toBe('xl');
  });

  it('returns step-N labels for large step counts', () => {
    expect(stepLabel(7, 10)).toBe('step-8');
  });
});

describe('generateTransitionScale', () => {
  it('generates the correct number of steps', () => {
    const scale = generateTransitionScale({ steps: 4 });
    expect(scale.steps).toHaveLength(4);
  });

  it('uses default config when none provided', () => {
    const scale = generateTransitionScale();
    expect(scale.config.steps).toBe(5);
    expect(scale.config.unit).toBe('ms');
  });

  it('each step has a label, duration, easing, property, and value', () => {
    const scale = generateTransitionScale({ steps: 3 });
    for (const step of scale.steps) {
      expect(step.step).toBeTruthy();
      expect(typeof step.duration).toBe('number');
      expect(step.easing).toBeTruthy();
      expect(step.property).toBeTruthy();
      expect(step.value).toContain(step.easing);
    }
  });

  it('respects the "s" unit option', () => {
    const scale = generateTransitionScale({ steps: 2, unit: 's' });
    for (const step of scale.steps) {
      expect(step.value).toMatch(/\d+(\.\d+)?s/);
    }
  });
});

describe('transitionScaleToTokens', () => {
  it('produces tokens for each step', () => {
    const scale = generateTransitionScale({ steps: 3 });
    const tokens = transitionScaleToTokens(scale);
    const keys = Object.keys(tokens);
    expect(keys.some((k) => k.startsWith('transition-duration-'))).toBe(true);
    expect(keys.some((k) => k.startsWith('transition-easing-'))).toBe(true);
    expect(keys.some((k) => k.startsWith('transition-'))).toBe(true);
  });
});

describe('generateTransitionCSS', () => {
  it('wraps tokens in a :root block by default', () => {
    const scale = generateTransitionScale({ steps: 2 });
    const css = generateTransitionCSS(scale);
    expect(css).toMatch(/^:root \{/);
    expect(css).toContain('--transition-');
  });

  it('accepts a custom selector', () => {
    const scale = generateTransitionScale({ steps: 1 });
    const css = generateTransitionCSS(scale, '.theme');
    expect(css).toMatch(/^\.theme \{/);
  });
});
