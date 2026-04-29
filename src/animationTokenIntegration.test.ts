import {
  animationScaleToTokens,
  generateAnimationCSS,
  animationDurationVar,
  animationEasingVar,
} from './animationTokenIntegration';

const defaultOptions = {
  steps: 3,
  baseDuration: 200,
  durationUnit: 'ms' as const,
};

describe('animationScaleToTokens', () => {
  it('returns a token map with duration and easing keys', () => {
    const tokens = animationScaleToTokens(defaultOptions);
    const keys = Object.keys(tokens);
    expect(keys.some((k) => k.startsWith('animation-duration-'))).toBe(true);
    expect(keys.some((k) => k.startsWith('animation-easing-'))).toBe(true);
  });

  it('generates one duration and one easing token per step', () => {
    const tokens = animationScaleToTokens(defaultOptions);
    const durationKeys = Object.keys(tokens).filter((k) =>
      k.startsWith('animation-duration-')
    );
    const easingKeys = Object.keys(tokens).filter((k) =>
      k.startsWith('animation-easing-')
    );
    expect(durationKeys.length).toBe(3);
    expect(easingKeys.length).toBe(3);
  });

  it('token values are non-empty strings', () => {
    const tokens = animationScaleToTokens(defaultOptions);
    for (const value of Object.values(tokens)) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});

describe('generateAnimationCSS', () => {
  it('returns a string containing :root selector by default', () => {
    const css = generateAnimationCSS(defaultOptions);
    expect(css).toContain(':root');
  });

  it('includes CSS custom property declarations', () => {
    const css = generateAnimationCSS(defaultOptions);
    expect(css).toContain('--animation-duration-');
    expect(css).toContain('--animation-easing-');
  });

  it('respects a custom selector', () => {
    const css = generateAnimationCSS(defaultOptions, '.theme');
    expect(css).toContain('.theme');
  });
});

describe('animationDurationVar', () => {
  it('returns a CSS var reference for the given label', () => {
    expect(animationDurationVar('md')).toBe('var(--animation-duration-md)');
  });
});

describe('animationEasingVar', () => {
  it('returns a CSS var reference for the given label', () => {
    expect(animationEasingVar('md')).toBe('var(--animation-easing-md)');
  });
});
