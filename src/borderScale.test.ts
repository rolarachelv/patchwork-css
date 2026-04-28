import {
  generateBorderScale,
  stepLabel,
  roundTo,
} from './borderScale';
import { borderScaleToTokens, generateBorderCSS, borderRadiusVar, borderWidthVar } from './borderTokenIntegration';

describe('generateBorderScale', () => {
  it('should include a none and full radius token', () => {
    const tokens = generateBorderScale();
    expect(tokens['border-radius-none'].value).toBe('0px');
    expect(tokens['border-radius-full'].value).toBe('9999px');
  });

  it('should generate the correct number of radius steps', () => {
    const tokens = generateBorderScale({ radiusSteps: 4 });
    const radiusKeys = Object.keys(tokens).filter(
      (k) => k.startsWith('border-radius-') && k !== 'border-radius-none' && k !== 'border-radius-full'
    );
    expect(radiusKeys).toHaveLength(4);
  });

  it('should use the provided base radius', () => {
    const tokens = generateBorderScale({ baseRadius: 2, radiusSteps: 1 });
    expect(tokens['border-radius-sm'].value).toBe('2px');
  });

  it('should generate width tokens for each provided width', () => {
    const tokens = generateBorderScale({ widths: [1, 2] });
    expect(tokens['border-width-1'].value).toBe('1px');
    expect(tokens['border-width-2'].value).toBe('2px');
  });

  it('should use rem unit when specified', () => {
    const tokens = generateBorderScale({ radiusUnit: 'rem', baseRadius: 0.25, radiusSteps: 1 });
    expect(tokens['border-radius-sm'].value).toContain('rem');
  });
});

describe('stepLabel', () => {
  it('should return sm for index 1 when total is 6', () => {
    expect(stepLabel(1, 6)).toBe('sm');
  });

  it('should return a step label when total exceeds label list', () => {
    expect(stepLabel(9, 10)).toBe('step-9');
  });
});

describe('roundTo', () => {
  it('should round to the given number of decimals', () => {
    expect(roundTo(4.666, 2)).toBe(4.67);
    expect(roundTo(1.005, 2)).toBe(1.01);
  });
});

describe('borderTokenIntegration', () => {
  it('borderScaleToTokens should return token map', () => {
    const tokens = borderScaleToTokens();
    expect(Object.keys(tokens).length).toBeGreaterThan(0);
  });

  it('generateBorderCSS should return a non-empty string', () => {
    const css = generateBorderCSS();
    expect(typeof css).toBe('string');
    expect(css.length).toBeGreaterThan(0);
  });

  it('borderRadiusVar should return a CSS var reference', () => {
    const ref = borderRadiusVar('md');
    expect(ref).toMatch(/^var\(--/);
  });

  it('borderWidthVar should return a CSS var reference', () => {
    const ref = borderWidthVar(2);
    expect(ref).toMatch(/^var\(--/);
  });
});
