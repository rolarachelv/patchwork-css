import { generateAnimationScale, stepLabel, roundTo } from './animationScale';

describe('roundTo', () => {
  it('rounds to the specified number of decimals', () => {
    expect(roundTo(1.2345, 2)).toBe(1.23);
    expect(roundTo(100.999, 0)).toBe(101);
  });
});

describe('stepLabel', () => {
  it('returns "base" for a single step', () => {
    expect(stepLabel(0, 1)).toBe('base');
  });

  it('returns named labels for small scales', () => {
    expect(stepLabel(0, 3)).toBe('xs');
    expect(stepLabel(1, 3)).toBe('sm');
    expect(stepLabel(2, 3)).toBe('md');
  });

  it('falls back to step-n for large scales', () => {
    expect(stepLabel(8, 10)).toBe('step-9');
  });
});

describe('generateAnimationScale', () => {
  it('returns the correct number of steps', () => {
    const scale = generateAnimationScale({ steps: 4, baseDuration: 100 });
    expect(scale).toHaveLength(4);
  });

  it('first step uses baseDuration', () => {
    const scale = generateAnimationScale({ steps: 3, baseDuration: 200 });
    expect(scale[0].duration).toBe('200ms');
  });

  it('applies the multiplier to subsequent steps', () => {
    const scale = generateAnimationScale({
      steps: 2,
      baseDuration: 100,
      durationMultiplier: 2,
    });
    expect(scale[1].duration).toBe('200ms');
  });

  it('supports seconds as duration unit', () => {
    const scale = generateAnimationScale({
      steps: 1,
      baseDuration: 300,
      durationUnit: 's',
    });
    expect(scale[0].duration).toBe('0.3s');
  });

  it('cycles through provided easings', () => {
    const easings = ['ease-in', 'ease-out'];
    const scale = generateAnimationScale({
      steps: 4,
      baseDuration: 100,
      easings,
    });
    expect(scale[0].easing).toBe('ease-in');
    expect(scale[1].easing).toBe('ease-out');
    expect(scale[2].easing).toBe('ease-in');
    expect(scale[3].easing).toBe('ease-out');
  });

  it('each step has a non-empty label', () => {
    const scale = generateAnimationScale({ steps: 5, baseDuration: 150 });
    for (const step of scale) {
      expect(step.label.length).toBeGreaterThan(0);
    }
  });
});
