import {
  generateTextTransformScale,
  textTransformScaleToTokens,
  textTransformVar,
  generateTextTransformCSS,
  TextTransformScaleConfig,
} from './textTransformScale';

describe('generateTextTransformScale', () => {
  it('returns default scale when no config provided', () => {
    const scale = generateTextTransformScale();
    expect(scale).toEqual({
      none: 'none',
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
    });
  });

  it('returns custom values when provided', () => {
    const config: TextTransformScaleConfig = {
      values: ['uppercase', 'lowercase'],
    };
    const scale = generateTextTransformScale(config);
    expect(Object.keys(scale)).toHaveLength(2);
    expect(scale['uppercase']).toBe('uppercase');
    expect(scale['lowercase']).toBe('lowercase');
  });

  it('includes full-width when specified', () => {
    const scale = generateTextTransformScale({ values: ['full-width'] });
    expect(scale['full-width']).toBe('full-width');
  });
});

describe('textTransformScaleToTokens', () => {
  it('converts scale to token map with default prefix', () => {
    const scale = { none: 'none' as const, uppercase: 'uppercase' as const };
    const tokens = textTransformScaleToTokens(scale);
    expect(tokens['text-transform-none']).toBe('none');
    expect(tokens['text-transform-uppercase']).toBe('uppercase');
  });

  it('uses custom prefix', () => {
    const scale = { none: 'none' as const };
    const tokens = textTransformScaleToTokens(scale, 'tt');
    expect(tokens['tt-none']).toBe('none');
  });
});

describe('textTransformVar', () => {
  it('returns a CSS var string with default prefix', () => {
    expect(textTransformVar('uppercase')).toBe('var(--text-transform-uppercase)');
  });

  it('returns a CSS var string with custom prefix', () => {
    expect(textTransformVar('lowercase', 'tt')).toBe('var(--tt-lowercase)');
  });
});

describe('generateTextTransformCSS', () => {
  it('generates valid CSS block', () => {
    const scale = generateTextTransformScale();
    const css = generateTextTransformCSS(scale);
    expect(css).toContain(':root {');
    expect(css).toContain('--text-transform-none: none;');
    expect(css).toContain('--text-transform-uppercase: uppercase;');
  });

  it('uses custom selector', () => {
    const scale = { none: 'none' as const };
    const css = generateTextTransformCSS(scale, 'text-transform', '[data-theme]');
    expect(css).toContain('[data-theme] {');
  });

  it('uses custom prefix in CSS vars', () => {
    const scale = { capitalize: 'capitalize' as const };
    const css = generateTextTransformCSS(scale, 'tt');
    expect(css).toContain('--tt-capitalize: capitalize;');
  });
});
