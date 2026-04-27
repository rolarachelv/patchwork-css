import { composeOutput, serialiseOutput } from './outputComposer';
import { PatchworkConfig } from './types';

const baseConfig: PatchworkConfig = {
  output: 'dist/tokens.css',
  selector: ':root',
  theme: {
    tokens: {
      color: { primary: '#3490dc', secondary: '#ffed4a' },
      fontSize: { base: '16px' },
    },
  },
};

describe('composeOutput', () => {
  it('generates base CSS from tokens', () => {
    const output = composeOutput(baseConfig);
    expect(output.css).toContain(':root');
    expect(output.css).toContain('--color-primary');
    expect(output.css).toContain('--font-size-base');
  });

  it('returns empty mediaQueries when no breakpoints defined', () => {
    const output = composeOutput(baseConfig);
    expect(output.mediaQueries.trim()).toBe('');
  });

  it('generates media query blocks when breakpoints are provided', () => {
    const config: PatchworkConfig = {
      ...baseConfig,
      theme: {
        ...baseConfig.theme,
        breakpoints: { md: { min: '768px' } },
        tokens: {
          ...baseConfig.theme.tokens,
          md: { fontSize: { base: '18px' } },
        },
      },
    };
    const output = composeOutput(config);
    expect(output.mediaQueries).toContain('@media (min-width: 768px)');
  });

  it('generates theme CSS blocks for named themes', () => {
    const config: PatchworkConfig = {
      ...baseConfig,
      theme: {
        ...baseConfig.theme,
        themes: {
          dark: { color: { primary: '#1a1a2e' } },
        },
      },
    };
    const output = composeOutput(config);
    expect(output.themes['dark']).toContain('[data-theme="dark"]');
    expect(output.themes['dark']).toContain('--color-primary');
  });
});

describe('serialiseOutput', () => {
  it('joins non-empty sections with double newlines', () => {
    const output = composeOutput({
      ...baseConfig,
      theme: {
        ...baseConfig.theme,
        themes: { dark: { color: { bg: '#000' } } },
      },
    });
    const result = serialiseOutput(output);
    expect(result).toContain(':root');
    expect(result).toContain('[data-theme="dark"]');
  });

  it('omits empty sections', () => {
    const output = { css: ':root { --x: 1; }', mediaQueries: '', themes: {} };
    const result = serialiseOutput(output);
    expect(result.trim()).toBe(':root { --x: 1; }');
  });
});
