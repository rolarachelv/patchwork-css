/**
 * cursorScale.ts
 * Generates cursor/pointer style tokens for consistent interactive states.
 */

export type CursorStep = {
  name: string;
  value: string;
};

export type CursorScale = {
  steps: CursorStep[];
};

export type CursorScaleConfig = {
  cursors?: string[];
  prefix?: string;
};

const DEFAULT_CURSORS: string[] = [
  'auto',
  'default',
  'pointer',
  'wait',
  'text',
  'move',
  'not-allowed',
  'grab',
  'grabbing',
  'crosshair',
  'zoom-in',
  'zoom-out',
  'help',
  'progress',
];

export function generateCursorScale(config: CursorScaleConfig = {}): CursorScale {
  const cursors = config.cursors && config.cursors.length > 0 ? config.cursors : DEFAULT_CURSORS;
  const steps: CursorStep[] = cursors.map((cursor) => ({
    name: cursor,
    value: cursor,
  }));
  return { steps };
}

export function cursorScaleToTokens(
  scale: CursorScale,
  prefix = 'cursor'
): Record<string, string> {
  return scale.steps.reduce<Record<string, string>>((acc, step) => {
    acc[`${prefix}-${step.name}`] = step.value;
    return acc;
  }, {});
}

export function cursorVar(name: string, prefix = 'cursor'): string {
  return `var(--${prefix}-${name})`;
}

export function generateCursorCSS(
  scale: CursorScale,
  prefix = 'cursor',
  selector = ':root'
): string {
  const declarations = scale.steps
    .map((step) => `  --${prefix}-${step.name}: ${step.value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
