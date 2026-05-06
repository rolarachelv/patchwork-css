import {
  generateCursorScale,
  cursorScaleToTokens,
  cursorVar,
  generateCursorCSS,
  CursorScaleConfig,
} from './cursorScale';

describe('generateCursorScale', () => {
  it('returns default cursor steps when no config is provided', () => {
    const scale = generateCursorScale();
    expect(scale.steps.length).toBeGreaterThan(0);
    const names = scale.steps.map((s) => s.name);
    expect(names).toContain('pointer');
    expect(names).toContain('default');
    expect(names).toContain('not-allowed');
  });

  it('uses custom cursors when provided', () => {
    const config: CursorScaleConfig = { cursors: ['pointer', 'grab', 'crosshair'] };
    const scale = generateCursorScale(config);
    expect(scale.steps).toHaveLength(3);
    expect(scale.steps[0]).toEqual({ name: 'pointer', value: 'pointer' });
    expect(scale.steps[1]).toEqual({ name: 'grab', value: 'grab' });
  });

  it('falls back to defaults when cursors array is empty', () => {
    const scale = generateCursorScale({ cursors: [] });
    expect(scale.steps.length).toBeGreaterThan(0);
  });

  it('each step has a name and value matching the cursor string', () => {
    const scale = generateCursorScale({ cursors: ['wait', 'text'] });
    scale.steps.forEach((step) => {
      expect(step.name).toBe(step.value);
    });
  });
});

describe('cursorScaleToTokens', () => {
  it('converts scale to a flat token map with default prefix', () => {
    const scale = generateCursorScale({ cursors: ['pointer', 'default'] });
    const tokens = cursorScaleToTokens(scale);
    expect(tokens['cursor-pointer']).toBe('pointer');
    expect(tokens['cursor-default']).toBe('default');
  });

  it('respects a custom prefix', () => {
    const scale = generateCursorScale({ cursors: ['grab'] });
    const tokens = cursorScaleToTokens(scale, 'c');
    expect(tokens['c-grab']).toBe('grab');
  });
});

describe('cursorVar', () => {
  it('returns a CSS var reference with default prefix', () => {
    expect(cursorVar('pointer')).toBe('var(--cursor-pointer)');
  });

  it('returns a CSS var reference with custom prefix', () => {
    expect(cursorVar('grab', 'c')).toBe('var(--c-grab)');
  });
});

describe('generateCursorCSS', () => {
  it('generates a :root block with CSS custom properties', () => {
    const scale = generateCursorScale({ cursors: ['pointer', 'wait'] });
    const css = generateCursorCSS(scale);
    expect(css).toContain(':root {');
    expect(css).toContain('--cursor-pointer: pointer;');
    expect(css).toContain('--cursor-wait: wait;');
  });

  it('uses a custom selector when provided', () => {
    const scale = generateCursorScale({ cursors: ['text'] });
    const css = generateCursorCSS(scale, 'cursor', '.theme');
    expect(css).toContain('.theme {');
  });

  it('uses a custom prefix in property names', () => {
    const scale = generateCursorScale({ cursors: ['move'] });
    const css = generateCursorCSS(scale, 'cur');
    expect(css).toContain('--cur-move: move;');
  });
});
