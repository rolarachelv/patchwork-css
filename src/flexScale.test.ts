import {
  generateFlexScale,
  flexScaleToTokens,
  flexVar,
  generateFlexCSS,
} from './flexScale';

describe('generateFlexScale', () => {
  it('returns default scale when called with no config', () => {
    const scale = generateFlexScale();
    expect(scale.direction).toHaveProperty('row', 'row');
    expect(scale.direction).toHaveProperty('column', 'column');
    expect(scale.wrap).toHaveProperty('nowrap', 'nowrap');
    expect(scale.wrap).toHaveProperty('wrap', 'wrap');
    expect(scale.justifyContent).toHaveProperty('center', 'center');
    expect(scale.justifyContent).toHaveProperty('space-between', 'space-between');
    expect(scale.alignItems).toHaveProperty('stretch', 'stretch');
    expect(scale.grow).toHaveProperty('0', 0);
    expect(scale.grow).toHaveProperty('1', 1);
    expect(scale.shrink).toHaveProperty('0', 0);
  });

  it('uses custom directions when provided', () => {
    const scale = generateFlexScale({ directions: ['row', 'column'] });
    expect(Object.keys(scale.direction)).toEqual(['row', 'column']);
  });

  it('converts hyphenated values to step labels for keys', () => {
    const scale = generateFlexScale({ justifyContent: ['space-between', 'flex-start'] });
    expect(scale.justifyContent).toHaveProperty('space-between', 'space-between');
    expect(scale.justifyContent).toHaveProperty('flex-start', 'flex-start');
  });

  it('uses custom grows and shrinks', () => {
    const scale = generateFlexScale({ grows: [0, 1, 2], shrinks: [0, 1, 2] });
    expect(scale.grow).toHaveProperty('2', 2);
    expect(scale.shrink).toHaveProperty('2', 2);
  });
});

describe('flexScaleToTokens', () => {
  it('generates correctly prefixed token keys', () => {
    const scale = generateFlexScale();
    const tokens = flexScaleToTokens(scale);
    expect(tokens).toHaveProperty('flex-direction-row', 'row');
    expect(tokens).toHaveProperty('flex-wrap-nowrap', 'nowrap');
    expect(tokens).toHaveProperty('flex-justify-center', 'center');
    expect(tokens).toHaveProperty('flex-align-stretch', 'stretch');
    expect(tokens).toHaveProperty('flex-grow-1', 1);
    expect(tokens).toHaveProperty('flex-shrink-0', 0);
  });

  it('respects custom prefix', () => {
    const scale = generateFlexScale();
    const tokens = flexScaleToTokens(scale, 'layout');
    expect(tokens).toHaveProperty('layout-direction-row', 'row');
  });
});

describe('flexVar', () => {
  it('returns a CSS variable reference', () => {
    expect(flexVar('direction', 'row')).toBe('var(--flex-direction-row)');
  });

  it('uses custom prefix', () => {
    expect(flexVar('grow', '1', 'layout')).toBe('var(--layout-grow-1)');
  });
});

describe('generateFlexCSS', () => {
  it('outputs a :root block with CSS custom properties', () => {
    const scale = generateFlexScale({ directions: ['row'], wraps: ['wrap'], justifyContent: ['center'], alignItems: ['center'], grows: [1], shrinks: [0] });
    const css = generateFlexCSS(scale);
    expect(css).toContain(':root {');
    expect(css).toContain('--flex-direction-row: row;');
    expect(css).toContain('--flex-wrap-wrap: wrap;');
    expect(css).toContain('--flex-justify-center: center;');
    expect(css).toContain('--flex-align-center: center;');
    expect(css).toContain('--flex-grow-1: 1;');
    expect(css).toContain('--flex-shrink-0: 0;');
  });
});
