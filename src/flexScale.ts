export interface FlexScaleConfig {
  directions?: string[];
  wraps?: string[];
  justifyContent?: string[];
  alignItems?: string[];
  grows?: number[];
  shrinks?: number[];
  prefix?: string;
}

export interface FlexScale {
  direction: Record<string, string>;
  wrap: Record<string, string>;
  justifyContent: Record<string, string>;
  alignItems: Record<string, string>;
  grow: Record<string, number>;
  shrink: Record<string, number>;
}

const DEFAULT_DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
const DEFAULT_WRAPS = ['nowrap', 'wrap', 'wrap-reverse'];
const DEFAULT_JUSTIFY = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
const DEFAULT_ALIGN = ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'];
const DEFAULT_GROWS = [0, 1];
const DEFAULT_SHRINKS = [0, 1];

function stepLabel(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '-');
}

export function generateFlexScale(config: FlexScaleConfig = {}): FlexScale {
  const directions = config.directions ?? DEFAULT_DIRECTIONS;
  const wraps = config.wraps ?? DEFAULT_WRAPS;
  const justifyContent = config.justifyContent ?? DEFAULT_JUSTIFY;
  const alignItems = config.alignItems ?? DEFAULT_ALIGN;
  const grows = config.grows ?? DEFAULT_GROWS;
  const shrinks = config.shrinks ?? DEFAULT_SHRINKS;

  return {
    direction: Object.fromEntries(directions.map(d => [stepLabel(d), d])),
    wrap: Object.fromEntries(wraps.map(w => [stepLabel(w), w])),
    justifyContent: Object.fromEntries(justifyContent.map(j => [stepLabel(j), j])),
    alignItems: Object.fromEntries(alignItems.map(a => [stepLabel(a), a])),
    grow: Object.fromEntries(grows.map(g => [String(g), g])),
    shrink: Object.fromEntries(shrinks.map(s => [String(s), s])),
  };
}

export function flexScaleToTokens(scale: FlexScale, prefix = 'flex'): Record<string, string | number> {
  const tokens: Record<string, string | number> = {};
  for (const [key, val] of Object.entries(scale.direction)) tokens[`${prefix}-direction-${key}`] = val;
  for (const [key, val] of Object.entries(scale.wrap)) tokens[`${prefix}-wrap-${key}`] = val;
  for (const [key, val] of Object.entries(scale.justifyContent)) tokens[`${prefix}-justify-${key}`] = val;
  for (const [key, val] of Object.entries(scale.alignItems)) tokens[`${prefix}-align-${key}`] = val;
  for (const [key, val] of Object.entries(scale.grow)) tokens[`${prefix}-grow-${key}`] = val;
  for (const [key, val] of Object.entries(scale.shrink)) tokens[`${prefix}-shrink-${key}`] = val;
  return tokens;
}

export function flexVar(category: string, key: string, prefix = 'flex'): string {
  return `var(--${prefix}-${category}-${key})`;
}

export function generateFlexCSS(scale: FlexScale, prefix = 'flex'): string {
  const tokens = flexScaleToTokens(scale, prefix);
  const lines = Object.entries(tokens).map(([k, v]) => `  --${k}: ${v};`);
  return `:root {
${lines.join('\n')}
}`;
}
