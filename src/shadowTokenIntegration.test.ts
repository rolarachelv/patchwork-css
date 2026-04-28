import { shadowScaleToTokens, generateShadowCSS, shadowVar } from './shadowTokenIntegration';

describe('shadowScaleToTokens', () => {
  it('returns a flat token map with prefixed keys', () => {
    const tokens = shadowScaleToTokens({ steps: 3 }, 'shadow');
    expect(Object.keys(tokens)).toEqual(['shadow-xs', 'shadow-sm', 'shadow-md']);
  });

  it('each value is a valid CSS box-shadow string', () => {
    const tokens = shadowScaleToTokens({ steps: 2 });
    for (const value of Object.values(tokens)) {
      expect(typeof value).toBe('string');
      expect(value).toMatch(/^0 \d+px \d+px \d+px rgba\(/);
    }
  });

  it('uses custom prefix', () => {
    const tokens = shadowScaleToTokens({ steps: 1 }, 'elevation');
    expect(Object.keys(tokens)[0]).toBe('elevation-xs');
  });
});

describe('generateShadowCSS', () => {
  it('produces CSS custom properties', () => {
    const css = generateShadowCSS({ steps: 2 }, 'shadow', 'pw');
    expect(css).toContain('--pw-shadow-xs:');
    expect(css).toContain('--pw-shadow-sm:');
  });

  it('wraps output in :root block', () => {
    const css = generateShadowCSS({ steps: 1 });
    expect(css).toContain(':root');
    expect(css.trim().startsWith(':root')).toBe(true);
  });
});

describe('shadowVar', () => {
  it('returns a CSS var() reference for a shadow step', () => {
    expect(shadowVar('md')).toBe('var(--pw-shadow-md)');
  });

  it('respects custom prefix and cssPrefix', () => {
    expect(shadowVar('lg', 'elevation', 'ds')).toBe('var(--ds-elevation-lg)');
  });
});
