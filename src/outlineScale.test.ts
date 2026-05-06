import {
  generateOutlineScale,
  outlineScaleToTokens,
  outlineVar,
  generateOutlineCSS,
} from './outlineScale';

describe('generateOutlineScale', () => {
  it('generates a default scale with 4 steps', () => {
    const scale = generateOutlineScale();
    expect(Object.keys(scale)).toHaveLength(4);
  });

  it('uses correct default labels', () => {
    const scale = generateOutlineScale();
    expect(scale).toHaveProperty('outline-1');
    expect(scale).toHaveProperty('outline-4');
  });

  it('increments width by widthStep', () => {
    const scale = generateOutlineScale({ steps: 3, baseWidth: 1, widthStep: 2 });
    expect(scale['outline-1'].width).toBe('1px');
    expect(scale['outline-2'].width).toBe('3px');
    expect(scale['outline-3'].width).toBe('5px');
  });

  it('respects custom widthUnit', () => {
    const scale = generateOutlineScale({ steps: 1, widthUnit: 'rem' });
    expect(scale['outline-1'].width).toContain('rem');
  });

  it('cycles through styles', () => {
    const scale = generateOutlineScale({ steps: 5, styles: ['solid', 'dashed'] });
    expect(scale['outline-1'].style).toBe('solid');
    expect(scale['outline-2'].style).toBe('dashed');
    expect(scale['outline-3'].style).toBe('solid');
  });

  it('respects custom prefix', () => {
    const scale = generateOutlineScale({ steps: 2, prefix: 'focus' });
    expect(scale).toHaveProperty('focus-1');
    expect(scale).toHaveProperty('focus-2');
  });

  it('sets offset equal to width value', () => {
    const scale = generateOutlineScale({ steps: 1, baseWidth: 3 });
    expect(scale['outline-1'].offset).toBe('3px');
  });
});

describe('outlineScaleToTokens', () => {
  it('flattens scale into token map', () => {
    const scale = generateOutlineScale({ steps: 1 });
    const tokens = outlineScaleToTokens(scale);
    expect(tokens).toHaveProperty('outline-1-width');
    expect(tokens).toHaveProperty('outline-1-style');
    expect(tokens).toHaveProperty('outline-1-offset');
  });

  it('produces 3 tokens per step', () => {
    const scale = generateOutlineScale({ steps: 3 });
    const tokens = outlineScaleToTokens(scale);
    expect(Object.keys(tokens)).toHaveLength(9);
  });
});

describe('outlineVar', () => {
  it('returns correct CSS variable reference for width', () => {
    expect(outlineVar('outline-2', 'width')).toBe('var(--outline-2-width)');
  });

  it('returns correct CSS variable reference for style', () => {
    expect(outlineVar('outline-1', 'style')).toBe('var(--outline-1-style)');
  });
});

describe('generateOutlineCSS', () => {
  it('wraps declarations in :root by default', () => {
    const scale = generateOutlineScale({ steps: 1 });
    const css = generateOutlineCSS(scale);
    expect(css).toMatch(/^:root \{/);
  });

  it('uses custom selector when provided', () => {
    const scale = generateOutlineScale({ steps: 1 });
    const css = generateOutlineCSS(scale, '.theme');
    expect(css).toMatch(/^\.theme \{/);
  });

  it('includes all token declarations', () => {
    const scale = generateOutlineScale({ steps: 2 });
    const css = generateOutlineCSS(scale);
    expect(css).toContain('--outline-1-width');
    expect(css).toContain('--outline-2-style');
    expect(css).toContain('--outline-2-offset');
  });
});
