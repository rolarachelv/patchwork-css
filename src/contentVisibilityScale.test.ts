import {
  generateContentVisibilityScale,
  contentVisibilityScaleToTokens,
  contentVisibilityVar,
  generateContentVisibilityCSS,
} from './contentVisibilityScale';

describe('generateContentVisibilityScale', () => {
  it('returns a scale with default values', () => {
    const scale = generateContentVisibilityScale();
    expect(scale.tokens).toHaveLength(3);
    expect(scale.tokens.map((t) => t.value)).toEqual(['visible', 'hidden', 'auto']);
  });

  it('returns a scale with custom values', () => {
    const scale = generateContentVisibilityScale(['auto', 'hidden']);
    expect(scale.tokens).toHaveLength(2);
    expect(scale.tokens[0].key).toBe('auto');
    expect(scale.tokens[1].key).toBe('hidden');
  });
});

describe('contentVisibilityScaleToTokens', () => {
  it('maps tokens to CSS custom property keys', () => {
    const scale = generateContentVisibilityScale(['visible', 'auto']);
    const tokens = contentVisibilityScaleToTokens(scale);
    expect(tokens['content-visibility-visible']).toBe('visible');
    expect(tokens['content-visibility-auto']).toBe('auto');
  });

  it('includes containIntrinsicSize when set', () => {
    const scale = {
      tokens: [
        { key: 'auto', value: 'auto' as const, containIntrinsicSize: '0 500px' },
      ],
    };
    const tokens = contentVisibilityScaleToTokens(scale);
    expect(tokens['contain-intrinsic-size-auto']).toBe('0 500px');
  });

  it('omits containIntrinsicSize when not set', () => {
    const scale = generateContentVisibilityScale(['visible']);
    const tokens = contentVisibilityScaleToTokens(scale);
    expect(Object.keys(tokens)).not.toContain('contain-intrinsic-size-visible');
  });
});

describe('contentVisibilityVar', () => {
  it('returns a CSS var reference', () => {
    expect(contentVisibilityVar('auto')).toBe('var(--content-visibility-auto)');
  });
});

describe('generateContentVisibilityCSS', () => {
  it('generates CSS with default :root selector', () => {
    const scale = generateContentVisibilityScale(['visible']);
    const css = generateContentVisibilityCSS(scale);
    expect(css).toContain(':root {');
    expect(css).toContain('--content-visibility-visible: visible;');
  });

  it('generates CSS with a custom selector', () => {
    const scale = generateContentVisibilityScale(['auto']);
    const css = generateContentVisibilityCSS(scale, '.theme');
    expect(css).toContain('.theme {');
    expect(css).toContain('--content-visibility-auto: auto;');
  });
});
