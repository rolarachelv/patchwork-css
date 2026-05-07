import {
  buildDisplayTokens,
  mergeDisplayTokens,
  filterDisplayTokens,
  generateDisplayCSSFromConfig,
} from './displayTokenIntegration';

describe('buildDisplayTokens', () => {
  it('builds tokens with default config and prefix', () => {
    const tokens = buildDisplayTokens();
    expect(tokens['display-flex']).toBe('flex');
    expect(tokens['display-none']).toBe('none');
  });

  it('builds tokens with custom config', () => {
    const tokens = buildDisplayTokens({ values: ['block', 'grid'] });
    expect(Object.keys(tokens)).toEqual(['display-block', 'display-grid']);
  });

  it('applies a custom prefix', () => {
    const tokens = buildDisplayTokens({ values: ['flex'] }, 'd');
    expect(tokens['d-flex']).toBe('flex');
  });
});

describe('mergeDisplayTokens', () => {
  it('merges two token maps, overrides win', () => {
    const base = { 'display-flex': 'flex', 'display-block': 'block' };
    const overrides = { 'display-flex': 'inline-flex' };
    const result = mergeDisplayTokens(base, overrides);
    expect(result['display-flex']).toBe('inline-flex');
    expect(result['display-block']).toBe('block');
  });

  it('adds new keys from overrides', () => {
    const base = { 'display-block': 'block' };
    const overrides = { 'display-none': 'none' };
    const result = mergeDisplayTokens(base, overrides);
    expect(result).toEqual({ 'display-block': 'block', 'display-none': 'none' });
  });
});

describe('filterDisplayTokens', () => {
  it('returns only matching keys', () => {
    const tokens = { 'display-flex': 'flex', 'display-grid': 'grid', 'display-none': 'none' };
    const result = filterDisplayTokens(tokens, ['display-flex', 'display-none']);
    expect(result).toEqual({ 'display-flex': 'flex', 'display-none': 'none' });
  });

  it('returns empty object when no keys match', () => {
    const tokens = { 'display-flex': 'flex' };
    expect(filterDisplayTokens(tokens, ['display-block'])).toEqual({});
  });
});

describe('generateDisplayCSSFromConfig', () => {
  it('generates valid CSS from config', () => {
    const css = generateDisplayCSSFromConfig({ values: ['flex', 'block'] });
    expect(css).toContain('--display-flex: flex;');
    expect(css).toContain('--display-block: block;');
  });

  it('uses custom prefix', () => {
    const css = generateDisplayCSSFromConfig({ values: ['grid'] }, 'd');
    expect(css).toContain('--d-grid: grid;');
  });
});
