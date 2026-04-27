import { generateTypographyScale, stepLabel } from './typographyScale';

describe('stepLabel', () => {
  it('returns correct labels for known steps', () => {
    expect(stepLabel(0)).toBe('base');
    expect(stepLabel(1)).toBe('lg');
    expect(stepLabel(-1)).toBe('sm');
    expect(stepLabel(3)).toBe('2xl');
    expect(stepLabel(-2)).toBe('xs');
  });

  it('returns fallback labels for unknown steps', () => {
    expect(stepLabel(6)).toBe('p6');
    expect(stepLabel(-4)).toBe('n4');
  });
});

describe('generateTypographyScale', () => {
  const baseOptions = {
    baseSize: 1,
    ratio: 1.25,
    steps: [-1, 0, 1, 2, 3],
  };

  it('generates tokens for each step', () => {
    const { tokens } = generateTypographyScale(baseOptions);
    const sizes = (tokens.typography as any).fontSize;
    expect(Object.keys(sizes)).toEqual(['sm', 'base', 'lg', 'xl', '2xl']);
  });

  it('uses rem as default unit', () => {
    const { tokens } = generateTypographyScale(baseOptions);
    expect((tokens.typography as any).fontSize['base']).toBe('1rem');
  });

  it('respects custom unit', () => {
    const { tokens } = generateTypographyScale({ ...baseOptions, unit: 'px', baseSize: 16 });
    expect((tokens.typography as any).fontSize['base']).toBe('16px');
  });

  it('returns numeric scale values', () => {
    const { scale } = generateTypographyScale(baseOptions);
    expect(scale['base']).toBe(1);
    expect(scale['lg']).toBeCloseTo(1.25, 2);
  });

  it('throws on invalid baseSize', () => {
    expect(() => generateTypographyScale({ ...baseOptions, baseSize: 0 })).toThrow();
  });

  it('throws on invalid ratio', () => {
    expect(() => generateTypographyScale({ ...baseOptions, ratio: -1 })).toThrow();
  });

  it('throws on empty steps', () => {
    expect(() => generateTypographyScale({ ...baseOptions, steps: [] })).toThrow();
  });

  it('rounds values to 4 decimal places', () => {
    const { scale } = generateTypographyScale({ baseSize: 1, ratio: 1.333, steps: [2] });
    const val = scale['xl'];
    expect(String(val).split('.')[1]?.length ?? 0).toBeLessThanOrEqual(4);
  });
});
