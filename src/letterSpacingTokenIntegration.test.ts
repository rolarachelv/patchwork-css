import {
  buildLetterSpacingTokens,
  mergeLetterSpacingTokens,
  filterLetterSpacingTokens,
  generateLetterSpacingCSSFromConfig,
} from './letterSpacingTokenIntegration';

describe('buildLetterSpacingTokens', () => {
  it('returns tokens with default keys', () => {
    const tokens = buildLetterSpacingTokens();
    expect(Object.keys(tokens).some((k) => k.startsWith('letter-spacing-'))).toBe(true);
  });

  it('applies a prefix to token keys', () => {
    const tokens = buildLetterSpacingTokens({ prefix: 'brand', steps: 3 });
    Object.keys(tokens).forEach((key) => {
      expect(key).toMatch(/^brand-letter-spacing-/);
    });
  });

  it('respects steps option', () => {
    const tokens = buildLetterSpacingTokens({ steps: 4 });
    expect(Object.keys(tokens)).toHaveLength(4);
  });

  it('respects unit option', () => {
    const tokens = buildLetterSpacingTokens({ unit: 'px', steps: 3 });
    Object.values(tokens).forEach((val) => {
      expect(val).toContain('px');
    });
  });
});

describe('mergeLetterSpacingTokens', () => {
  it('merges multiple token maps', () => {
    const a = { 'letter-spacing-sm': '-0.025em' };
    const b = { 'letter-spacing-lg': '0.05em' };
    const merged = mergeLetterSpacingTokens(a, b);
    expect(merged).toHaveProperty('letter-spacing-sm');
    expect(merged).toHaveProperty('letter-spacing-lg');
  });

  it('later maps override earlier ones', () => {
    const a = { 'letter-spacing-md': '0em' };
    const b = { 'letter-spacing-md': '0.01em' };
    const merged = mergeLetterSpacingTokens(a, b);
    expect(merged['letter-spacing-md']).toBe('0.01em');
  });
});

describe('filterLetterSpacingTokens', () => {
  it('keeps only tokens matching given labels', () => {
    const tokens = buildLetterSpacingTokens({ steps: 5 });
    const filtered = filterLetterSpacingTokens(tokens, ['sm', 'lg']);
    const keys = Object.keys(filtered);
    expect(keys.every((k) => k.endsWith('-sm') || k.endsWith('-lg'))).toBe(true);
  });

  it('returns empty object when no labels match', () => {
    const tokens = { 'letter-spacing-md': '0em' };
    const filtered = filterLetterSpacingTokens(tokens, ['xxl']);
    expect(Object.keys(filtered)).toHaveLength(0);
  });
});

describe('generateLetterSpacingCSSFromConfig', () => {
  it('generates valid CSS output', () => {
    const css = generateLetterSpacingCSSFromConfig({ steps: 3 });
    expect(css).toContain(':root {');
    expect(css).toContain('--letter-spacing-');
  });

  it('uses a custom selector', () => {
    const css = generateLetterSpacingCSSFromConfig({ selector: '[data-theme]', steps: 2 });
    expect(css).toContain('[data-theme] {');
  });
});
