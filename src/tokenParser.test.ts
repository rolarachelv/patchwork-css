import { parseTokens } from './tokenParser';
import { DesignConfig } from './types';

describe('parseTokens', () => {
  it('flattens a simple flat config', () => {
    const config: DesignConfig = { fontSize: '16px', lineHeight: '1.5' };
    const result = parseTokens(config);
    expect(result).toEqual({
      fontSize: '16px',
      lineHeight: '1.5',
    });
  });

  it('flattens nested config with kebab-case keys', () => {
    const config: DesignConfig = {
      color: {
        primary: { 500: '#3b82f6', 600: '#2563eb' },
        neutral: { 100: '#f5f5f5' },
      },
    };
    const result = parseTokens(config);
    expect(result).toEqual({
      'color-primary-500': '#3b82f6',
      'color-primary-600': '#2563eb',
      'color-neutral-100': '#f5f5f5',
    });
  });

  it('converts numeric values to strings', () => {
    const config: DesignConfig = { spacing: { base: 4 } };
    const result = parseTokens(config);
    expect(result['spacing-base']).toBe('4');
  });

  it('skips unsupported array values with a warning', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const config = { shadows: ['0px 1px 2px #000'] } as unknown as DesignConfig;
    const result = parseTokens(config);
    expect(result).toEqual({});
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Skipping unsupported token value'),
    );
    consoleSpy.mockRestore();
  });

  it('returns an empty object for an empty config', () => {
    expect(parseTokens({})).toEqual({});
  });
});
