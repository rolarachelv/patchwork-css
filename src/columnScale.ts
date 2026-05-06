export interface ColumnScaleConfig {
  steps?: number;
  minColumns?: number;
  maxColumns?: number;
  prefix?: string;
}

export interface ColumnScaleEntry {
  label: string;
  columns: number;
  fraction: string;
}

function stepLabel(index: number, prefix: string): string {
  return `${prefix}-${index}`;
}

export function generateColumnScale(config: ColumnScaleConfig = {}): ColumnScaleEntry[] {
  const {
    steps = 12,
    minColumns = 1,
    maxColumns = 12,
    prefix = 'col',
  } = config;

  const entries: ColumnScaleEntry[] = [];
  const range = maxColumns - minColumns;

  for (let i = 0; i < steps; i++) {
    const columns = steps === 1
      ? minColumns
      : Math.round(minColumns + (range * i) / (steps - 1));
    const fraction = `${columns}fr`;
    entries.push({
      label: stepLabel(i + 1, prefix),
      columns,
      fraction,
    });
  }

  return entries;
}

export function columnScaleToTokens(
  entries: ColumnScaleEntry[]
): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const entry of entries) {
    tokens[`column-count-${entry.label}`] = String(entry.columns);
    tokens[`column-fraction-${entry.label}`] = entry.fraction;
  }
  return tokens;
}

export function columnVar(label: string): string {
  return `var(--column-count-${label})`;
}

export function generateColumnCSS(entries: ColumnScaleEntry[]): string {
  const tokens = columnScaleToTokens(entries);
  const lines = Object.entries(tokens).map(
    ([key, value]) => `  --${key}: ${value};`
  );
  return `:root {
${lines.join('\n')}
}`;
}
