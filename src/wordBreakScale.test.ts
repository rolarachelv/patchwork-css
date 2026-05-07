import {
  generateWordBreakScale,
  wordBreakScaleToTokens,
  wordBreakVar,
  generateWordBreakCSS,
  WordBreakToken,
} from './wordBreakScale';

describe('generateWordBreakScale', () => {
  it('returns default values when no options provided', () => {
    const scale = generateWordBreakScale();
    expect(scale.length).toBe(4);
    expect(scale[0].value).toBe('normal');
    expect(scale[1].value).toBe('break-all');
  });

  it('uses custom prefix', () => {
    const scale = generateWordBreakScale({ prefix: 'wb' });
    expect(scale[0].name).toBe('wb-normal');
    expect(scale[0].variable).toBe('--wb-normal');
  });

  it('uses custom values', () => {
    const scale = generateWordBreakScale({ values: ['keep-all', 'break-word'] });
    expect(scale.length).toBe(2);
    expect(scale[0].value).toBe('keep-all');
    expect(scale[1].value).toBe('break-word');
  });

  it('generates correct token structure', () => {
    const [token] = generateWordBreakScale({ values: ['normal'] });
    expect(token).toEqual({
      name: 'word-break-normal',
      value: 'normal',
      variable: '--word-break-normal',
    });
  });
});

describe('wordBreakScaleToTokens', () => {
  it('converts tokens to a flat record', () => {
    const scale = generateWordBreakScale({ values: ['normal', 'break-all'] });
    const tokens = wordBreakScaleToTokens(scale);
    expect(tokens['word-break-normal']).toBe('normal');
    expect(tokens['word-break-break-all']).toBe('break-all');
  });

  it('returns empty object for empty array', () => {
    expect(wordBreakScaleToTokens([])).toEqual({});
  });
});

describe('wordBreakVar', () => {
  it('returns a CSS var reference with default prefix', () => {
    expect(wordBreakVar('normal')).toBe('var(--word-break-normal)');
  });

  it('respects custom prefix', () => {
    expect(wordBreakVar('keep-all', 'wb')).toBe('var(--wb-keep-all)');
  });
});

describe('generateWordBreakCSS', () => {
  it('generates :root block by default', () => {
    const scale = generateWordBreakScale({ values: ['normal'] });
    const css = generateWordBreakCSS(scale);
    expect(css).toContain(':root {');
    expect(css).toContain('--word-break-normal: normal;');
  });

  it('uses a custom selector', () => {
    const scale = generateWordBreakScale({ values: ['break-all'] });
    const css = generateWordBreakCSS(scale, '.theme');
    expect(css).toContain('.theme {');
  });

  it('includes all tokens in output', () => {
    const scale = generateWordBreakScale();
    const css = generateWordBreakCSS(scale);
    expect(css).toContain('--word-break-break-all: break-all;');
    expect(css).toContain('--word-break-keep-all: keep-all;');
  });
});
