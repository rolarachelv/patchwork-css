import {
  generateListStyleScale,
  listStyleScaleToTokens,
  listStyleVar,
  generateListStyleCSS,
  ListStyleScaleConfig,
} from './listStyleScale';

describe('generateListStyleScale', () => {
  it('returns default list style tokens when no config provided', () => {
    const tokens = generateListStyleScale();
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens.some((t) => t.name === 'none')).toBe(true);
    expect(tokens.some((t) => t.name === 'disc')).toBe(true);
    expect(tokens.some((t) => t.name === 'decimal')).toBe(true);
  });

  it('returns only specified types when config.types is provided', () => {
    const config: ListStyleScaleConfig = { types: ['none', 'disc', 'square'] };
    const tokens = generateListStyleScale(config);
    expect(tokens).toHaveLength(3);
    expect(tokens.map((t) => t.name)).toEqual(['none', 'disc', 'square']);
  });

  it('maps token name and value to the same list-style keyword', () => {
    const tokens = generateListStyleScale({ types: ['lower-roman'] });
    expect(tokens[0]).toEqual({ name: 'lower-roman', value: 'lower-roman' });
  });
});

describe('listStyleScaleToTokens', () => {
  it('converts token array to a flat record with default prefix', () => {
    const tokens = generateListStyleScale({ types: ['none', 'disc'] });
    const record = listStyleScaleToTokens(tokens);
    expect(record).toEqual({
      'list-style-none': 'none',
      'list-style-disc': 'disc',
    });
  });

  it('uses a custom prefix when provided', () => {
    const tokens = generateListStyleScale({ types: ['circle'] });
    const record = listStyleScaleToTokens(tokens, 'ls');
    expect(record['ls-circle']).toBe('circle');
  });
});

describe('listStyleVar', () => {
  it('returns a CSS var string with default prefix', () => {
    expect(listStyleVar('disc')).toBe('var(--list-style-disc)');
  });

  it('returns a CSS var string with custom prefix', () => {
    expect(listStyleVar('square', 'ls')).toBe('var(--ls-square)');
  });
});

describe('generateListStyleCSS', () => {
  it('generates :root CSS block from token record', () => {
    const tokens = { 'list-style-none': 'none', 'list-style-disc': 'disc' };
    const css = generateListStyleCSS(tokens);
    expect(css).toContain(':root {');
    expect(css).toContain('--list-style-none: none;');
    expect(css).toContain('--list-style-disc: disc;');
  });

  it('uses a custom selector when provided', () => {
    const tokens = { 'list-style-none': 'none' };
    const css = generateListStyleCSS(tokens, '.theme');
    expect(css.startsWith('.theme {'));
  });
});
