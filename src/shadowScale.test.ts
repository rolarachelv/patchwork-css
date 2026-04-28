import { generateShadowScale, buildShadowValue, stepLabel, roundTo } from './shadowScale';

describe('generateShadowScale', () => {
  it('generates the correct number of steps', () => {
    const scale = generateShadowScale({ steps: 4 });
    expect(Object.keys(scale)).toHaveLength(4);
  });

  it('uses default steps of 5', () => {
    const scale = generateShadowScale({});
    expect(Object.keys(scale)).toHaveLength(5);
  });

  it('first step uses base values', () => {
    const scale = generateShadowScale({
      baseColor: '0,0,0',
      baseOpacity: 0.1,
      baseBlur: 4,
      baseSpread: 0,
      baseOffsetY: 2,
    });
    expect(scale['xs'].value).toBe('0 2px 4px 0px rgba(0,0,0,0.1)');
    expect(scale['xs'].blur).toBe(4);
    expect(scale['xs'].offsetY).toBe(2);
  });

  it('increments blur and offsetY per step', () => {
    const scale = generateShadowScale({
      baseBlur: 4,
      blurStep: 8,
      baseOffsetY: 2,
      offsetYStep: 4,
    });
    expect(scale['sm'].blur).toBe(12);
    expect(scale['sm'].offsetY).toBe(6);
    expect(scale['md'].blur).toBe(20);
  });

  it('labels steps correctly', () => {
    const scale = generateShadowScale({ steps: 6 });
    const keys = Object.keys(scale);
    expect(keys).toEqual(['xs', 'sm', 'md', 'lg', 'xl', '2xl']);
  });
});

describe('buildShadowValue', () => {
  it('returns a valid CSS box-shadow string', () => {
    expect(buildShadowValue('0,0,0', 0.1, 4, 0, 2)).toBe('0 2px 4px 0px rgba(0,0,0,0.1)');
  });
});

describe('stepLabel', () => {
  it('returns named labels for known indices', () => {
    expect(stepLabel(1)).toBe('xs');
    expect(stepLabel(3)).toBe('md');
  });

  it('falls back to step-N for large indices', () => {
    expect(stepLabel(8)).toBe('step-8');
  });
});

describe('roundTo', () => {
  it('rounds to the specified number of decimals', () => {
    expect(roundTo(0.1666, 2)).toBe(0.17);
    expect(roundTo(0.1000, 3)).toBe(0.1);
  });
});
