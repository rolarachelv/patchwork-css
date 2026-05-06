import {
  generateElevationScale,
  elevationScaleToTokens,
  elevationVar,
  generateElevationCSS,
} from './elevationScale';

describe('generateElevationScale', () => {
  it('generates the correct number of steps', () => {
    const scale = generateElevationScale({ steps: 6 });
    expect(scale.steps).toHaveLength(6);
  });

  it('first step is always none with boxShadow none', () => {
    const scale = generateElevationScale();
    expect(scale.steps[0].label).toBe('none');
    expect(scale.steps[0].boxShadow).toBe('none');
  });

  it('last step has label high', () => {
    const scale = generateElevationScale({ steps: 6 });
    const last = scale.steps[scale.steps.length - 1];
    expect(last.label).toBe('high');
  });

  it('middle steps are labelled level-N', () => {
    const scale = generateElevationScale({ steps: 6 });
    expect(scale.steps[2].label).toBe('level-2');
  });

  it('respects custom color', () => {
    const scale = generateElevationScale({ steps: 3, color: '255,0,0' });
    const nonNone = scale.steps.find((s) => s.boxShadow !== 'none');
    expect(nonNone?.boxShadow).toContain('rgba(255,0,0,');
  });

  it('opacity does not exceed 0.5', () => {
    const scale = generateElevationScale({ steps: 20, baseOpacity: 0.4 });
    for (const step of scale.steps) {
      if (step.boxShadow === 'none') continue;
      const match = step.boxShadow.match(/rgba\([^,]+,[^,]+,[^,]+,([^)]+)\)/);
      if (match) expect(parseFloat(match[1])).toBeLessThanOrEqual(0.5);
    }
  });

  it('generates single step scale with label base', () => {
    const scale = generateElevationScale({ steps: 1 });
    expect(scale.steps[0].label).toBe('none');
  });
});

describe('elevationScaleToTokens', () => {
  it('returns a token map keyed by elevation-label', () => {
    const scale = generateElevationScale({ steps: 3 });
    const tokens = elevationScaleToTokens(scale);
    expect(Object.keys(tokens)).toContain('elevation-none');
    expect(Object.keys(tokens)).toContain('elevation-high');
  });

  it('token values match step boxShadow', () => {
    const scale = generateElevationScale({ steps: 3 });
    const tokens = elevationScaleToTokens(scale);
    for (const step of scale.steps) {
      expect(tokens[`elevation-${step.label}`]).toBe(step.boxShadow);
    }
  });
});

describe('elevationVar', () => {
  it('wraps label in CSS var syntax', () => {
    expect(elevationVar('level-2')).toBe('var(--elevation-level-2)');
  });
});

describe('generateElevationCSS', () => {
  it('outputs :root block by default', () => {
    const scale = generateElevationScale({ steps: 3 });
    const css = generateElevationCSS(scale);
    expect(css).toMatch(/^:root \{/);
  });

  it('includes CSS custom property declarations', () => {
    const scale = generateElevationScale({ steps: 3 });
    const css = generateElevationCSS(scale);
    expect(css).toContain('--elevation-none: none;');
  });

  it('accepts a custom selector', () => {
    const scale = generateElevationScale({ steps: 2 });
    const css = generateElevationCSS(scale, '.theme');
    expect(css).toMatch(/^\.theme \{/);
  });
});
