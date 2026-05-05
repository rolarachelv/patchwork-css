import {
  generateOpacityScale,
  opacityScaleToTokens,
  generateOpacityCSS,
  opacityVar,
  roundTo,
  stepLabel,
} from './opacityScale';

describe('roundTo', () => {
  it('rounds to the specified number of decimals', () => {
    expect(roundTo(0.12345, 2)).toBe(0.12);
    expect(roundTo(0.9999, 4)).toBe(0.9999);
    expect(roundTo(0.33333, 3)).toBe(0.333);
  });
});

describe('stepLabel', () => {
  it('returns a label with percentage for multi-step scales', () => {
    expect(stepLabel(0, 5, 'opacity')).toBe('opacity-0');
    expect(stepLabel(4, 5, 'opacity')).toBe('opacity-100');
    expect(stepLabel(2, 5, 'opacity')).toBe('opacity-50');
  });

  it('returns a 100 label for single-step scales', () => {
    expect(stepLabel(0, 1, 'opacity')).toBe('opacity-100');
  });
});

describe('generateOpacityScale', () => {
  it('generates a default scale with 5 steps', () => {
    const scale = generateOpacityScale();
    expect(scale.steps).toHaveLength(5);
    expect(scale.steps[0].value).toBe(0);
    expect(scale.steps[4].value).toBe(1);
  });

  it('respects custom min and max', () => {
    const scale = generateOpacityScale({ steps: 3, min: 0.2, max: 0.8 });
    expect(scale.steps[0].value).toBe(0.2);
    expect(scale.steps[2].value).toBe(0.8);
  });

  it('uses a custom prefix for labels', () => {
    const scale = generateOpacityScale({ steps: 2, min: 0, max: 1, prefix: 'alpha' });
    expect(scale.steps[0].label).toBe('alpha-0');
    expect(scale.steps[1].label).toBe('alpha-100');
  });

  it('throws if steps < 1', () => {
    expect(() => generateOpacityScale({ steps: 0 })).toThrow('steps must be at least 1');
  });

  it('throws if min >= max', () => {
    expect(() => generateOpacityScale({ min: 0.8, max: 0.2 })).toThrow('min must be less than max');
  });

  it('throws if min is out of range', () => {
    expect(() => generateOpacityScale({ min: -0.1 })).toThrow('min must be between 0 and 1');
  });
});

describe('opacityScaleToTokens', () => {
  it('converts scale steps to a token map', () => {
    const scale = generateOpacityScale({ steps: 3, min: 0, max: 1 });
    const tokens = opacityScaleToTokens(scale);
    expect(tokens['opacity-0']).toBe('0');
    expect(tokens['opacity-50']).toBe('0.5');
    expect(tokens['opacity-100']).toBe('1');
  });
});

describe('generateOpacityCSS', () => {
  it('generates valid CSS custom properties', () => {
    const scale = generateOpacityScale({ steps: 2, min: 0, max: 1 });
    const css = generateOpacityCSS(scale);
    expect(css).toContain(':root {');
    expect(css).toContain('--opacity-0: 0;');
    expect(css).toContain('--opacity-100: 1;');
  });
});

describe('opacityVar', () => {
  it('returns a CSS var reference', () => {
    expect(opacityVar('opacity-50')).toBe('var(--opacity-50)');
  });
});
