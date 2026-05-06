export interface OutlineScaleOptions {
  steps?: number;
  baseWidth?: number;
  widthStep?: number;
  widthUnit?: string;
  styles?: string[];
  prefix?: string;
}

export interface OutlineToken {
  width: string;
  style: string;
  offset: string;
}

function roundTo(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

function stepLabel(index: number, prefix: string): string {
  return `${prefix}-${index + 1}`;
}

export function generateOutlineScale(
  options: OutlineScaleOptions = {}
): Record<string, OutlineToken> {
  const {
    steps = 4,
    baseWidth = 1,
    widthStep = 1,
    widthUnit = 'px',
    styles = ['solid', 'dashed', 'dotted', 'double'],
    prefix = 'outline',
  } = options;

  const scale: Record<string, OutlineToken> = {};

  for (let i = 0; i < steps; i++) {
    const label = stepLabel(i, prefix);
    const width = roundTo(baseWidth + i * widthStep);
    const style = styles[i % styles.length];
    const offset = roundTo(width);

    scale[label] = {
      width: `${width}${widthUnit}`,
      style,
      offset: `${offset}${widthUnit}`,
    };
  }

  return scale;
}

export function outlineScaleToTokens(
  scale: Record<string, OutlineToken>
): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const [key, token] of Object.entries(scale)) {
    tokens[`${key}-width`] = token.width;
    tokens[`${key}-style`] = token.style;
    tokens[`${key}-offset`] = token.offset;
  }
  return tokens;
}

export function outlineVar(key: string, property: 'width' | 'style' | 'offset'): string {
  return `var(--${key}-${property})`;
}

export function generateOutlineCSS(
  scale: Record<string, OutlineToken>,
  selector = ':root'
): string {
  const tokens = outlineScaleToTokens(scale);
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
