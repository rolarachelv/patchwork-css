import { buildTheme, mergeThemes } from './themeBuilder';

describe('buildTheme', () => {
  const config = {
    color: {
      primary: '#3498db',
      secondary: '#2ecc71',
    },
    spacing: {
      sm: '8px',
      md: '16px',
    },
  };

  it('returns tokens and css', () => {
    const result = buildTheme(config);
    expect(result.tokens).toBeDefined();
    expect(result.css).toBeDefined();
    expect(typeof result.css).toBe('string');
  });

  it('uses :root selector by default', () => {
    const result = buildTheme(config);
    expect(result.selector).toBe(':root');
    expect(result.css).toContain(':root');
  });

  it('respects custom selector', () => {
    const result = buildTheme(config, { selector: '.theme-dark' });
    expect(result.selector).toBe('.theme-dark');
    expect(result.css).toContain('.theme-dark');
  });

  it('applies prefix to token keys', () => {
    const result = buildTheme(config, { prefix: 'app' });
    expect(Object.keys(result.tokens).some((k) => k.startsWith('app-'))).toBe(true);
  });

  it('includes all token values in css output', () => {
    const result = buildTheme(config);
    expect(result.css).toContain('#3498db');
    expect(result.css).toContain('#2ecc71');
    expect(result.css).toContain('8px');
  });
});

describe('mergeThemes', () => {
  it('merges two configs', () => {
    const base = { color: { primary: '#000' } };
    const override = { color: { secondary: '#fff' } };
    const result = mergeThemes([base, override]);
    expect(result.tokens['color-primary']).toBe('#000');
    expect(result.tokens['color-secondary']).toBe('#fff');
  });

  it('later config overrides earlier on collision', () => {
    const base = { color: { primary: '#000' } };
    const override = { color: { primary: '#fff' } };
    const result = mergeThemes([base, override]);
    expect(result.tokens['color-primary']).toBe('#fff');
  });

  it('returns valid css for merged theme', () => {
    const base = { spacing: { sm: '4px' } };
    const extra = { spacing: { lg: '32px' } };
    const result = mergeThemes([base, extra]);
    expect(result.css).toContain('4px');
    expect(result.css).toContain('32px');
  });
});
