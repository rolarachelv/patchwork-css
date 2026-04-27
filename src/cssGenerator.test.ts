import { generateCSS, tokenKeyToCSSVar } from './cssGenerator';
import { TokenMap } from './types';

describe('tokenKeyToCSSVar', () => {
  it('converts dot-separated keys to CSS variable names', () => {
    expect(tokenKeyToCSSVar('color.primary.500')).toBe('--color-primary-500');
  });

  it('handles single-level keys', () => {
    expect(tokenKeyToCSSVar('spacing')).toBe('--spacing');
  });

  it('replaces invalid characters with hyphens', () => {
    expect(tokenKeyToCSSVar('color primary')).toBe('--color-primary');
  });

  it('collapses multiple hyphens', () => {
    expect(tokenKeyToCSSVar('color..primary')).toBe('--color-primary');
  });
});

describe('generateCSS', () => {
  const tokens: TokenMap = {
    'color.primary': '#3b82f6',
    'color.secondary': '#6366f1',
    'spacing.sm': '0.5rem',
    'spacing.md': '1rem',
  };

  it('generates a :root block by default', () => {
    const result = generateCSS(tokens);
    expect(result).toContain(':root {');
    expect(result).toContain('--color-primary: #3b82f6;');
    expect(result).toContain('--spacing-md: 1rem;');
  });

  it('uses a custom selector when provided', () => {
    const result = generateCSS(tokens, { selector: '.theme' });
    expect(result).toStartWith('.theme {');
  });

  it('uses custom indentation', () => {
    const result = generateCSS({ 'color.base': '#fff' }, { indent: '    ' });
    expect(result).toContain('    --color-base: #fff;');
  });

  it('sorts keys when sortKeys is true', () => {
    const result = generateCSS(tokens, { sortKeys: true });
    const colorIdx = result.indexOf('--color-primary');
    const spacingIdx = result.indexOf('--spacing-sm');
    expect(colorIdx).toBeLessThan(spacingIdx);
  });

  it('handles an empty token map', () => {
    const result = generateCSS({});
    expect(result).toBe(':root {\n}');
  });
});
