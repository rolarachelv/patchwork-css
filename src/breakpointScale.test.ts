import {
  generateBreakpointScale,
  breakpointScaleToTokens,
  breakpointVar,
  generateBreakpointCSS,
} from './breakpointScale';

const config = {
  breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
};

describe('generateBreakpointScale', () => {
  it('returns results sorted by value ascending', () => {
    const scale = generateBreakpointScale(config);
    const values = scale.map((s) => s.value);
    expect(values).toEqual([640, 768, 1024, 1280, 1536]);
  });

  it('uses px unit by default', () => {
    const scale = generateBreakpointScale(config);
    expect(scale[0].css).toBe('640px');
  });

  it('respects custom unit', () => {
    const scale = generateBreakpointScale({ ...config, unit: 'em' });
    expect(scale[0].css).toBe('640em');
  });

  it('includes name and value on each entry', () => {
    const scale = generateBreakpointScale(config);
    const md = scale.find((s) => s.name === 'md');
    expect(md).toMatchObject({ name: 'md', value: 768, css: '768px' });
  });

  it('handles a single breakpoint', () => {
    const scale = generateBreakpointScale({ breakpoints: { mobile: 480 } });
    expect(scale).toHaveLength(1);
    expect(scale[0]).toMatchObject({ name: 'mobile', value: 480, css: '480px' });
  });
});

describe('breakpointScaleToTokens', () => {
  it('keys tokens with breakpoint prefix', () => {
    const scale = generateBreakpointScale(config);
    const tokens = breakpointScaleToTokens(scale);
    expect(tokens['breakpoint.sm']).toBe('640px');
    expect(tokens['breakpoint.xl']).toBe('1280px');
  });

  it('returns one token per breakpoint', () => {
    const scale = generateBreakpointScale(config);
    const tokens = breakpointScaleToTokens(scale);
    expect(Object.keys(tokens)).toHaveLength(5);
  });
});

describe('breakpointVar', () => {
  it('returns a CSS var reference', () => {
    expect(breakpointVar('md')).toBe('var(--breakpoint-md)');
  });
});

describe('generateBreakpointCSS', () => {
  it('wraps declarations in :root by default', () => {
    const scale = generateBreakpointScale({ breakpoints: { sm: 640 } });
    const css = generateBreakpointCSS(scale);
    expect(css).toContain(':root {');
    expect(css).toContain('--breakpoint-sm: 640px;');
  });

  it('accepts a custom selector', () => {
    const scale = generateBreakpointScale({ breakpoints: { sm: 640 } });
    const css = generateBreakpointCSS(scale, '.theme');
    expect(css).toContain('.theme {');
  });
});
