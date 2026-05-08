import {
  generateVisibilityScale,
  visibilityScaleToTokens,
  visibilityVar,
  generateVisibilityCSS,
  VisibilityToken,
} from './visibilityScale';

describe('generateVisibilityScale', () => {
  it('returns default visibility tokens when no config is provided', () => {
    const tokens = generateVisibilityScale();
    expect(tokens).toHaveLength(3);
    expect(tokens.map((t) => t.value)).toEqual(['visible', 'hidden', 'collapse']);
  });

  it('uses default prefix of "visibility"', () => {
    const tokens = generateVisibilityScale();
    expect(tokens[0].key).toBe('visibility-visible');
    expect(tokens[0].cssVar).toBe('--visibility-visible');
  });

  it('respects custom prefix', () => {
    const tokens = generateVisibilityScale({ prefix: 'vis' });
    expect(tokens[0].key).toBe('vis-visible');
    expect(tokens[0].cssVar).toBe('--vis-visible');
  });

  it('respects custom values', () => {
    const tokens = generateVisibilityScale({ values: ['visible', 'hidden'] });
    expect(tokens).toHaveLength(2);
    expect(tokens.map((t) => t.value)).toEqual(['visible', 'hidden']);
  });

  it('returns correct token shape', () => {
    const tokens = generateVisibilityScale({ values: ['hidden'] });
    expect(tokens[0]).toEqual({
      key: 'visibility-hidden',
      value: 'hidden',
      cssVar: '--visibility-hidden',
    });
  });
});

describe('visibilityScaleToTokens', () => {
  it('converts token array to key-value record', () => {
    const tokens = generateVisibilityScale({ values: ['visible', 'hidden'] });
    const result = visibilityScaleToTokens(tokens);
    expect(result).toEqual({
      'visibility-visible': 'visible',
      'visibility-hidden': 'hidden',
    });
  });
});

describe('visibilityVar', () => {
  it('returns a CSS var reference with default prefix', () => {
    expect(visibilityVar('hidden')).toBe('var(--visibility-hidden)');
  });

  it('returns a CSS var reference with custom prefix', () => {
    expect(visibilityVar('visible', 'vis')).toBe('var(--vis-visible)');
  });
});

describe('generateVisibilityCSS', () => {
  it('generates CSS custom properties under :root by default', () => {
    const tokens: VisibilityToken[] = [
      { key: 'visibility-visible', value: 'visible', cssVar: '--visibility-visible' },
      { key: 'visibility-hidden', value: 'hidden', cssVar: '--visibility-hidden' },
    ];
    const css = generateVisibilityCSS(tokens);
    expect(css).toContain(':root {');
    expect(css).toContain('--visibility-visible: visible;');
    expect(css).toContain('--visibility-hidden: hidden;');
  });

  it('uses a custom selector when provided', () => {
    const tokens: VisibilityToken[] = [
      { key: 'visibility-collapse', value: 'collapse', cssVar: '--visibility-collapse' },
    ];
    const css = generateVisibilityCSS(tokens, '[data-theme="dark"]');
    expect(css).toContain('[data-theme="dark"] {');
    expect(css).toContain('--visibility-collapse: collapse;');
  });
});
