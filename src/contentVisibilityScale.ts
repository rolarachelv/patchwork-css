export type ContentVisibilityValue = 'visible' | 'hidden' | 'auto';

export interface ContentVisibilityToken {
  key: string;
  value: ContentVisibilityValue;
  containIntrinsicSize?: string;
}

export interface ContentVisibilityScale {
  tokens: ContentVisibilityToken[];
}

export function generateContentVisibilityScale(
  values: ContentVisibilityValue[] = ['visible', 'hidden', 'auto']
): ContentVisibilityScale {
  const tokens: ContentVisibilityToken[] = values.map((value) => ({
    key: value,
    value,
  }));
  return { tokens };
}

export function contentVisibilityScaleToTokens(
  scale: ContentVisibilityScale
): Record<string, string> {
  return scale.tokens.reduce<Record<string, string>>((acc, token) => {
    acc[`content-visibility-${token.key}`] = token.value;
    if (token.containIntrinsicSize) {
      acc[`contain-intrinsic-size-${token.key}`] = token.containIntrinsicSize;
    }
    return acc;
  }, {});
}

export function contentVisibilityVar(key: string): string {
  return `var(--content-visibility-${key})`;
}

export function generateContentVisibilityCSS(
  scale: ContentVisibilityScale,
  selector = ':root'
): string {
  const tokens = contentVisibilityScaleToTokens(scale);
  const declarations = Object.entries(tokens)
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}
