/**
 * patchwork-css
 * Main entry point — re-exports all public APIs for consumers of the library.
 */

// Core token pipeline
export { parseTokens, flatten } from './tokenParser';
export { generateCSS, tokenKeyToCSSVar } from './cssGenerator';
export { buildTheme, mergeThemes, deepMerge } from './themeBuilder';
export { loadConfig, writeOutput } from './configLoader';
export { resolveReferences, isReference, extractReferenceKey } from './variableResolver';
export { generateMediaQueries, breakpointToMediaQuery, normaliseBreakpoints } from './mediaQueryGenerator';
export { composeOutput, serialiseOutput } from './outputComposer';
export { transformTokens, transformToken, applyTokenDefaults } from './tokenTransformer';
export { validateTokens, validateTokenValue } from './tokenValidator';

// Colour utilities
export { hexToRgb, rgbToHex, withOpacity, relativeLuminance, contrastRatio } from './colorUtils';

// Scale generators
export { generateTypographyScale, stepLabel, roundTo } from './typographyScale';
export { generateSpacingScale, buildValues, fibSequence } from './spacingScale';
export { generateShadowScale, buildShadowValue } from './shadowScale';
export { generateBorderScale } from './borderScale';
export { generateAnimationScale } from './animationScale';
export { generateGradientScale, buildStopValue } from './gradientScale';
export { generateZIndexScale, zIndexScaleToTokens, generateZIndexCSS } from './zIndexScale';
export { generateOpacityScale, opacityScaleToTokens, generateOpacityCSS } from './opacityScale';
export { generateBreakpointScale, breakpointScaleToTokens, breakpointVar, generateBreakpointCSS } from './breakpointScale';
export { generateGridScale, gridScaleToTokens, generateGridCSS } from './gridScale';
export { generateIconScale, iconScaleToTokens, iconVar } from './iconScale';
export { generateTransitionScale, transitionScaleToTokens, generateTransitionCSS } from './transitionScale';
export { generateElevationScale, elevationScaleToTokens, elevationVar } from './elevationScale';
export { generateFilterScale, filterScaleToTokens, filterVar } from './filterScale';
export { generateCursorScale, cursorScaleToTokens, cursorVar, generateCursorCSS } from './cursorScale';
export { generateLineHeightScale, lineHeightScaleToTokens, lineHeightVar } from './lineHeightScale';
export { generateLetterSpacingScale, letterSpacingScaleToTokens, letterSpacingVar } from './letterSpacingScale';
export { generateFontWeightScale, fontWeightScaleToTokens, fontWeightVar, generateFontWeightCSS } from './fontWeightScale';
export { generateAspectRatioScale, aspectRatioScaleToTokens, aspectRatioVar, generateAspectRatioCSS } from './aspectRatioScale';
export { generateTextDecorationScale, textDecorationScaleToTokens, textDecorationVar, generateTextDecorationCSS } from './textDecorationScale';
export { generateOutlineScale, outlineScaleToTokens, outlineVar } from './outlineScale';
export { generateBorderRadiusScale, borderRadiusScaleToTokens, borderRadiusVar } from './borderRadiusScale';
export { generateListStyleScale, listStyleScaleToTokens, listStyleVar, generateListStyleCSS } from './listStyleScale';
export { generateColumnScale, columnScaleToTokens, columnVar, generateColumnCSS } from './columnScale';

// Token integration helpers
export { shadowScaleToTokens, generateShadowCSS, shadowVar, shadowVarMap } from './shadowTokenIntegration';
export { borderScaleToTokens, generateBorderCSS, borderRadiusVar as borderTokenRadiusVar, borderWidthVar, getBorderTokenValue } from './borderTokenIntegration';
export { animationScaleToTokens, generateAnimationCSS, animationDurationVar, animationEasingVar } from './animationTokenIntegration';
export { gradientScaleToTokens, gradientVar, gradientVarMap, generateGradientCSS } from './gradientTokenIntegration';
export { buildGridTokens, mergeGridTokens, filterGridTokens, renameGridTokenPrefix } from './gridTokenIntegration';
export { buildTransitionTokenMap, transitionVar, mergeTransitionTokens, generateTransitionCSSFromConfig } from './transitionTokenIntegration';
export { buildElevationTokens, mergeElevationTokens, filterElevationTokens, generateElevationCSSFromConfig } from './elevationTokenIntegration';
export { buildOutlineTokens, mergeOutlineTokens, filterOutlineTokens, generateOutlineCSSFromConfig, outlineScaleToFullTokens } from './outlineTokenIntegration';
export { buildBorderRadiusTokens, mergeBorderRadiusTokens, filterBorderRadiusTokens, generateBorderRadiusCSSFromConfig } from './borderRadiusTokenIntegration';
export { buildLetterSpacingTokens, mergeLetterSpacingTokens, filterLetterSpacingTokens, generateLetterSpacingCSSFromConfig } from './letterSpacingTokenIntegration';
export { buildFontWeightTokens, mergeFontWeightTokens, filterFontWeightTokens, generateFontWeightCSSFromConfig } from './fontWeightTokenIntegration';
export { buildColumnTokens, mergeColumnTokens, filterColumnTokens, generateColumnCSSFromConfig } from './columnTokenIntegration';

// Types
export type * from './types';
