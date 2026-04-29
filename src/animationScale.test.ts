import { generateAnimationScale, stepLabel, roundTo } from './animationScale';

describe('generateAnimationScale', () => {
  it('generates the correct number of duration steps', () => {
    const scale = generateAnimationScale({ durationSteps: 4 });
    expect(Object.keys(scale.duration)).toHaveLength(4);
  });

  it('uses default duration base of 100ms', () => {
    const scale = generateAnimationScale();
    expect(scale.duration['fastest']).toBe('100ms');
  });

  it('doubles duration with default multiplier', () => {
    const scale = generateAnimationScale();
    expect(scale.duration['fastest']).toBe('100ms');
    expect(scale.duration['faster']).toBe('200ms');
    expect(scale.duration['fast']).toBe('400ms');
    expect(scale.duration['normal']).toBe('800ms');
  });

  it('respects custom durationBase', () => {
    const scale = generateAnimationScale({ durationBase: 50, durationSteps: 3 });
    expect(scale.duration['fastest']).toBe('50ms');
    expect(scale.duration['faster']).toBe('100ms');
  });

  it('respects custom durationMultiplier', () => {
    const scale = generateAnimationScale({
      durationBase: 100,
      durationSteps: 3,
      durationMultiplier: 1.5,
    });
    expect(scale.duration['fastest']).toBe('100ms');
    expect(scale.duration['faster']).toBe('150ms');
    expect(scale.duration['fast']).toBe('225ms');
  });

  it('includes default easings', () => {
    const scale = generateAnimationScale();
    expect(scale.easing['linear']).toBe('linear');
    expect(scale.easing['easeIn']).toBe('cubic-bezier(0.4, 0, 1, 1)');
    expect(scale.easing['easeOut']).toBe('cubic-bezier(0, 0, 0.2, 1)');
    expect(scale.easing['easeInOut']).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
  });

  it('allows custom easings to override defaults', () => {
    const scale = generateAnimationScale({
      easings: { bounce: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)' },
    });
    expect(scale.easing['bounce']).toBe('cubic-bezier(0.68, -0.55, 0.27, 1.55)');
    expect(scale.easing['linear']).toBeUndefined();
  });
});

describe('stepLabel', () => {
  it('returns named labels for known indices', () => {
    expect(stepLabel(0)).toBe('fastest');
    expect(stepLabel(3)).toBe('normal');
    expect(stepLabel(6)).toBe('slowest');
  });

  it('returns fallback label for out-of-range index', () => {
    expect(stepLabel(9)).toBe('step-9');
  });
});

describe('roundTo', () => {
  it('rounds to given decimal places', () => {
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(150, 0)).toBe(150);
  });
});
