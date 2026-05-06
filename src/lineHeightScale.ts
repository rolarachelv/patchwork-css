/**
 * lineHeightScale.ts
 * Generates a line-height scale and corresponding CSS custom properties.
 */

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function stepLabel(index: number, steps: number): string {
  if (steps === 1) return 'default';
  const labels = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  if (steps <= labels.length) return labels[index] ?? `step-${index}`;
  return `step-${index + 1}`;
}

export interface LineHeightScaleConfig {
  base?: number;
  steps?: number;
  increment?: number;
  unit?: 'unitless' | 'em' | 'rem';
  decimals?: number;
}

export interface LineHeightEntry {
  label: string;
  value: number;
  css: string;
}

export function generateLineHeightScale(config: LineHeightScaleConfig = {}): LineHeightEntry[] {
  const base = config.base ?? 1.5;
  const steps = Math.max(1, config.steps ?? 5);
  const increment = config.increment ?? 0.15;
  const unit = config.unit ?? 'unitless';
  const decimals = config.decimals ?? 2;

  return Array.from({ length: steps }, (_, i) => {
    const raw = base + i * increment;
    const value = roundTo(raw, decimals);
    const css = unit === 'unitless' ? String(value) : `${value}${unit}`;
    return { label: stepLabel(i, steps), value, css };
  });
}

export function lineHeightScaleToTokens(entries: LineHeightEntry[]): Record<string, string> {
  return Object.fromEntries(
    entries.map(({ label, css }) => [`line-height-${label}`, css])
  );
}

export function lineHeightVar(label: string): string {
  return `var(--line-height-${label})`;
}

export function generateLineHeightCSS(
  entries: LineHeightEntry[],
  selector = ':root'
): string {
  const declarations = entries
    .map(({ label, css }) => `  --line-height-${label}: ${css};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
