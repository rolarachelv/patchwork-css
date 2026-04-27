import { transformTokens, transformToken, applyTokenDefaults } from './tokenTransformer';
import { DesignToken, TokenMap } from './types';

const numericToken = (value: number): DesignToken => ({ value, type: 'spacing' });
const stringToken = (value: string): DesignToken => ({ value, type: 'color' });

describe('transformToken', () => {
  it('scales a numeric value', () => {
    const result = transformToken(numericToken(4), { scale: 2 });
    expect(result.value).toBe(8);
  });

  it('appends a unit to a numeric value', () => {
    const result = transformToken(numericToken(16), { unit: 'px' });
    expect(result.value).toBe('16px');
  });

  it('applies scale before unit', () => {
    const result = transformToken(numericToken(4), { scale: 4, unit: 'rem' });
    expect(result.value).toBe('16rem');
  });

  it('clamps a numeric value within range', () => {
    const result = transformToken(numericToken(200), { clamp: { min: 0, max: 100 } });
    expect(result.value).toBe(100);
  });

  it('does not clamp when value is within range', () => {
    const result = transformToken(numericToken(50), { clamp: { min: 0, max: 100 } });
    expect(result.value).toBe(50);
  });

  it('prefixes a string value', () => {
    const result = transformToken(stringToken('red'), { prefix: 'color-' });
    expect(result.value).toBe('color-red');
  });

  it('does not prefix a reference value', () => {
    const result = transformToken(stringToken('$primary'), { prefix: 'color-' });
    expect(result.value).toBe('$primary');
  });

  it('preserves other token properties', () => {
    const token: DesignToken = { value: 8, type: 'spacing', description: 'base unit' };
    const result = transformToken(token, { unit: 'px' });
    expect(result.type).toBe('spacing');
    expect(result.description).toBe('base unit');
  });
});

describe('transformTokens', () => {
  it('transforms all tokens in a map', () => {
    const tokens: TokenMap = {
      'spacing.sm': numericToken(4),
      'spacing.md': numericToken(8),
    };
    const result = transformTokens(tokens, { unit: 'px' });
    expect(result['spacing.sm'].value).toBe('4px');
    expect(result['spacing.md'].value).toBe('8px');
  });

  it('returns an empty map when given empty input', () => {
    expect(transformTokens({}, { unit: 'px' })).toEqual({});
  });
});

describe('applyTokenDefaults', () => {
  it('applies defaults to tokens missing properties', () => {
    const tokens: TokenMap = { 'color.primary': { value: '#fff' } };
    const result = applyTokenDefaults(tokens, { type: 'color', group: 'brand' });
    expect(result['color.primary'].type).toBe('color');
    expect(result['color.primary'].group).toBe('brand');
  });

  it('does not override existing token properties', () => {
    const tokens: TokenMap = { 'spacing.md': { value: 8, type: 'spacing' } };
    const result = applyTokenDefaults(tokens, { type: 'size' });
    expect(result['spacing.md'].type).toBe('spacing');
  });
});
