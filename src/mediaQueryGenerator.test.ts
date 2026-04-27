import {
  generateMediaQueries,
  breakpointToMediaQuery,
  normaliseBreakpoints,
} from './mediaQueryGenerator';
import { DesignTokens, MediaQueryConfig } from './types';

describe('breakpointToMediaQuery', () => {
  it('returns a plain string unchanged', () => {
    expect(breakpointToMediaQuery('(min-width: 768px)')).toBe(
      '(min-width: 768px)'
    );
  });

  it('builds a min-width query from an object', () => {
    expect(breakpointToMediaQuery({ min: '768px' })).toBe(
      '(min-width: 768px)'
    );
  });

  it('builds a max-width query from an object', () => {
    expect(breakpointToMediaQuery({ max: '1024px' })).toBe(
      '(max-width: 1024px)'
    );
  });

  it('combines min and max into a range query', () => {
    expect(breakpointToMediaQuery({ min: '768px', max: '1024px' })).toBe(
      '(min-width: 768px) and (max-width: 1024px)'
    );
  });
});

describe('normaliseBreakpoints', () => {
  it('converts object breakpoints to query strings', () => {
    const result = normaliseBreakpoints({
      md: { min: '768px' },
      lg: '(min-width: 1024px)',
    });
    expect(result).toEqual({
      md: '(min-width: 768px)',
      lg: '(min-width: 1024px)',
    });
  });
});

describe('generateMediaQueries', () => {
  const tokens: DesignTokens = {
    md: { fontSize: { base: '18px' } },
    lg: { fontSize: { base: '20px' } },
  };

  const breakpoints: MediaQueryConfig = {
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
  };

  it('wraps token CSS in the correct media query blocks', () => {
    const result = generateMediaQueries(tokens, breakpoints);
    expect(result).toContain('@media (min-width: 768px)');
    expect(result).toContain('@media (min-width: 1024px)');
    expect(result).toContain('--font-size-base');
  });

  it('skips breakpoints with no matching tokens', () => {
    const result = generateMediaQueries({}, breakpoints);
    expect(result.trim()).toBe('');
  });
});
