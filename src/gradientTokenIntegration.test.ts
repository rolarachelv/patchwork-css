import {
  gradientScaleToTokens,
  gradientVar,
  gradientVarMap,
  generateGradientCSS,
} from './gradientTokenIntegration';
import { GradientScaleOptions } from './gradientScale';

const baseOptions: GradientScaleOptions = {
  fromColor: '#ffffff',
  toColor: '#000000',
  steps: 3,
  direction: 'to right',
};

describe('gradientScaleToTokens', () => {
  it('returns a token map with correct keys', () => {
    const tokens = gradientScaleToTokens(baseOptions);
    const keys = Object.keys(tokens);
    expect(keys.length).toBe(3);
    keys.forEach((key) => expect(key).toMatch(/^gradient-/));
  });

  it('respects a custom prefix', () => {
    const tokens = gradientScaleToTokens(baseOptions, 'bg');
    Object.keys(tokens).forEach((key) => expect(key).toMatch(/^bg-/));
  });

  it('values are non-empty strings', () => {
    const tokens = gradientScaleToTokens(baseOptions);
    Object.values(tokens).forEach((val) => {
      expect(typeof val).toBe('string');
      expect(val.length).toBeGreaterThan(0);
    });
  });
});

describe('gradientVar', () => {
  it('returns a CSS var reference', () => {
    expect(gradientVar('100')).toBe('var(--gradient-100)');
  });

  it('uses custom prefix', () => {
    expect(gradientVar('200', 'bg')).toBe('var(--bg-200)');
  });
});

describe('gradientVarMap', () => {
  it('returns a map of label to CSS var', () => {
    const map = gradientVarMap(baseOptions);
    Object.entries(map).forEach(([label, ref]) => {
      expect(ref).toBe(`var(--gradient-${label})`);
    });
  });

  it('has the same number of entries as steps', () => {
    const map = gradientVarMap(baseOptions);
    expect(Object.keys(map).length).toBe(3);
  });
});

describe('generateGradientCSS', () => {
  it('outputs a :root block by default', () => {
    const css = generateGradientCSS(baseOptions);
    expect(css).toMatch(/^:root \{/);
    expect(css).toMatch(/\}$/);
  });

  it('contains custom property declarations', () => {
    const css = generateGradientCSS(baseOptions);
    expect(css).toMatch(/--gradient-/);
  });

  it('respects a custom selector', () => {
    const css = generateGradientCSS(baseOptions, 'gradient', '.theme');
    expect(css).toMatch(/^\.theme \{/);
  });

  it('has the correct number of declarations', () => {
    const css = generateGradientCSS(baseOptions);
    const lines = css.split('\n').filter((l) => l.trim().startsWith('--'));
    expect(lines.length).toBe(3);
  });
});
