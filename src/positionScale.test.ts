import {
  generatePositionScale,
  positionScaleToTokens,
  positionVar,
  generatePositionCSS,
  PositionValue,
} from './positionScale';

describe('generatePositionScale', () => {
  it('returns all default position tokens', () => {
    const tokens = generatePositionScale();
    expect(tokens).toHaveLength(5);
    expect(tokens.map((t) => t.value)).toEqual([
      'static', 'relative', 'absolute', 'fixed', 'sticky',
    ]);
  });

  it('uses default prefix "position"', () => {
    const tokens = generatePositionScale();
    expect(tokens[0].key).toBe('position-static');
    expect(tokens[0].cssVar).toBe('--position-static');
  });

  it('respects custom prefix', () => {
    const tokens = generatePositionScale({ prefix: 'pos' });
    expect(tokens[0].key).toBe('pos-static');
    expect(tokens[0].cssVar).toBe('--pos-static');
  });

  it('respects custom values', () => {
    const values: PositionValue[] = ['relative', 'absolute'];
    const tokens = generatePositionScale({ values });
    expect(tokens).toHaveLength(2);
    expect(tokens.map((t) => t.value)).toEqual(values);
  });
});

describe('positionScaleToTokens', () => {
  it('converts tokens to key-value record', () => {
    const tokens = generatePositionScale({ values: ['relative', 'fixed'] });
    const result = positionScaleToTokens(tokens);
    expect(result).toEqual({
      'position-relative': 'relative',
      'position-fixed': 'fixed',
    });
  });
});

describe('positionVar', () => {
  it('returns a CSS var reference with default prefix', () => {
    expect(positionVar('sticky')).toBe('var(--position-sticky)');
  });

  it('returns a CSS var reference with custom prefix', () => {
    expect(positionVar('absolute', 'pos')).toBe('var(--pos-absolute)');
  });
});

describe('generatePositionCSS', () => {
  it('generates CSS with :root selector by default', () => {
    const tokens = generatePositionScale({ values: ['relative'] });
    const css = generatePositionCSS(tokens);
    expect(css).toBe(':root {\n  --position-relative: relative;\n}');
  });

  it('uses a custom selector', () => {
    const tokens = generatePositionScale({ values: ['fixed'] });
    const css = generatePositionCSS(tokens, '.theme');
    expect(css).toContain('.theme {');
  });
});
