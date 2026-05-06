export interface AspectRatioScaleOptions {
  ratios?: Record<string, [number, number]>;
  prefix?: string;
}

export interface AspectRatioToken {
  name: string;
  label: string;
  value: string;
  numerator: number;
  denominator: number;
}

const DEFAULT_RATIOS: Record<string, [number, number]> = {
  square: [1, 1],
  video: [16, 9],
  cinema: [21, 9],
  portrait: [3, 4],
  photo: [4, 3],
  golden: [161, 100],
  wide: [16, 10],
};

export function generateAspectRatioScale(
  options: AspectRatioScaleOptions = {}
): AspectRatioToken[] {
  const ratios = { ...DEFAULT_RATIOS, ...(options.ratios ?? {}) };
  return Object.entries(ratios).map(([name, [num, den]]) => ({
    name,
    label: `${num}/${den}`,
    value: `${num} / ${den}`,
    numerator: num,
    denominator: den,
  }));
}

export function aspectRatioScaleToTokens(
  tokens: AspectRatioToken[],
  prefix = "aspect"
): Record<string, string> {
  return Object.fromEntries(
    tokens.map((t) => [`${prefix}-${t.name}`, t.value])
  );
}

export function aspectRatioVar(name: string, prefix = "aspect"): string {
  return `var(--${prefix}-${name})`;
}

export function generateAspectRatioCSS(
  tokens: AspectRatioToken[],
  prefix = "aspect",
  selector = ":root"
): string {
  const declarations = tokens
    .map((t) => `  --${prefix}-${t.name}: ${t.value};`)
    .join("\n");
  return `${selector} {\n${declarations}\n}`;
}
