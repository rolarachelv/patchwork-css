import {
  buildColumnTokens,
  mergeColumnTokens,
  filterColumnTokens,
  generateColumnCSSFromConfig,
} from './columnTokenIntegration';

describe('buildColumnTokens', () => {
  it('returns a token map with default config', () => {
    const tokens = buildColumnTokens();
    expect(Object.keys(tokens).length).toBeGreaterThan(0);
    expect(tokens['column-count-col-1']).toBeDefined();
  });

  it('respects custom config', () => {
    const tokens = buildColumnTokens({ steps: 3, prefix: 'grid', minColumns: 2, maxColumns: 4 });
    expect(tokens['column-count-grid-1']).toBe('2');
    expect(tokens['column-count-grid-3']).toBe('4');
  });
});

describe('mergeColumnTokens', () => {
  it('overrides base tokens with provided overrides', () => {
    const base = { 'column-count-col-1': '1', 'column-count-col-2': '2' };
    const overrides = { 'column-count-col-2': '99' };
    const merged = mergeColumnTokens(base, overrides);
    expect(merged['column-count-col-1']).toBe('1');
    expect(merged['column-count-col-2']).toBe('99');
  });

  it('adds new keys from overrides', () => {
    const base = { 'column-count-col-1': '1' };
    const overrides = { 'column-count-custom': '6' };
    const merged = mergeColumnTokens(base, overrides);
    expect(merged['column-count-custom']).toBe('6');
  });
});

describe('filterColumnTokens', () => {
  it('keeps only tokens matching the predicate', () => {
    const tokens = buildColumnTokens({ steps: 3 });
    const countOnly = filterColumnTokens(tokens, (key) => key.startsWith('column-count'));
    const keys = Object.keys(countOnly);
    expect(keys.every((k) => k.startsWith('column-count'))).toBe(true);
  });

  it('returns empty object when nothing matches', () => {
    const tokens = { 'column-count-col-1': '1' };
    const result = filterColumnTokens(tokens, () => false);
    expect(result).toEqual({});
  });
});

describe('generateColumnCSSFromConfig', () => {
  it('produces valid CSS with :root block', () => {
    const css = generateColumnCSSFromConfig({ steps: 2 });
    expect(css).toContain(':root {');
    expect(css).toContain('--column-count-col-1');
  });

  it('uses custom prefix in CSS output', () => {
    const css = generateColumnCSSFromConfig({ steps: 1, prefix: 'layout' });
    expect(css).toContain('--column-count-layout-1');
  });
});
