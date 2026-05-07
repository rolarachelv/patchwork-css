import {
  generateDisplayScale,
  displayScaleToTokens,
  displayVar,
  generateDisplayCSS,
  DisplayScaleConfig,
} from './displayScale';

describe('generateDisplayScale', () => {
  it('returns default display tokens when no config provided', () => {
    const tokens = generateDisplayScale();
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens.find((t) => t.key === 'flex')).toEqual({ key: 'flex', value: 'flex' });
    expect(tokens.find((t) => t.key === 'none')).toEqual({ key: 'none', value: 'none' });
  });

  it('respects custom values list', () => {
    const config: DisplayScaleConfig = { values: ['block', 'flex', 'grid'] };
    const tokens = generateDisplayScale(config);
    expect(tokens).toHaveLength(3);
    expect(tokens.map((t) => t.key)).toEqual(['block', 'flex', 'grid']);
  });

  it('each token key matches its value', () => {
    const tokens = generateDisplayScale();
    tokens.forEach(({ key, value }) => expect(key).toBe(value));
  });
});

describe('displayScaleToTokens', () => {
  it('converts tokens to a record with default prefix', () => {
    const tokens = generateDisplayScale({ values: ['flex', 'grid'] });
    const result = displayScaleToTokens(tokens);
    expect(result).toEqual({ 'display-flex': 'flex', 'display-grid': 'grid' });
  });

  it('uses a custom prefix', () => {
    const tokens = generateDisplayScale({ values: ['block'] });
    const result = displayScaleToTokens(tokens, 'd');
    expect(result).toEqual({ 'd-block': 'block' });
  });
});

describe('displayVar', () => {
  it('returns a CSS var string with default prefix', () => {
    expect(displayVar('flex')).toBe('var(--display-flex)');
  });

  it('uses a custom prefix', () => {
    expect(displayVar('grid', 'd')).toBe('var(--d-grid)');
  });
});

describe('generateDisplayCSS', () => {
  it('wraps declarations in :root block', () => {
    const tokens = generateDisplayScale({ values: ['block', 'flex'] });
    const css = generateDisplayCSS(tokens);
    expect(css).toContain(':root {');
    expect(css).toContain('--display-block: block;');
    expect(css).toContain('--display-flex: flex;');
    expect(css).toMatch(/^:root \{[\s\S]+\}$/);
  });

  it('uses a custom prefix in CSS output', () => {
    const tokens = generateDisplayScale({ values: ['none'] });
    const css = generateDisplayCSS(tokens, 'd');
    expect(css).toContain('--d-none: none;');
  });
});
