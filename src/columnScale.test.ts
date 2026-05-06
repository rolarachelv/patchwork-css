import {
  generateColumnScale,
  columnScaleToTokens,
  columnVar,
  generateColumnCSS,
} from './columnScale';

describe('generateColumnScale', () => {
  it('generates the default 12-step scale', () => {
    const scale = generateColumnScale();
    expect(scale).toHaveLength(12);
  });

  it('uses default prefix "col"', () => {
    const scale = generateColumnScale();
    expect(scale[0].label).toBe('col-1');
    expect(scale[11].label).toBe('col-12');
  });

  it('respects custom steps', () => {
    const scale = generateColumnScale({ steps: 4 });
    expect(scale).toHaveLength(4);
  });

  it('respects custom minColumns and maxColumns', () => {
    const scale = generateColumnScale({ steps: 2, minColumns: 2, maxColumns: 6 });
    expect(scale[0].columns).toBe(2);
    expect(scale[1].columns).toBe(6);
  });

  it('sets fraction as "<n>fr"', () => {
    const scale = generateColumnScale({ steps: 1, minColumns: 3, maxColumns: 3 });
    expect(scale[0].fraction).toBe('3fr');
  });

  it('handles a single step', () => {
    const scale = generateColumnScale({ steps: 1, minColumns: 4, maxColumns: 4 });
    expect(scale).toHaveLength(1);
    expect(scale[0].columns).toBe(4);
  });
});

describe('columnScaleToTokens', () => {
  it('produces count and fraction tokens for each entry', () => {
    const scale = generateColumnScale({ steps: 2, minColumns: 1, maxColumns: 2 });
    const tokens = columnScaleToTokens(scale);
    expect(tokens['column-count-col-1']).toBe('1');
    expect(tokens['column-fraction-col-1']).toBe('1fr');
    expect(tokens['column-count-col-2']).toBe('2');
    expect(tokens['column-fraction-col-2']).toBe('2fr');
  });
});

describe('columnVar', () => {
  it('returns a CSS variable reference', () => {
    expect(columnVar('col-3')).toBe('var(--column-count-col-3)');
  });
});

describe('generateColumnCSS', () => {
  it('wraps tokens in a :root block', () => {
    const scale = generateColumnScale({ steps: 1, minColumns: 1, maxColumns: 1 });
    const css = generateColumnCSS(scale);
    expect(css).toContain(':root {');
    expect(css).toContain('--column-count-col-1: 1;');
    expect(css).toContain('--column-fraction-col-1: 1fr;');
  });
});
