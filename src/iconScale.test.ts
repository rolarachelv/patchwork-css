import {
  generateIconScale,
  iconScaleToTokens,
  iconVar,
  generateIconCSS,
  IconScaleConfig,
} from './iconScale';

const baseConfig: IconScaleConfig = {
  baseSize: 1,
  steps: 5,
  ratio: 1.5,
  unit: 'rem',
};

describe('generateIconScale', () => {
  it('generates the correct number of steps', () => {
    const scale = generateIconScale(baseConfig);
    expect(scale.entries).toHaveLength(5);
  });

  it('places base size at the middle step', () => {
    const scale = generateIconScale(baseConfig);
    const mid = scale.entries[2];
    expect(mid.size).toBe(1);
    expect(mid.value).toBe('1rem');
  });

  it('applies ratio correctly across steps', () => {
    const scale = generateIconScale(baseConfig);
    const sizes = scale.entries.map((e) => e.size);
    expect(sizes[3]).toBeCloseTo(1.5, 3);
    expect(sizes[4]).toBeCloseTo(2.25, 3);
    expect(sizes[1]).toBeCloseTo(0.6667, 3);
  });

  it('uses custom unit', () => {
    const scale = generateIconScale({ ...baseConfig, unit: 'px', baseSize: 16 });
    expect(scale.entries[2].value).toBe('16px');
  });

  it('assigns meaningful labels for 5 steps', () => {
    const scale = generateIconScale(baseConfig);
    const labels = scale.entries.map((e) => e.label);
    expect(labels).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
  });

  it('falls back to step-N labels for large step counts', () => {
    const scale = generateIconScale({ ...baseConfig, steps: 10 });
    expect(scale.entries[9].label).toBe('step-10');
  });
});

describe('iconScaleToTokens', () => {
  it('produces tokens keyed by icon-size-{label}', () => {
    const scale = generateIconScale(baseConfig);
    const tokens = iconScaleToTokens(scale);
    expect(tokens['icon-size-md']).toBe('1rem');
    expect(Object.keys(tokens)).toHaveLength(5);
  });
});

describe('iconVar', () => {
  it('returns a CSS var reference', () => {
    expect(iconVar('md')).toBe('var(--icon-size-md)');
  });
});

describe('generateIconCSS', () => {
  it('wraps declarations in :root by default', () => {
    const scale = generateIconScale({ ...baseConfig, steps: 1 });
    const tokens = iconScaleToTokens(scale);
    const css = generateIconCSS(tokens);
    expect(css).toContain(':root {');
    expect(css).toContain('--icon-size-md:');
  });

  it('accepts a custom selector', () => {
    const scale = generateIconScale({ ...baseConfig, steps: 1 });
    const tokens = iconScaleToTokens(scale);
    const css = generateIconCSS(tokens, '.theme');
    expect(css).toContain('.theme {');
  });
});
