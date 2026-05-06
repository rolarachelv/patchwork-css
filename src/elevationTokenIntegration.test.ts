import {
  buildElevationTokens,
  mergeElevationTokens,
  filterElevationTokens,
  generateElevationCSSFromConfig,
} from './elevationTokenIntegration';

describe('buildElevationTokens', () => {
  it('returns an object with elevation keys', () => {
    const tokens = buildElevationTokens({ steps: 4 });
    expect(Object.keys(tokens).every((k) => k.startsWith('elevation-'))).toBe(true);
  });

  it('uses default config when no args provided', () => {
    const tokens = buildElevationTokens();
    expect(Object.keys(tokens).length).toBeGreaterThan(0);
  });

  it('generates correct number of tokens', () => {
    const tokens = buildElevationTokens({ steps: 5 });
    expect(Object.keys(tokens)).toHaveLength(5);
  });

  it('first token is elevation-none with value none', () => {
    const tokens = buildElevationTokens({ steps: 4 });
    expect(tokens['elevation-none']).toBe('none');
  });
});

describe('mergeElevationTokens', () => {
  it('merges base and overrides', () => {
    const base = { 'elevation-none': 'none', 'elevation-level-1': '0 2px 4px rgba(0,0,0,0.1)' };
    const overrides = { 'elevation-level-1': '0 4px 8px rgba(0,0,0,0.2)' };
    const merged = mergeElevationTokens(base, overrides);
    expect(merged['elevation-level-1']).toBe('0 4px 8px rgba(0,0,0,0.2)');
    expect(merged['elevation-none']).toBe('none');
  });

  it('does not mutate base object', () => {
    const base = { 'elevation-none': 'none' };
    mergeElevationTokens(base, { 'elevation-none': 'changed' });
    expect(base['elevation-none']).toBe('none');
  });
});

describe('filterElevationTokens', () => {
  it('filters tokens by predicate', () => {
    const tokens = buildElevationTokens({ steps: 6 });
    const filtered = filterElevationTokens(tokens, (k) => k !== 'elevation-none');
    expect(filtered['elevation-none']).toBeUndefined();
  });

  it('returns all tokens when predicate always true', () => {
    const tokens = buildElevationTokens({ steps: 4 });
    const filtered = filterElevationTokens(tokens, () => true);
    expect(Object.keys(filtered)).toHaveLength(Object.keys(tokens).length);
  });
});

describe('generateElevationCSSFromConfig', () => {
  it('generates valid CSS with :root selector by default', () => {
    const css = generateElevationCSSFromConfig({ steps: 3 });
    expect(css).toMatch(/^:root \{/);
    expect(css).toContain('--elevation-');
  });

  it('uses custom selector when provided', () => {
    const css = generateElevationCSSFromConfig({ steps: 3, selector: '[data-theme]' });
    expect(css).toMatch(/^\[data-theme\] \{/);
  });

  it('closes the CSS block', () => {
    const css = generateElevationCSSFromConfig({ steps: 2 });
    expect(css.trim()).toMatch(/\}$/);
  });
});
