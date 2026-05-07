import {
  generateWhiteSpaceScale,
  whiteSpaceScaleToTokens,
  whiteSpaceVar,
  generateWhiteSpaceCSS,
} from './whiteSpaceScale';

describe('generateWhiteSpaceScale', () => {
  it('returns all default values when no config provided', () => {
    const scale = generateWhiteSpaceScale();
    expect(scale).toHaveLength(6);
    expect(scale[0]).toEqual({
      key: 'white-space-normal',
      value: 'normal',
      cssVar: '--white-space-normal',
    });
  });

  it('respects a custom values list', () => {
    const scale = generateWhiteSpaceScale({ values: ['nowrap', 'pre'] });
    expect(scale).toHaveLength(2);
    expect(scale.map((t) => t.value)).toEqual(['nowrap', 'pre']);
  });

  it('uses a custom prefix', () => {
    const scale = generateWhiteSpaceScale({ prefix: 'ws', values: ['normal'] });
    expect(scale[0].key).toBe('ws-normal');
    expect(scale[0].cssVar).toBe('--ws-normal');
  });

  it('handles hyphenated values like pre-wrap', () => {
    const scale = generateWhiteSpaceScale({ values: ['pre-wrap'] });
    expect(scale[0].key).toBe('white-space-pre-wrap');
    expect(scale[0].cssVar).toBe('--white-space-pre-wrap');
  });
});

describe('whiteSpaceScaleToTokens', () => {
  it('converts scale to a flat token map', () => {
    const scale = generateWhiteSpaceScale({ values: ['normal', 'nowrap'] });
    const tokens = whiteSpaceScaleToTokens(scale);
    expect(tokens).toEqual({
      'white-space-normal': 'normal',
      'white-space-nowrap': 'nowrap',
    });
  });
});

describe('whiteSpaceVar', () => {
  it('returns a CSS var reference with default prefix', () => {
    expect(whiteSpaceVar('nowrap')).toBe('var(--white-space-nowrap)');
  });

  it('uses a custom prefix', () => {
    expect(whiteSpaceVar('pre', 'ws')).toBe('var(--ws-pre)');
  });
});

describe('generateWhiteSpaceCSS', () => {
  it('produces a :root block with all default tokens', () => {
    const css = generateWhiteSpaceCSS();
    expect(css).toContain(':root {');
    expect(css).toContain('--white-space-normal: normal;');
    expect(css).toContain('--white-space-break-spaces: break-spaces;');
  });

  it('respects custom config', () => {
    const css = generateWhiteSpaceCSS({ values: ['nowrap'], prefix: 'ws' });
    expect(css).toContain('--ws-nowrap: nowrap;');
    expect(css).not.toContain('normal');
  });
});
