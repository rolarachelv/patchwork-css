import {
  generateLetterSpacingScale,
  letterSpacingScaleToTokens,
  letterSpacingVar,
  generateLetterSpacingCSS,
} from './letterSpacingScale';

describe('generateLetterSpacingScale', () => {
  it('generates a default scale with 5 steps', () => {
    const scale = generateLetterSpacingScale();
    expect(scale.steps).toHaveLength(5);
  });

  it('uses default base of 0 and unit em', () => {
    const scale = generateLetterSpacingScale();
    expect(scale.base).toBe(0);
    expect(scale.unit).toBe('em');
  });

  it('assigns correct labels for 5 steps', () => {
    const scale = generateLetterSpacingScale({ steps: 5 });
    const labels = scale.steps.map((s) => s.label);
    expect(labels).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
  });

  it('generates step-N labels when steps exceed label list', () => {
    const scale = generateLetterSpacingScale({ steps: 9 });
    expect(scale.steps[0].label).toBe('step-1');
  });

  it('respects custom ratio', () => {
    const scale = generateLetterSpacingScale({ steps: 3, ratio: 0.05 });
    const values = scale.steps.map((s) => s.value);
    expect(values[2] - values[1]).toBeCloseTo(0.05);
  });

  it('respects custom unit', () => {
    const scale = generateLetterSpacingScale({ unit: 'px' });
    scale.steps.forEach((step) => {
      expect(step.css).toContain('px');
    });
  });

  it('produces a single step with label base', () => {
    const scale = generateLetterSpacingScale({ steps: 1 });
    expect(scale.steps[0].label).toBe('base');
  });
});

describe('letterSpacingScaleToTokens', () => {
  it('returns a record keyed by letter-spacing-{label}', () => {
    const scale = generateLetterSpacingScale({ steps: 3 });
    const tokens = letterSpacingScaleToTokens(scale);
    expect(Object.keys(tokens)).toContain('letter-spacing-xs');
    expect(Object.keys(tokens)).toContain('letter-spacing-md');
  });

  it('values match css strings from scale', () => {
    const scale = generateLetterSpacingScale({ steps: 3 });
    const tokens = letterSpacingScaleToTokens(scale);
    scale.steps.forEach((step) => {
      expect(tokens[`letter-spacing-${step.label}`]).toBe(step.css);
    });
  });
});

describe('letterSpacingVar', () => {
  it('returns a CSS var reference', () => {
    expect(letterSpacingVar('md')).toBe('var(--letter-spacing-md)');
  });
});

describe('generateLetterSpacingCSS', () => {
  it('wraps tokens in :root by default', () => {
    const tokens = { 'letter-spacing-md': '0em' };
    const css = generateLetterSpacingCSS(tokens);
    expect(css).toContain(':root {');
    expect(css).toContain('--letter-spacing-md: 0em;');
  });

  it('uses a custom selector', () => {
    const tokens = { 'letter-spacing-sm': '-0.025em' };
    const css = generateLetterSpacingCSS(tokens, '.theme');
    expect(css).toContain('.theme {');
  });
});
