import { validateTokens } from './tokenValidator';

describe('validateTokens', () => {
  it('returns valid for a flat token map with simple values', () => {
    const result = validateTokens({ primary: '#3366ff', spacing: '8px' });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns valid for nested token objects', () => {
    const result = validateTokens({
      color: { brand: '#ff0000', muted: '#aaaaaa' },
      size: { base: '1rem' },
    });
    expect(result.valid).toBe(true);
  });

  it('returns valid for reference values', () => {
    const result = validateTokens({ background: '{color.brand}' });
    expect(result.valid).toBe(true);
  });

  it('returns an error for an empty string value', () => {
    const result = validateTokens({ emptyToken: '' });
    expect(result.valid).toBe(false);
    expect(result.errors[0].path).toBe('emptyToken');
    expect(result.errors[0].message).toMatch(/must not be empty/);
  });

  it('returns an error for an invalid key starting with a number', () => {
    const result = validateTokens({ '1invalid': '16px' });
    expect(result.valid).toBe(false);
    expect(result.errors[0].path).toBe('1invalid');
    expect(result.errors[0].message).toMatch(/Invalid token key/);
  });

  it('returns an error for a key with spaces', () => {
    const result = validateTokens({ 'bad key': '1rem' });
    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toMatch(/Invalid token key/);
  });

  it('returns an error for an unknown CSS unit', () => {
    const result = validateTokens({ size: '12xx' });
    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toMatch(/Unknown unit/);
  });

  it('accumulates multiple errors across nested tokens', () => {
    const result = validateTokens({
      color: { '2bad': '', valid: '1rem' },
      '3also-bad': '10zz',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  it('includes the full dotted path in nested errors', () => {
    const result = validateTokens({ spacing: { '1invalid': '8px' } });
    expect(result.errors[0].path).toBe('spacing.1invalid');
  });
});
