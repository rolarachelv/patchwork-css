export interface IconScaleConfig {
  baseSize: number;
  steps: number;
  ratio: number;
  unit?: string;
}

export interface IconScaleEntry {
  label: string;
  size: number;
  value: string;
}

export interface IconScale {
  entries: IconScaleEntry[];
  config: IconScaleConfig;
}

export type IconTokens = Record<string, string>;

function roundTo(value: number, decimals = 4): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

function stepLabel(index: number, total: number): string {
  if (total === 1) return 'md';
  const labels = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
  if (total <= labels.length) return labels[index] ?? `step-${index}`;
  return `step-${index + 1}`;
}

export function generateIconScale(config: IconScaleConfig): IconScale {
  const { baseSize, steps, ratio, unit = 'rem' } = config;
  const mid = Math.floor(steps / 2);
  const entries: IconScaleEntry[] = Array.from({ length: steps }, (_, i) => {
    const exp = i - mid;
    const size = roundTo(baseSize * Math.pow(ratio, exp));
    const label = stepLabel(i, steps);
    return { label, size, value: `${size}${unit}` };
  });
  return { entries, config };
}

export function iconScaleToTokens(scale: IconScale): IconTokens {
  return Object.fromEntries(
    scale.entries.map(({ label, value }) => [`icon-size-${label}`, value])
  );
}

export function iconVar(label: string): string {
  return `var(--icon-size-${label})`;
}

export function generateIconCSS(tokens: IconTokens, selector = ':root'): string {
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
