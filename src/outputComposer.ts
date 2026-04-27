import { PatchworkConfig, GeneratedOutput } from './types';
import { parseTokens } from './tokenParser';
import { generateCSS } from './cssGenerator';
import { resolveReferences } from './variableResolver';
import { normaliseBreakpoints, generateMediaQueries } from './mediaQueryGenerator';

/**
 * Orchestrates token parsing, reference resolution, CSS generation,
 * and media query generation into a single output object.
 */
export function composeOutput(config: PatchworkConfig): GeneratedOutput {
  const selector = config.selector ?? ':root';
  const { raw } = parseTokens(config.theme.tokens);
  const resolved = resolveReferences(raw);

  const css = generateCSS(resolved, selector);

  let mediaQueries = '';
  if (config.theme.breakpoints) {
    const normalisedBreakpoints = normaliseBreakpoints(config.theme.breakpoints);
    mediaQueries = generateMediaQueries(resolved, normalisedBreakpoints);
  }

  const themes: Record<string, string> = {};
  if (config.theme.themes) {
    for (const [name, themeTokens] of Object.entries(config.theme.themes)) {
      const { raw: themeRaw } = parseTokens(themeTokens);
      const themeResolved = resolveReferences(themeRaw);
      themes[name] = generateCSS(themeResolved, `[data-theme="${name}"]`);
    }
  }

  return { css, mediaQueries, themes };
}

/**
 * Serialises a GeneratedOutput into a single CSS string.
 */
export function serialiseOutput(output: GeneratedOutput): string {
  const parts: string[] = [output.css];

  if (output.mediaQueries.trim()) {
    parts.push(output.mediaQueries);
  }

  for (const themeCss of Object.values(output.themes)) {
    if (themeCss.trim()) parts.push(themeCss);
  }

  return parts.join('\n\n');
}
