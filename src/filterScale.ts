/**
 * filterScale.ts
 * Generates CSS filter design tokens (blur, brightness, contrast, saturate, etc.)
 */

export interface FilterScaleConfig {
  blurSteps?: number;
  blurBase?: number;
  blurUnit?: string;
  brightnessSteps?: number;
  brightnessBase?: number;
  brightnessIncrement?: number;
  contrastSteps?: number;
  contrastBase?: number;
  contrastIncrement?: number;
  saturateSteps?: number;
  saturateBase?: number;
  saturateIncrement?: number;
}

export interface FilterToken {
  type: string;
  step: number;
  label: string;
  value: string;
}

export interface FilterScale {
  blur: FilterToken[];
  brightness: FilterToken[];
  contrast: FilterToken[];
  saturate: FilterToken[];
}

function roundTo(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

function stepLabel(index: number, total: number): string {
  if (total === 1) return "default";
  const step = Math.round((index / (total - 1)) * 100);
  return String(step);
}

export function generateFilterScale(config: FilterScaleConfig = {}): FilterScale {
  const {
    blurSteps = 6,
    blurBase = 4,
    blurUnit = "px",
    brightnessSteps = 5,
    brightnessBase = 0.5,
    brightnessIncrement = 0.25,
    contrastSteps = 5,
    contrastBase = 0.5,
    contrastIncrement = 0.25,
    saturateSteps = 5,
    saturateBase = 0,
    saturateIncrement = 0.5,
  } = config;

  const blur: FilterToken[] = Array.from({ length: blurSteps }, (_, i) => ({
    type: "blur",
    step: i,
    label: stepLabel(i, blurSteps),
    value: `blur(${roundTo(blurBase * (i + 1))}${blurUnit})`,
  }));

  const brightness: FilterToken[] = Array.from({ length: brightnessSteps }, (_, i) => ({
    type: "brightness",
    step: i,
    label: stepLabel(i, brightnessSteps),
    value: `brightness(${roundTo(brightnessBase + i * brightnessIncrement)})`,
  }));

  const contrast: FilterToken[] = Array.from({ length: contrastSteps }, (_, i) => ({
    type: "contrast",
    step: i,
    label: stepLabel(i, contrastSteps),
    value: `contrast(${roundTo(contrastBase + i * contrastIncrement)})`,
  }));

  const saturate: FilterToken[] = Array.from({ length: saturateSteps }, (_, i) => ({
    type: "saturate",
    step: i,
    label: stepLabel(i, saturateSteps),
    value: `saturate(${roundTo(saturateBase + i * saturateIncrement)})`,
  }));

  return { blur, brightness, contrast, saturate };
}

export function filterScaleToTokens(scale: FilterScale): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const [type, entries] of Object.entries(scale)) {
    for (const token of entries as FilterToken[]) {
      tokens[`filter-${type}-${token.label}`] = token.value;
    }
  }
  return tokens;
}

export function filterVar(type: string, label: string): string {
  return `var(--filter-${type}-${label})`;
}

export function generateFilterCSS(scale: FilterScale, selector = ":root"): string {
  const tokens = filterScaleToTokens(scale);
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
  return `${selector} {\n${declarations}\n}`;
}
