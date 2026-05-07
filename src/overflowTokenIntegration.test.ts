import {
  buildOverflowTokens,
  mergeOverflowTokens,
  filterOverflowTokens,
  generateOverflowCSSFromConfig,
} from './overflowTokenIntegration';

describe('buildOverflowTokens', () => {
  it('builds tokens with default config', () => {
    const tokens = buildOverflowTokens();
    expect(Object.keys(tokens).length).toBeGreaterThan(0);
    expect(tokens['overflow-hidden']).toBe('hidden');
  });

  it('uses custom prefix', () => {
    const tokens = buildOverflowTokens({ values: ['scroll'], includeAxes: false }, 'ov');
    expect(tokens['ov-scroll']).toBe('scroll');
  });

  it('respects includeAxes: false', () => {
    const tokens = buildOverflowTokens({ includeAxes: false });
    const axisKeys = Object.keys(tokens).filter((k) => k.includes('-x') || k.includes('-y'));
    expect(axisKeys).toHaveLength(0);
  });
});

describe('mergeOverflowTokens', () => {
  it('merges two token maps', () => {
    const base = { 'overflow-hidden': 'hidden' };
    const overrides = { 'overflow-custom': 'clip' };
    const result = mergeOverflowTokens(base, overrides);
    expect(result['overflow-hidden']).toBe('hidden');
    expect(result['overflow-custom']).toBe('clip');
  });

  it('overrides override base values', () => {
    const base = { 'overflow-auto': 'auto' };
    const overrides = { 'overflow-auto': 'scroll' };
    const result = mergeOverflowTokens(base, overrides);
    expect(result['overflow-auto']).toBe('scroll');
  });
});

describe('filterOverflowTokens', () => {
  it('filters tokens by predicate', () => {
    const tokens = buildOverflowTokens({ includeAxes: false });
    const filtered = filterOverflowTokens(tokens, (_, v) => v === 'hidden');
    expect(Object.values(filtered).every((v) => v === 'hidden')).toBe(true);
  });

  it('returns empty object when nothing matches', () => {
    const tokens = { 'overflow-auto': 'auto' };
    const filtered = filterOverflowTokens(tokens, () => false);
    expect(filtered).toEqual({});
  });
});

describe('generateOverflowCSSFromConfig', () => {
  it('generates valid CSS string', () => {
    const css = generateOverflowCSSFromConfig({ values: ['hidden'], includeAxes: false });
    expect(css).toContain(':root');
    expect(css).toContain('--overflow-hidden: hidden;');
  });

  it('uses custom selector', () => {
    const css = generateOverflowCSSFromConfig(
      { values: ['auto'], includeAxes: false },
      '[data-theme="dark"]'
    );
    expect(css).toContain('[data-theme="dark"]');
  });
});
