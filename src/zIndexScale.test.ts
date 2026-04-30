import { describe, it, expect } from 'vitest';
import { generateZIndexScale, zIndexScaleToTokens, generateZIndexCSS } from './zIndexScale';

describe('generateZIndexScale', () => {
  it('generates a scale with default base and step', () => {
    const result = generateZIndexScale({ layers: ['base', 'raised', 'overlay', 'modal', 'toast'] });
    expect(result).toEqual({
      base: 0,
      raised: 10,
      overlay: 20,
      modal: 30,
      toast: 40,
    });
  });

  it('respects custom base and step', () => {
    const result = generateZIndexScale({ layers: ['default', 'sticky', 'popup'], base: 100, step: 50 });
    expect(result).toEqual({
      default: 100,
      sticky: 150,
      popup: 200,
    });
  });

  it('handles a single layer', () => {
    const result = generateZIndexScale({ layers: ['only'], base: 5, step: 1 });
    expect(result).toEqual({ only: 5 });
  });

  it('throws if layers is empty', () => {
    expect(() => generateZIndexScale({ layers: [] })).toThrow(
      'zIndexScale: layers must be a non-empty array'
    );
  });

  it('throws if step is zero or negative', () => {
    expect(() => generateZIndexScale({ layers: ['a', 'b'], step: 0 })).toThrow(
      'zIndexScale: step must be a positive number'
    );
    expect(() => generateZIndexScale({ layers: ['a', 'b'], step: -5 })).toThrow(
      'zIndexScale: step must be a positive number'
    );
  });

  it('throws on invalid layer name', () => {
    expect(() => generateZIndexScale({ layers: ['valid', ''] })).toThrow(
      'zIndexScale: invalid layer name at index 1'
    );
  });
});

describe('zIndexScaleToTokens', () => {
  it('converts scale to token map with default prefix', () => {
    const scale = generateZIndexScale({ layers: ['base', 'overlay'], base: 0, step: 10 });
    const tokens = zIndexScaleToTokens(scale);
    expect(tokens).toEqual({
      'zIndex.base': 0,
      'zIndex.overlay': 10,
    });
  });

  it('uses a custom prefix', () => {
    const scale = { modal: 300 };
    const tokens = zIndexScaleToTokens(scale, 'layer');
    expect(tokens).toEqual({ 'layer.modal': 300 });
  });
});

describe('generateZIndexCSS', () => {
  it('generates CSS custom properties', () => {
    const scale = { base: 0, overlay: 10, modal: 20 };
    const css = generateZIndexCSS(scale);
    expect(css).toContain('--z-index-base: 0;');
    expect(css).toContain('--z-index-overlay: 10;');
    expect(css).toContain('--z-index-modal: 20;');
  });

  it('uses a custom prefix', () => {
    const scale = { sticky: 100 };
    const css = generateZIndexCSS(scale, 'layer');
    expect(css).toContain('--layer-sticky: 100;');
  });
});
