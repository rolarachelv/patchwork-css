import { generateSpacingScale } from './spacingScale';

describe('generateSpacingScale', () => {
  it('generates linear spacing by default', () => {
    const tokens = generateSpacingScale({ base: 0.25, steps: 4 });
    expect(tokens.spacing).toEqual({
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
    });
  });

  it('generates exponential spacing', () => {
    const tokens = generateSpacingScale({ base: 1, steps: 4, strategy: 'exponential' });
    const spacing = tokens.spacing as Record<string, string>;
    expect(spacing['1']).toBe('1rem');
    expect(spacing['2']).toBe('2rem');
    expect(spacing['3']).toBe('4rem');
    expect(spacing['4']).toBe('8rem');
  });

  it('generates fibonacci spacing', () => {
    const tokens = generateSpacingScale({ base: 1, steps: 5, strategy: 'fibonacci' });
    const spacing = tokens.spacing as Record<string, string>;
    expect(Object.keys(spacing)).toHaveLength(5);
    expect(spacing['1']).toBe('1rem');
  });

  it('respects px unit', () => {
    const tokens = generateSpacingScale({ base: 4, steps: 2, unit: 'px' });
    const spacing = tokens.spacing as Record<string, string>;
    expect(spacing['1']).toBe('4px');
    expect(spacing['2']).toBe('8px');
  });

  it('throws on non-positive base', () => {
    expect(() => generateSpacingScale({ base: 0, steps: 4 })).toThrow();
    expect(() => generateSpacingScale({ base: -1, steps: 4 })).toThrow();
  });

  it('throws when steps is less than 1', () => {
    expect(() => generateSpacingScale({ base: 1, steps: 0 })).toThrow();
  });

  it('rounds values to 3 decimal places', () => {
    const tokens = generateSpacingScale({ base: 0.333, steps: 1 });
    const spacing = tokens.spacing as Record<string, string>;
    const numStr = spacing['1'].replace('rem', '');
    expect(numStr.split('.')[1]?.length ?? 0).toBeLessThanOrEqual(3);
  });
});
