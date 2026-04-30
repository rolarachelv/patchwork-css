import {
  generateGradientScale,
  buildStopValue,
  stepLabel,
  roundTo,
  GradientScaleOptions,
} from './gradientScale';

describe('roundTo', () => {
  it('rounds to 2 decimal places by default', () => {
    expect(roundTo(1.2345)).toBe(1.23);
  });

  it('rounds to specified decimal places', () => {
    expect(roundTo(1.2345, 3)).toBe(1.235);
  });
});

describe('stepLabel', () => {
  it('returns 100 for first step', () => {
    expect(stepLabel(0, 5)).toBe('100');
  });

  it('returns 1000 for last step', () => {
    expect(stepLabel(4, 5)).toBe('1000');
  });

  it('returns midpoint label for middle step', () => {
    const label = stepLabel(2, 5);
    expect(Number(label)).toBeGreaterThan(100);
    expect(Number(label)).toBeLessThan(1000);
  });
});

describe('buildStopValue', () => {
  it('formats stops correctly', () => {
    const result = buildStopValue([
      { position: 0, color: '#fff' },
      { position: 100, color: '#000' },
    ]);
    expect(result).toBe('#fff 0%, #000 100%');
  });
});

describe('generateGradientScale', () => {
  const opts: GradientScaleOptions = {
    fromColor: '#ffffff',
    toColor: '#000000',
    steps: 5,
  };

  it('returns the correct number of steps', () => {
    const scale = generateGradientScale(opts);
    expect(scale.length).toBe(5);
  });

  it('each step has a label, value, and stops', () => {
    const scale = generateGradientScale(opts);
    for (const step of scale) {
      expect(step.label).toBeDefined();
      expect(step.value).toMatch(/linear-gradient/);
      expect(Array.isArray(step.stops)).toBe(true);
    }
  });

  it('uses custom direction', () => {
    const scale = generateGradientScale({ ...opts, direction: 'to right' });
    expect(scale[0].value).toMatch(/to right/);
  });

  it('includes midColor stop when provided', () => {
    const scale = generateGradientScale({ ...opts, midColor: '#888888' });
    for (const step of scale) {
      expect(step.stops.length).toBe(3);
      expect(step.stops[1].color).toBe('#888888');
    }
  });

  it('throws when steps < 2', () => {
    expect(() =>
      generateGradientScale({ ...opts, steps: 1 })
    ).toThrow('at least 2 steps');
  });

  it('first label is 100', () => {
    const scale = generateGradientScale(opts);
    expect(scale[0].label).toBe('100');
  });

  it('last label is 1000', () => {
    const scale = generateGradientScale(opts);
    expect(scale[scale.length - 1].label).toBe('1000');
  });
});
