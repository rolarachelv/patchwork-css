import {
  generateTextDecorationScale,
  textDecorationScaleToTokens,
  textDecorationVar,
  generateTextDecorationCSS,
} from './textDecorationScale';

describe('generateTextDecorationScale', () => {
  it('includes a none entry', () => {
    const scale = generateTextDecorationScale();
    expect(scale['none']).toBeDefined();
    expect(scale['none'].value).toBe('none');
  });

  it('generates keys combining line, style, and thickness', () => {
    const scale = generateTextDecorationScale();
    expect(scale['underline-solid-1']).toBeDefined();
    expect(scale['underline-solid-1'].value).toBe('underline solid 1px');
  });

  it('respects custom lines, styles, and thicknesses', () => {
    const scale = generateTextDecorationScale({
      lines: ['underline'],
      styles: ['dashed'],
      thicknesses: [2],
    });
    const keys = Object.keys(scale);
    expect(keys).toContain('underline-dashed-2');
    expect(keys).not.toContain('overline-dashed-2');
  });

  it('respects custom unit', () => {
    const scale = generateTextDecorationScale({
      lines: ['underline'],
      styles: ['solid'],
      thicknesses: [2],
      unit: 'rem',
    });
    expect(scale['underline-solid-2'].value).toBe('underline solid 2rem');
    expect(scale['underline-solid-2'].unit).toBe('rem');
  });

  it('does not include style/thickness entries for none', () => {
    const scale = generateTextDecorationScale({ lines: ['none', 'underline'], styles: ['solid'], thicknesses: [1] });
    expect(Object.keys(scale).filter(k => k.startsWith('none-'))).toHaveLength(0);
  });
});

describe('textDecorationScaleToTokens', () => {
  it('prefixes all keys correctly', () => {
    const scale = generateTextDecorationScale({ lines: ['none'], styles: [], thicknesses: [] });
    const tokens = textDecorationScaleToTokens(scale);
    expect(tokens['text-decoration-none']).toBe('none');
  });

  it('supports a custom prefix', () => {
    const scale = generateTextDecorationScale({ lines: ['none'], styles: [], thicknesses: [] });
    const tokens = textDecorationScaleToTokens(scale, 'td');
    expect(tokens['td-none']).toBe('none');
  });
});

describe('textDecorationVar', () => {
  it('returns a CSS var string', () => {
    expect(textDecorationVar('underline-solid-1')).toBe('var(--text-decoration-underline-solid-1)');
  });

  it('supports a custom prefix', () => {
    expect(textDecorationVar('none', 'td')).toBe('var(--td-none)');
  });
});

describe('generateTextDecorationCSS', () => {
  it('wraps declarations in :root', () => {
    const scale = generateTextDecorationScale({ lines: ['none'], styles: [], thicknesses: [] });
    const css = generateTextDecorationCSS(scale);
    expect(css).toMatch(/:root \{/);
    expect(css).toMatch(/--text-decoration-none: none;/);
  });

  it('uses a custom prefix in CSS output', () => {
    const scale = generateTextDecorationScale({ lines: ['none'], styles: [], thicknesses: [] });
    const css = generateTextDecorationCSS(scale, 'td');
    expect(css).toMatch(/--td-none: none;/);
  });
});
