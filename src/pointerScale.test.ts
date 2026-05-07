import {
  generatePointerScale,
  pointerScaleToTokens,
  pointerVar,
  generatePointerCSS,
} from './pointerScale';

describe('generatePointerScale', () => {
  it('generates 4 steps by default', () => {
    const scale = generatePointerScale();
    expect(scale).toHaveLength(4);
  });

  it('uses 44px as default base', () => {
    const scale = generatePointerScale();
    expect(scale[0].size).toBeCloseTo(33);
    expect(scale[1].size).toBeCloseTo(44);
  });

  it('respects custom base and steps', () => {
    const scale = generatePointerScale({ base: 40, steps: 3 });
    expect(scale).toHaveLength(3);
    expect(scale[0].value).toBe('30px');
  });

  it('applies custom unit', () => {
    const scale = generatePointerScale({ base: 3, unit: 'rem', steps: 2 });
    expect(scale[0].unit).toBe('rem');
    expect(scale[0].value).toMatch(/rem$/);
  });

  it('assigns correct labels for 4 steps', () => {
    const scale = generatePointerScale({ steps: 4 });
    expect(scale.map((s) => s.label)).toEqual(['xs', 'sm', 'md', 'lg']);
  });

  it('assigns label md for single step', () => {
    const scale = generatePointerScale({ steps: 1 });
    expect(scale[0].label).toBe('md');
  });
});

describe('pointerScaleToTokens', () => {
  it('produces a token map with default prefix', () => {
    const scale = generatePointerScale({ steps: 2 });
    const tokens = pointerScaleToTokens(scale);
    expect(tokens).toHaveProperty('pointer-xs');
    expect(tokens).toHaveProperty('pointer-sm');
  });

  it('respects custom prefix', () => {
    const scale = generatePointerScale({ steps: 1 });
    const tokens = pointerScaleToTokens(scale, 'touch');
    expect(tokens).toHaveProperty('touch-md');
  });
});

describe('pointerVar', () => {
  it('returns a CSS var string', () => {
    expect(pointerVar('md')).toBe('var(--pointer-md)');
  });

  it('uses custom prefix', () => {
    expect(pointerVar('lg', 'tap')).toBe('var(--tap-lg)');
  });
});

describe('generatePointerCSS', () => {
  it('outputs :root block by default', () => {
    const scale = generatePointerScale({ steps: 2 });
    const css = generatePointerCSS(scale);
    expect(css).toContain(':root {');
    expect(css).toContain('--pointer-xs:');
    expect(css).toContain('--pointer-sm:');
  });

  it('uses custom selector', () => {
    const scale = generatePointerScale({ steps: 1 });
    const css = generatePointerCSS(scale, 'pointer', '.theme');
    expect(css).toContain('.theme {');
  });
});
