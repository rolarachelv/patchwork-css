export interface FontWeightScaleOptions {
  weights?: Record<string, number>;
  prefix?: string;
}

export interface FontWeightToken {
  name: string;
  label: string;
  value: number;
}

const DEFAULT_WEIGHTS: Record<string, number> = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

export function generateFontWeightScale(
  options: FontWeightScaleOptions = {}
): FontWeightToken[] {
  const weights = options.weights ?? DEFAULT_WEIGHTS;
  return Object.entries(weights).map(([label, value]) => ({
    name: `font-weight-${label}`,
    label,
    value,
  }));
}

export function fontWeightScaleToTokens(
  scale: FontWeightToken[],
  prefix = "fw"
): Record<string, string> {
  return scale.reduce<Record<string, string>>((acc, token) => {
    acc[`${prefix}-${token.label}`] = String(token.value);
    return acc;
  }, {});
}

export function fontWeightVar(label: string, prefix = "fw"): string {
  return `var(--${prefix}-${label})`;
}

export function generateFontWeightCSS(
  scale: FontWeightToken[],
  prefix = "fw",
  selector = ":root"
): string {
  const declarations = scale
    .map((token) => `  --${prefix}-${token.label}: ${token.value};`)
    .join("\n");
  return `${selector} {\n${declarations}\n}`;
}
