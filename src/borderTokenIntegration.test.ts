import {
  borderScaleToTokens,
  generateBorderCSS,
  borderRadiusVar,
  borderWidthVar,
} from './borderTokenIntegration';
import { generateBorderScale } from './borderScale';

describe('borderScaleToTokens', () => {
  const scale = generateBorderScale({ steps: 4, baseRadius: 4, baseWidth: 1 });

  it('produces radius and width token keys for each step', () => {
    const tokens = borderScaleToTokens(scale);
    expect(tokens).toHaveProperty('border-radius-1');
    expect(tokens).toHaveProperty('border-radius-4');
    expect(tokens).toHaveProperty('border-width-1');
    expect(tokens).toHaveProperty('border-width-4');
  });

  it('stores string values for all tokens', () => {
    const tokens = borderScaleToTokens(scale);
    Object.values(tokens).forEach((v) => expect(typeof v).toBe('string'));
  });

  it('includes a border-radius-none token with value 0', () => {
    const tokens = borderScaleToTokens(scale);
    expect(tokens['border-radius-none']).toBe('0px');
  });

  it('includes a border-radius-full token', () => {
    const tokens = borderScaleToTokens(scale);
    expect(tokens['border-radius-full']).toBe('9999px');
  });
});

describe('generateBorderCSS', () => {
  const scale = generateBorderScale({ steps: 3, baseRadius: 4, baseWidth: 1 });

  it('returns a non-empty CSS string', () => {
    const css = generateBorderCSS(scale);
    expect(typeof css).toBe('string');
    expect(css.length).toBeGreaterThan(0);
  });

  it('contains CSS custom property declarations', () => {
    const css = generateBorderCSS(scale);
    expect(css).toContain('--border-radius-');
    expect(css).toContain('--border-width-');
  });

  it('wraps output in :root block', () => {
    const css = generateBorderCSS(scale);
    expect(css.trim()).toMatch(/^:root\s*\{/);
    expect(css.trim()).toMatch(/\}\s*$/);
  });
});

describe('borderRadiusVar / borderWidthVar', () => {
  it('returns correct var() reference for radius', () => {
    expect(borderRadiusVar(2)).toBe('var(--border-radius-2)');
  });

  it('returns correct var() reference for width', () => {
    expect(borderWidthVar(3)).toBe('var(--border-width-3)');
  });

  it('supports string step labels', () => {
    expect(borderRadiusVar('full')).toBe('var(--border-radius-full)');
    expect(borderRadiusVar('none')).toBe('var(--border-radius-none)');
  });
});
