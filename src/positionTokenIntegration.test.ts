import {
  buildPositionTokens,
  mergePositionTokens,
  filterPositionTokens,
  generatePositionCSSFromConfig,
} from './positionTokenIntegration';

describe('buildPositionTokens', () => {
  it('builds tokens with defaults', () => {
    const tokens = buildPositionTokens();
    expect(tokens['position-static']).toBe('static');
    expect(tokens['position-sticky']).toBe('sticky');
  });

  it('builds tokens with custom config', () => {
    const tokens = buildPositionTokens({ values: ['fixed'], prefix: 'p' });
    expect(tokens['p-fixed']).toBe('fixed');
    expect(Object.keys(tokens)).toHaveLength(1);
  });
});

describe('mergePositionTokens', () => {
  it('merges base and override tokens', () => {
    const base = { 'position-static': 'static' };
    const overrides = { 'position-custom': 'relative' };
    const merged = mergePositionTokens(base, overrides);
    expect(merged).toEqual({
      'position-static': 'static',
      'position-custom': 'relative',
    });
  });

  it('overrides existing keys', () => {
    const base = { 'position-static': 'static' };
    const overrides = { 'position-static': 'relative' };
    const merged = mergePositionTokens(base, overrides);
    expect(merged['position-static']).toBe('relative');
  });
});

describe('filterPositionTokens', () => {
  it('returns only requested keys', () => {
    const tokens = buildPositionTokens();
    const filtered = filterPositionTokens(tokens, ['position-fixed', 'position-sticky']);
    expect(Object.keys(filtered)).toEqual(['position-fixed', 'position-sticky']);
  });

  it('returns empty object when no keys match', () => {
    const tokens = buildPositionTokens();
    const filtered = filterPositionTokens(tokens, ['nonexistent']);
    expect(filtered).toEqual({});
  });
});

describe('generatePositionCSSFromConfig', () => {
  it('generates CSS from config', () => {
    const css = generatePositionCSSFromConfig({ values: ['relative', 'absolute'] });
    expect(css).toContain('--position-relative: relative;');
    expect(css).toContain('--position-absolute: absolute;');
  });

  it('uses custom selector', () => {
    const css = generatePositionCSSFromConfig({}, '[data-theme]');
    expect(css).toMatch(/^\[data-theme\]/);
  });
});
