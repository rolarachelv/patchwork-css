import { generateOutlineScale, outlineScaleToTokens, OutlineScaleOptions, OutlineToken } from './outlineScale';

export function buildOutlineTokens(
  options: OutlineScaleOptions = {}
): Record<string, string> {
  const scale = generateOutlineScale(options);
  return outlineScaleToTokens(scale);
}

export function mergeOutlineTokens(
  base: Record<string, string>,
  overrides: Record<string, string>
): Record<string, string> {
  return { ...base, ...overrides };
}

export function filterOutlineTokens(
  tokens: Record<string, string>,
  property: 'width' | 'style' | 'offset'
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).filter(([key]) => key.endsWith(`-${property}`))
  );
}

export function generateOutlineCSSFromConfig(
  options: OutlineScaleOptions = {},
  selector = ':root'
): string {
  const tokens = buildOutlineTokens(options);
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join('\n');
  return `${selector} {\n${declarations}\n}`;
}

export function outlineScaleToFullTokens(
  scale: Record<string, OutlineToken>
): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};
  for (const [key, token] of Object.entries(scale)) {
    result[key] = {
      width: token.width,
      style: token.style,
      offset: token.offset,
    };
  }
  return result;
}
