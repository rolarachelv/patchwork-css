import { generateGridScale, gridScaleToTokens, generateGridCSS } from './gridScale';

/**
 * Integration tests verifying that gridScale tokens compose correctly
 * with the broader token pipeline conventions used in patchwork-css.
 */

describe('gridScale token integration', () => {
  const defaultScale = generateGridScale();

  it('produces a flat token map of string values', () => {
    const tokens = gridScaleToTokens(defaultScale);
    Object.values(tokens).forEach((val) => {
      expect(typeof val).toBe('string');
    });
  });

  it('token keys use kebab-case without leading --', () => {
    const tokens = gridScaleToTokens(defaultScale);
    Object.keys(tokens).forEach((key) => {
      expect(key).toMatch(/^[a-z0-9-]+$/);
      expect(key).not.toMatch(/^--/);
    });
  });

  it('CSS output wraps all tokens as custom properties', () => {
    const css = generateGridCSS(defaultScale);
    const tokens = gridScaleToTokens(defaultScale);
    Object.keys(tokens).forEach((key) => {
      expect(css).toContain(`--${key}`);
    });
  });

  it('column token values are numeric strings', () => {
    const tokens = gridScaleToTokens(defaultScale);
    const colEntries = Object.entries(tokens).filter(([k]) =>
      k.startsWith('grid-columns-')
    );
    expect(colEntries.length).toBeGreaterThan(0);
    colEntries.forEach(([, val]) => {
      expect(Number.isFinite(Number(val))).toBe(true);
    });
  });

  it('gutter and margin values include a CSS unit', () => {
    const tokens = gridScaleToTokens(defaultScale);
    const scaleEntries = Object.entries(tokens).filter(
      ([k]) => k.startsWith('grid-gutter-') || k.startsWith('grid-margin-')
    );
    expect(scaleEntries.length).toBeGreaterThan(0);
    scaleEntries.forEach(([, val]) => {
      expect(val).toMatch(/\d+(px|rem|em|vw|vh)$/);
    });
  });

  it('custom config propagates through the full pipeline', () => {
    const scale = generateGridScale({
      columns: [6, 12],
      gutterBase: 8,
      gutterSteps: 2,
      marginBase: 32,
      marginSteps: 2,
      unit: 'rem',
    });
    const tokens = gridScaleToTokens(scale);
    expect(tokens).toHaveProperty('grid-columns-col-6', '6');
    expect(tokens).toHaveProperty('grid-columns-col-12', '12');
    const gutterVals = Object.entries(tokens)
      .filter(([k]) => k.startsWith('grid-gutter-'))
      .map(([, v]) => v);
    gutterVals.forEach((v) => expect(v).toMatch(/rem$/));
  });
});
