/**
 * Generates a z-index scale from a base config.
 */

export interface ZIndexScaleConfig {
  layers: string[];
  base?: number;
  step?: number;
}

export interface ZIndexScaleResult {
  [layer: string]: number;
}

/**
 * Generates a z-index scale mapping layer names to numeric z-index values.
 * Layers are assigned values in ascending order starting from `base`.
 *
 * @param config - Configuration object with layer names, optional base and step
 * @returns Record of layer name to z-index value
 */
export function generateZIndexScale(config: ZIndexScaleConfig): ZIndexScaleResult {
  const { layers, base = 0, step = 10 } = config;

  if (!Array.isArray(layers) || layers.length === 0) {
    throw new Error('zIndexScale: layers must be a non-empty array of strings');
  }

  if (step <= 0) {
    throw new Error('zIndexScale: step must be a positive number');
  }

  return layers.reduce<ZIndexScaleResult>((acc, layer, index) => {
    if (typeof layer !== 'string' || layer.trim() === '') {
      throw new Error(`zIndexScale: invalid layer name at index ${index}`);
    }
    acc[layer.trim()] = base + index * step;
    return acc;
  }, {});
}

/**
 * Converts a z-index scale result into a flat token map.
 * e.g. { 'zIndex.base': 0, 'zIndex.overlay': 10 }
 */
export function zIndexScaleToTokens(
  scale: ZIndexScaleResult,
  prefix = 'zIndex'
): Record<string, number> {
  return Object.entries(scale).reduce<Record<string, number>>((acc, [layer, value]) => {
    acc[`${prefix}.${layer}`] = value;
    return acc;
  }, {});
}

/**
 * Generates CSS custom properties for a z-index scale.
 * e.g. --z-index-base: 0;
 */
export function generateZIndexCSS(
  scale: ZIndexScaleResult,
  prefix = 'z-index'
): string {
  return Object.entries(scale)
    .map(([layer, value]) => `  --${prefix}-${layer}: ${value};`)
    .join('\n');
}
