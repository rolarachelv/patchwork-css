import { generateBorderScale, BorderScaleOptions } from './borderScale';
import { generateCSS, tokenKeyToCSSVar } from './cssGenerator';
import { DesignToken } from './types';

export function borderScaleToTokens(
  options?: BorderScaleOptions
): Record<string, DesignToken> {
  return generateBorderScale(options);
}

export function generateBorderCSS(options?: BorderScaleOptions): string {
  const tokens = borderScaleToTokens(options);
  return generateCSS(tokens);
}

export function borderRadiusVar(step: string): string {
  return `var(${tokenKeyToCSSVar(`border-radius-${step}`)})`;
}

export function borderWidthVar(width: number): string {
  return `var(${tokenKeyToCSSVar(`border-width-${width}`)})` ;
}
