import { resolveReferences, isReference, extractReferenceKey } from './variableResolver';
import { FlatTokenMap } from './types';

describe('isReference', () => {
  it('returns true for valid reference strings', () => {
    expect(isReference('{color.primary}')).toBe(true);
    expect(isReference('{spacing.base}')).toBe(true);
  });

  it('returns false for non-reference strings', () => {
    expect(isReference('#ff0000')).toBe(false);
    expect(isReference('16px')).toBe(false);
    expect(isReference('')).toBe(false);
  });
});

describe('extractReferenceKey', () => {
  it('extracts the key from a reference string', () => {
    expect(extractReferenceKey('{color.primary}')).toBe('color.primary');
    expect(extractReferenceKey('{spacing.base}')).toBe('spacing.base');
  });

  it('returns null for non-reference strings', () => {
    expect(extractReferenceKey('#ff0000')).toBeNull();
    expect(extractReferenceKey('16px')).toBeNull();
  });
});

describe('resolveReferences', () => {
  it('resolves a simple token reference', () => {
    const tokens: FlatTokenMap = {
      'color.primary': '#3498db',
      'button.background': '{color.primary}',
    };
    const result = resolveReferences(tokens);
    expect(result['button.background']).toBe('#3498db');
  });

  it('resolves chained references', () => {
    const tokens: FlatTokenMap = {
      'color.blue': '#3498db',
      'color.primary': '{color.blue}',
      'button.background': '{color.primary}',
    };
    const result = resolveReferences(tokens);
    expect(result['button.background']).toBe('#3498db');
    expect(result['color.primary']).toBe('#3498db');
  });

  it('leaves non-reference values unchanged', () => {
    const tokens: FlatTokenMap = {
      'color.primary': '#3498db',
      'spacing.base': '8px',
    };
    const result = resolveReferences(tokens);
    expect(result['color.primary']).toBe('#3498db');
    expect(result['spacing.base']).toBe('8px');
  });

  it('warns and leaves unresolvable references as-is', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const tokens: FlatTokenMap = {
      'button.background': '{color.missing}',
    };
    const result = resolveReferences(tokens);
    expect(result['button.background']).toBe('{color.missing}');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
