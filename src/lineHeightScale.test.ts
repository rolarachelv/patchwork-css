import {
  generateLineHeightScale,
  lineHeightScaleToTokens,
  lineHeightVar,
  generateLineHeightCSS,
} from './lineHeightScale';

describe('generateLineHeightScale', () => {
  it('returns default 5-step scale with sensible values', () => {
    const scale = generateLineHeightScale();
    expect(scale).toHaveLength(5);
    expect(scale[0].value).toBeCloseTo(1.5);
    expect(scale[4].value).toBeCloseTo(2.1);
  });

  it('respects custom base and increment', () => {
    const scale = generateLineHeightScale({ base: 1.2, increment: 0.2, steps: 3 });
    expect(scale[0].value).toBeCloseTo(1.2);
    expect(scale[1].value).toBeCloseTo(1.4);
    expect(scale[2].value).toBeCloseTo(1.6);
  });

  it('uses unitless css by default', () => {
    const scale = generateLineHeightScale({ steps: 1 });
    expect(scale[0].css).toBe('1.5');
  });

  it('appends em unit when specified', () => {
    const scale = generateLineHeightScale({ steps: 1, unit: 'em' });
    expect(scale[0].css).toMatch(/em$/);
  });

  it('appends rem unit when specified', () => {
    const scale = generateLineHeightScale({ steps: 1, unit: 'rem' });
    expect(scale[0].css).toMatch(/rem$/);
  });

  it('assigns correct labels for small step counts', () => {
    const scale = generateLineHeightScale({ steps: 3 });
    expect(scale.map(e => e.label)).toEqual(['xs', 'sm', 'md']);
  });

  it('falls back to step-N labels for large step counts', () => {
    const scale = generateLineHeightScale({ steps: 9 });
    expect(scale[8].label).toBe('step-9');
  });

  it('respects decimals option', () => {
    const scale = generateLineHeightScale({ base: 1.5, increment: 0.1, steps: 1, decimals: 1 });
    expect(scale[0].css).toBe('1.5');
  });
});

describe('lineHeightScaleToTokens', () => {
  it('maps entries to token key/value pairs', () => {
    const scale = generateLineHeightScale({ steps: 2 });
    const tokens = lineHeightScaleToTokens(scale);
    expect(tokens['line-height-xs']).toBeDefined();
    expect(tokens['line-height-sm']).toBeDefined();
  });
});

describe('lineHeightVar', () => {
  it('returns a CSS var reference', () => {
    expect(lineHeightVar('md')).toBe('var(--line-height-md)');
  });
});

describe('generateLineHeightCSS', () => {
  it('generates :root block by default', () => {
    const scale = generateLineHeightScale({ steps: 2 });
    const css = generateLineHeightCSS(scale);
    expect(css).toContain(':root {');
    expect(css).toContain('--line-height-xs:');
    expect(css).toContain('--line-height-sm:');
  });

  it('supports a custom selector', () => {
    const scale = generateLineHeightScale({ steps: 1 });
    const css = generateLineHeightCSS(scale, '.theme');
    expect(css).toContain('.theme {');
  });
});
