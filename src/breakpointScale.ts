/**
 * breakpointScale.ts
 * Generates a breakpoint scale and corresponding CSS custom properties
 * from a set of named breakpoint values.
 */

export interface BreakpointScaleConfig {
  breakpoints: Record<string, number>;
  unit?: 'px' | 'em' | 'rem';
}

export interface BreakpointScaleResult {
  name: string;
  value: number;
  css: string;
}

export function generateBreakpointScale(
  config: BreakpointScaleConfig
): BreakpointScaleResult[] {
  const { breakpoints, unit = 'px' } = config;

  return Object.entries(breakpoints)
    .sort(([, a], [, b]) => a - b)
    .map(([name, value]) => ({
      name,
      value,
      css: `${value}${unit}`,
    }));
}

export function breakpointScaleToTokens(
  scale: BreakpointScaleResult[]
): Record<string, string> {
  return scale.reduce<Record<string, string>>((acc, { name, css }) => {
    acc[`breakpoint.${name}`] = css;
    return acc;
  }, {});
}

export function breakpointVar(name: string): string {
  return `var(--breakpoint-${name})`;
}

export function generateBreakpointCSS(
  scale: BreakpointScaleResult[],
  selector = ':root'
): string {
  const declarations = scale
    .map(({ name, css }) => `  --breakpoint-${name}: ${css};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
