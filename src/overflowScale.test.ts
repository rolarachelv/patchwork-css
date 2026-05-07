import {
  generateOverflowScale,
  overflowScaleToTokens,
  overflowVar,
  generateOverflowCSS,
} from './overflowScale';

describe('generateOverflowScale', () => {
  it('returns default values when no config provided', () => {
    const tokens = generateOverflowScale();
    const keys = tokens.map((t) => t.key);
    expect(keys).toContain('visible');
    expect(keys).toContain('hidden');
    expect(keys).toContain('auto');
  });

  it('includes axis variants by default', () => {
    const tokens = generateOverflowScale({ values: ['hidden'] });
    expect(tokens.find((t) => t.key === 'hidden-x')).toBeDefined();
    expect(tokens.find((t) => t.key === 'hidden-y')).toBeDefined();
  });

  it('excludes axis variants when includeAxes is false', () => {
    const tokens = generateOverflowScale({ values: ['scroll'], includeAxes: false });
    expect(tokens).toHaveLength(1);
    expect(tokens[0].key).toBe('scroll');
  });

  it('respects custom values list', () => {
    const tokens = generateOverflowScale({ values: ['clip', 'overlay'], includeAxes: false });
    expect(tokens.map((t) => t.value)).toEqual(['clip', 'overlay']);
  });

  it('sets axis property correctly', () => {
    const tokens = generateOverflowScale({ values: ['auto'] });
    const base = tokens.find((t) => t.key === 'auto');
    const xAxis = tokens.find((t) => t.key === 'auto-x');
    expect(base?.axis).toBeNull();
    expect(xAxis?.axis).toBe('x');
  });
});

describe('overflowScaleToTokens', () => {
  it('maps tokens to prefixed record', () => {
    const tokens = generateOverflowScale({ values: ['hidden'], includeAxes: false });
    const result = overflowScaleToTokens(tokens);
    expect(result['overflow-hidden']).toBe('hidden');
  });

  it('uses custom prefix', () => {
    const tokens = generateOverflowScale({ values: ['auto'], includeAxes: false });
    const result = overflowScaleToTokens(tokens, 'ov');
    expect(result['ov-auto']).toBe('auto');
  });
});

describe('overflowVar', () => {
  it('returns CSS var reference', () => {
    expect(overflowVar('hidden')).toBe('var(--overflow-hidden)');
  });

  it('uses custom prefix', () => {
    expect(overflowVar('scroll', 'ov')).toBe('var(--ov-scroll)');
  });
});

describe('generateOverflowCSS', () => {
  it('generates :root block', () => {
    const css = generateOverflowCSS({ 'overflow-hidden': 'hidden' });
    expect(css).toContain(':root');
    expect(css).toContain('--overflow-hidden: hidden;');
  });

  it('uses custom selector', () => {
    const css = generateOverflowCSS({ 'overflow-auto': 'auto' }, '.theme');
    expect(css).toContain('.theme {');
  });
});
