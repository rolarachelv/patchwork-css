/**
 * colorUtils.ts
 * Utility functions for colour token manipulation:
 * hex <-> rgb conversion, opacity variants, and contrast checking.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** Parse a 3- or 6-digit hex string (with or without #) into RGB components. */
export function hexToRgb(hex: string): RGB {
  const clean = hex.replace(/^#/, "");
  if (clean.length !== 3 && clean.length !== 6) {
    throw new Error(`Invalid hex colour: "${hex}"`);
  }
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** Convert RGB components back to a lowercase 6-digit hex string (with #). */
export function rgbToHex({ r, g, b }: RGB): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Return a CSS rgba() string for the given hex colour at the specified opacity.
 * @param hex   - source colour, e.g. "#3b82f6"
 * @param alpha - opacity between 0 and 1
 */
export function withOpacity(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Calculate relative luminance for a hex colour (WCAG 2.1 formula).
 */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const channel = (raw: number): number => {
    const sRGB = raw / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Return the WCAG 2.1 contrast ratio between two hex colours.
 * A ratio ≥ 4.5 satisfies AA for normal text.
 */
export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
