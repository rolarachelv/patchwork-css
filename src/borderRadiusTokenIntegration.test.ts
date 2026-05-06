import {
  buildBorderRadiusTokens,
  mergeBorderRadiusTokens,
  filterBorderRadiusTokens,
  generateBorderRadiusCSSFromConfig,
} from './borderRadiusTokenIntegration';

describe('buildBorderRadiusTokens', () => {
  it('returns a token map with default config', () => {
    const tokens = buildBorderRadiusTokens();
    expect(typeof tokens).toBe('object');
    expect(Object.keys(tokens).length).toBeGreaterThan(0);
  });

  it('includes step tokens', () => {
    const tokens = buildBorderRadiusTokens({ steps: 3 });
    expect(tokens['border-radius-xs']).toBeDefined();
    expect(tokens['border-radius-sm']).toBeDefined();
    expect(tokens['border-radius-md']).toBeDefined();
  });

  it('includes round and full by default', () => {
    const tokens = buildBorderRadiusTokens();
    expect(tokens['border-radius-round']).toBe('50%');
    expect(tokens['border-radius-full']).toBe('9999px');
  });

  it('respects custom prefix', () => {
    const tokens = buildBorderRadiusTokens({ prefix: 'radius', steps: 1 });
    expect(tokens['radius-xs']).toBeDefined();
    expect(tokens['border-radius-xs']).toBeUndefined();
  });
});

describe('mergeBorderRadiusTokens', () => {
  it('merges two token maps', () => {
    const base = { 'border-radius-xs': '4px' };
    const overrides = { 'border-radius-xs': '6px', 'border-radius-sm': '10px' };
    const merged = mergeBorderRadiusTokens(base, overrides);
    expect(merged['border-radius-xs']).toBe('6px');
    expect(merged['border-radius-sm']).toBe('10px');
  });

  it('preserves base keys not in overrides', () => {
    const base = { 'border-radius-md': '12px' };
    const merged = mergeBorderRadiusTokens(base, {});
    expect(merged['border-radius-md']).toBe('12px');
  });
});

describe('filterBorderRadiusTokens', () => {
  it('filters tokens by prefix', () => {
    const tokens = {
      'border-radius-sm': '8px',
      'color-primary': '#fff',
      'border-radius-full': '9999px',
    };
    const filtered = filterBorderRadiusTokens(tokens);
    expect(Object.keys(filtered)).toEqual(['border-radius-sm', 'border-radius-full']);
  });

  it('returns empty object when no match', () => {
    const filtered = filterBorderRadiusTokens({ 'color-primary': '#000' });
    expect(filtered).toEqual({});
  });
});

describe('generateBorderRadiusCSSFromConfig', () => {
  it('generates CSS string from config', () => {
    const css = generateBorderRadiusCSSFromConfig({ steps: 2, includeRound: false, includeFull: false });
    expect(css).toContain(':root {');
    expect(css).toContain('--border-radius-xs');
  });

  it('uses custom selector', () => {
    const css = generateBorderRadiusCSSFromConfig({ steps: 1, selector: '[data-theme]' });
    expect(css).toContain('[data-theme] {');
  });

  it('uses custom prefix in CSS vars', () => {
    const css = generateBorderRadiusCSSFromConfig({ steps: 1, prefix: 'radius' });
    expect(css).toContain('--radius-xs');
    expect(css).not.toContain('--border-radius-xs');
  });
});
