import {
  generateBorderRadiusScale,
  borderRadiusScaleToTokens,
  borderRadiusVar,
  generateBorderRadiusCSS,
} from './borderRadiusScale';

describe('generateBorderRadiusScale', () => {
  it('generates default scale with 5 steps', () => {
    const scale = generateBorderRadiusScale();
    expect(scale.steps).toHaveLength(5);
  });

  it('assigns correct labels for default steps', () => {
    const scale = generateBorderRadiusScale({ steps: 5 });
    const labels = scale.steps.map((s) => s.label);
    expect(labels).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
  });

  it('computes values as multiples of base', () => {
    const scale = generateBorderRadiusScale({ steps: 3, base: 4, unit: 'px' });
    expect(scale.steps[0].value).toBe('4px');
    expect(scale.steps[1].value).toBe('8px');
    expect(scale.steps[2].value).toBe('12px');
  });

  it('includes round and full by default', () => {
    const scale = generateBorderRadiusScale();
    expect(scale.round).toBe('50%');
    expect(scale.full).toBe('9999px');
  });

  it('excludes round when includeRound is false', () => {
    const scale = generateBorderRadiusScale({ includeRound: false });
    expect(scale.round).toBeUndefined();
  });

  it('excludes full when includeFull is false', () => {
    const scale = generateBorderRadiusScale({ includeFull: false });
    expect(scale.full).toBeUndefined();
  });

  it('respects custom unit', () => {
    const scale = generateBorderRadiusScale({ steps: 1, base: 0.5, unit: 'rem' });
    expect(scale.steps[0].value).toBe('0.5rem');
  });
});

describe('borderRadiusScaleToTokens', () => {
  it('maps steps to token keys', () => {
    const scale = generateBorderRadiusScale({ steps: 2 });
    const tokens = borderRadiusScaleToTokens(scale);
    expect(tokens['border-radius-xs']).toBe('4px');
    expect(tokens['border-radius-sm']).toBe('8px');
  });

  it('includes round and full tokens', () => {
    const scale = generateBorderRadiusScale();
    const tokens = borderRadiusScaleToTokens(scale);
    expect(tokens['border-radius-round']).toBe('50%');
    expect(tokens['border-radius-full']).toBe('9999px');
  });

  it('respects custom prefix', () => {
    const scale = generateBorderRadiusScale({ steps: 1 });
    const tokens = borderRadiusScaleToTokens(scale, 'radius');
    expect(tokens['radius-xs']).toBeDefined();
  });
});

describe('borderRadiusVar', () => {
  it('returns a CSS var reference', () => {
    expect(borderRadiusVar('md')).toBe('var(--border-radius-md)');
  });

  it('uses custom prefix', () => {
    expect(borderRadiusVar('sm', 'radius')).toBe('var(--radius-sm)');
  });
});

describe('generateBorderRadiusCSS', () => {
  it('outputs a :root block with declarations', () => {
    const scale = generateBorderRadiusScale({ steps: 2, includeRound: false, includeFull: false });
    const css = generateBorderRadiusCSS(scale);
    expect(css).toContain(':root {');
    expect(css).toContain('--border-radius-xs: 4px;');
    expect(css).toContain('--border-radius-sm: 8px;');
  });

  it('accepts a custom selector', () => {
    const scale = generateBorderRadiusScale({ steps: 1 });
    const css = generateBorderRadiusCSS(scale, 'border-radius', '.theme');
    expect(css).toContain('.theme {');
  });
});
