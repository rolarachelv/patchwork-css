import {
  generateGridScale,
  gridScaleToTokens,
  generateGridCSS,
  roundTo,
  stepLabel,
} from './gridScale';

describe('roundTo', () => {
  it('rounds to 4 decimal places by default', () => {
    expect(roundTo(1.23456789)).toBe(1.2346);
  });

  it('rounds to specified decimal places', () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
  });
});

describe('stepLabel', () => {
  it('returns "default" for a single step', () => {
    expect(stepLabel(0, 1)).toBe('default');
  });

  it('returns named labels for known indices', () => {
    expect(stepLabel(0, 5)).toBe('xs');
    expect(stepLabel(2, 5)).toBe('md');
    expect(stepLabel(4, 5)).toBe('xl');
  });

  it('falls back to step-N for out-of-range indices', () => {
    expect(stepLabel(8, 10)).toBe('step-9');
  });
});

describe('generateGridScale', () => {
  it('generates default grid scale', () => {
    const scale = generateGridScale();
    expect(scale.columns).toHaveProperty('col-12', 12);
    expect(scale.columns).toHaveProperty('col-1', 1);
    expect(Object.keys(scale.gutters).length).toBe(5);
    expect(Object.keys(scale.margins).length).toBe(5);
  });

  it('respects custom columns', () => {
    const scale = generateGridScale({ columns: [2, 4] });
    expect(Object.keys(scale.columns)).toEqual(['col-2', 'col-4']);
  });

  it('respects custom gutterBase and unit', () => {
    const scale = generateGridScale({ gutterBase: 8, gutterSteps: 1, unit: 'rem' });
    expect(scale.gutters['default']).toBe('8rem');
  });

  it('respects custom marginBase', () => {
    const scale = generateGridScale({ marginBase: 24, marginSteps: 1 });
    expect(scale.margins['default']).toBe('24px');
  });
});

describe('gridScaleToTokens', () => {
  it('prefixes columns with grid-columns-', () => {
    const scale = generateGridScale({ columns: [4] });
    const tokens = gridScaleToTokens(scale);
    expect(tokens).toHaveProperty('grid-columns-col-4', '4');
  });

  it('prefixes gutters with grid-gutter-', () => {
    const scale = generateGridScale({ gutterSteps: 1 });
    const tokens = gridScaleToTokens(scale);
    expect(tokens).toHaveProperty('grid-gutter-default');
  });

  it('prefixes margins with grid-margin-', () => {
    const scale = generateGridScale({ marginSteps: 1 });
    const tokens = gridScaleToTokens(scale);
    expect(tokens).toHaveProperty('grid-margin-default');
  });
});

describe('generateGridCSS', () => {
  it('generates CSS with :root selector by default', () => {
    const scale = generateGridScale({ columns: [4], gutterSteps: 1, marginSteps: 1 });
    const css = generateGridCSS(scale);
    expect(css).toMatch(/^:root \{/);
    expect(css).toMatch(/--grid-columns-col-4: 4;/);
    expect(css).toMatch(/--grid-gutter-default:/);
    expect(css).toMatch(/--grid-margin-default:/);
  });

  it('accepts a custom selector', () => {
    const scale = generateGridScale({ columns: [2], gutterSteps: 1, marginSteps: 1 });
    const css = generateGridCSS(scale, '.theme');
    expect(css).toMatch(/^\.theme \{/);
  });
});
