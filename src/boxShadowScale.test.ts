import {
  generateBoxShadowScale,
  boxShadowScaleToTokens,
  boxShadowVar,
  generateBoxShadowCSS,
} from './boxShadowScale';

describe('generateBoxShadowScale', () => {
  it('generates the correct number of steps', () => {
    const scale = generateBoxShadowScale({ steps: 4 });
    expect(scale).toHaveLength(4);
  });

  it('uses default config when no options provided', () => {
    const scale = generateBoxShadowScale();
    expect(scale).toHaveLength(5);
  });

  it('assigns correct labels for default step count', () => {
    const scale = generateBoxShadowScale({ steps: 5 });
    const labels = scale.map(s => s.label);
    expect(labels).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
  });

  it('scales offsetY by factor', () => {
    const scale = generateBoxShadowScale({ steps: 3, baseOffsetY: 2 });
    expect(scale[0].offsetY).toBe(2);
    expect(scale[1].offsetY).toBe(4);
    expect(scale[2].offsetY).toBe(6);
  });

  it('scales blurRadius by factor', () => {
    const scale = generateBoxShadowScale({ steps: 2, baseBlur: 4 });
    expect(scale[0].blurRadius).toBe(4);
    expect(scale[1].blurRadius).toBe(8);
  });

  it('uses custom color', () => {
    const scale = generateBoxShadowScale({ steps: 1, color: 'rgba(0,0,0,0.5)' });
    expect(scale[0].color).toBe('rgba(0,0,0,0.5)');
    expect(scale[0].value).toContain('rgba(0,0,0,0.5)');
  });

  it('falls back to step labels when steps exceed named labels', () => {
    const scale = generateBoxShadowScale({ steps: 10 });
    expect(scale[8].label).toBe('step-9');
  });
});

describe('boxShadowScaleToTokens', () => {
  it('produces a token map with correct keys', () => {
    const scale = generateBoxShadowScale({ steps: 2 });
    const tokens = boxShadowScaleToTokens(scale);
    expect(tokens).toHaveProperty('box-shadow-xs');
    expect(tokens).toHaveProperty('box-shadow-sm');
  });

  it('respects custom prefix', () => {
    const scale = generateBoxShadowScale({ steps: 1 });
    const tokens = boxShadowScaleToTokens(scale, 'shadow');
    expect(tokens).toHaveProperty('shadow-default');
  });
});

describe('boxShadowVar', () => {
  it('returns a CSS variable reference', () => {
    expect(boxShadowVar('md')).toBe('var(--box-shadow-md)');
  });

  it('uses custom prefix', () => {
    expect(boxShadowVar('lg', 'shadow')).toBe('var(--shadow-lg)');
  });
});

describe('generateBoxShadowCSS', () => {
  it('wraps tokens in a selector block', () => {
    const tokens = { 'box-shadow-xs': '0px 2px 4px 0px rgba(0,0,0,0.15)' };
    const css = generateBoxShadowCSS(tokens);
    expect(css).toContain(':root {');
    expect(css).toContain('--box-shadow-xs: 0px 2px 4px 0px rgba(0,0,0,0.15);');
  });

  it('uses custom selector', () => {
    const tokens = { 'box-shadow-sm': '0px 4px 8px 0px rgba(0,0,0,0.15)' };
    const css = generateBoxShadowCSS(tokens, '.theme');
    expect(css).toContain('.theme {');
  });
});
