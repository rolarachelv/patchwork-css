import {
  generateLetterSpacingScale,
  letterSpacingScaleToTokens,
  generateLetterSpacingCSS,
  LetterSpacingScaleOptions,
  LetterSpacingScale,
} from './letterSpacingScale';

export interface LetterSpacingConfig {
  steps?: number;
  base?: number;
  unit?: string;
  ratio?: number;
  selector?: string;
  prefix?: string;
}

export function buildLetterSpacingTokens(
  config: LetterSpacingConfig = {}
): Record<string, string> {
  const { prefix, selector: _selector, ...scaleOptions } = config;
  const scale = generateLetterSpacingScale(scaleOptions as LetterSpacingScaleOptions);
  const tokens = letterSpacingScaleToTokens(scale);

  if (!prefix) return tokens;

  return Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [
      key.replace('letter-spacing-', `${prefix}-letter-spacing-`),
      value,
    ])
  );
}

export function mergeLetterSpacingTokens(
  ...tokenMaps: Record<string, string>[]
): Record<string, string> {
  return Object.assign({}, ...tokenMaps);
}

export function filterLetterSpacingTokens(
  tokens: Record<string, string>,
  labels: string[]
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).filter(([key]) =>
      labels.some((label) => key.endsWith(`-${label}`))
    )
  );
}

export function generateLetterSpacingCSSFromConfig(
  config: LetterSpacingConfig = {}
): string {
  const { selector = ':root', ...rest } = config;
  const tokens = buildLetterSpacingTokens(rest);
  return generateLetterSpacingCSS(tokens, selector);
}
