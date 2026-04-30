import {
  generateGradientScale,
  buildStopValue,
  stepLabel,
  roundTo,
  GradientConfig,
} from './gradientScale';

describe('roundTo', () => {
  it('rounds to 2 decimal places by default', () => {
    expect(roundTo(0.12345)).toBe(0.12);
  });

  it('rounds to specified decimal places', () => {
    expect(roundTo(1.5678, 1)).toBe(1.6);
  });
});

describe('stepLabel', () => {
  it('returns 100 for a single item', () => {
    expect(stepLabel(0, 1)).toBe('100');
  });

  it('returns 100 for first of many', () => {
    expect(stepLabel(0, 5)).toBe('100');
  });

  it('returns 1000 for last of many', () => {
    expect(stepLabel(4, 5)).toBe('1000');
  });

  it('returns midpoint label', () => {
    expect(stepLabel(1, 3)).toBe('550');
  });
});

describe('buildStopValue', () => {
  it('returns color only when no position or opacity', () => {
    expect(buildStopValue({ color: '#ff0000' })).toBe('#ff0000');
  });

  it('includes position percentage', () => {
    expect(buildStopValue({ color: '#ff0000', position: 0.5 })).toBe('#ff0000 50%');
  });

  it('applies opacity via withOpacity', () => {
    const result = buildStopValue({ color: '#ff0000', opacity: 0.5 });
    expect(result).toContain('rgba');
  });
});

describe('generateGradientScale', () => {
  const configs: GradientConfig[] = [
    { direction: 'to right', stops: [{ color: '#000000' }, { color: '#ffffff' }] },
    { stops: [{ color: '#ff0000', position: 0 }, { color: '#0000ff', position: 1 }] },
  ];

  it('generates a scale with correct keys', () => {
    const scale = generateGradientScale(configs);
    expect(Object.keys(scale)).toEqual(['gradient-100', 'gradient-1000']);
  });

  it('uses provided direction', () => {
    const scale = generateGradientScale(configs);
    expect(scale['gradient-100']).toContain('to right');
  });

  it('defaults direction to "to bottom"', () => {
    const scale = generateGradientScale(configs);
    expect(scale['gradient-1000']).toContain('to bottom');
  });

  it('respects custom prefix', () => {
    const scale = generateGradientScale(configs, 'bg');
    expect(Object.keys(scale)[0]).toMatch(/^bg-/);
  });

  it('includes stop positions', () => {
    const scale = generateGradientScale(configs);
    expect(scale['gradient-1000']).toContain('0%');
    expect(scale['gradient-1000']).toContain('100%');
  });
});
