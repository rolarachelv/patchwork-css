/**
 * gridScale.ts
 * Generates grid layout tokens (columns, gutters, margins) from a config.
 */

export interface GridScaleConfig {
  columns?: number[];
  gutterBase?: number;
  gutterSteps?: number;
  marginBase?: number;
  marginSteps?: number;
  unit?: string;
}

export interface GridScale {
  columns: Record<string, number>;
  gutters: Record<string, string>;
  margins: Record<string, string>;
}

export function roundTo(value: number, decimals = 4): number {
  return parseFloat(value.toFixed(decimals));
}

export function stepLabel(index: number, steps: number): string {
  if (steps === 1) return 'default';
  const labels = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
  return labels[index] ?? `step-${index + 1}`;
}

export function generateGridScale(config: GridScaleConfig = {}): GridScale {
  const {
    columns = [1, 2, 3, 4, 6, 8, 12],
    gutterBase = 16,
    gutterSteps = 5,
    marginBase = 16,
    marginSteps = 5,
    unit = 'px',
  } = config;

  const columnsMap: Record<string, number> = {};
  columns.forEach((col) => {
    columnsMap[`col-${col}`] = col;
  });

  const gutters: Record<string, string> = {};
  for (let i = 0; i < gutterSteps; i++) {
    const label = stepLabel(i, gutterSteps);
    const value = roundTo(gutterBase * Math.pow(1.5, i - Math.floor(gutterSteps / 2)));
    gutters[label] = `${value}${unit}`;
  }

  const margins: Record<string, string> = {};
  for (let i = 0; i < marginSteps; i++) {
    const label = stepLabel(i, marginSteps);
    const value = roundTo(marginBase * Math.pow(1.5, i - Math.floor(marginSteps / 2)));
    margins[label] = `${value}${unit}`;
  }

  return { columns: columnsMap, gutters, margins };
}

export function gridScaleToTokens(scale: GridScale): Record<string, string> {
  const tokens: Record<string, string> = {};
  Object.entries(scale.columns).forEach(([key, val]) => {
    tokens[`grid-columns-${key}`] = String(val);
  });
  Object.entries(scale.gutters).forEach(([key, val]) => {
    tokens[`grid-gutter-${key}`] = val;
  });
  Object.entries(scale.margins).forEach(([key, val]) => {
    tokens[`grid-margin-${key}`] = val;
  });
  return tokens;
}

export function generateGridCSS(
  scale: GridScale,
  selector = ':root'
): string {
  const tokens = gridScaleToTokens(scale);
  const declarations = Object.entries(tokens)
    .map(([key, val]) => `  --${key}: ${val};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
