import { FlatTokenMap } from './types';

/**
 * Resolves token references within a flat token map.
 * References use the syntax: {token.path}
 */
export function resolveReferences(tokens: FlatTokenMap): FlatTokenMap {
  const resolved: FlatTokenMap = { ...tokens };
  const refPattern = /^\{([^}]+)\}$/;

  let hasUnresolved = true;
  let iterations = 0;
  const maxIterations = 10;

  while (hasUnresolved && iterations < maxIterations) {
    hasUnresolved = false;
    iterations++;

    for (const [key, value] of Object.entries(resolved)) {
      const match = String(value).match(refPattern);
      if (match) {
        const refKey = match[1];
        if (resolved[refKey] !== undefined) {
          const refValue = String(resolved[refKey]);
          // Only resolve if the referenced value is not itself a reference
          if (!refValue.match(refPattern)) {
            resolved[key] = refValue;
          } else {
            hasUnresolved = true;
          }
        } else {
          console.warn(`[patchwork-css] Unresolved token reference: "${refKey}" in key "${key}"`);
        }
      }
    }
  }

  if (iterations >= maxIterations) {
    console.warn('[patchwork-css] Max reference resolution iterations reached. Possible circular reference.');
  }

  return resolved;
}

/**
 * Checks whether a token value is a reference string.
 */
export function isReference(value: string): boolean {
  return /^\{[^}]+\}$/.test(value);
}

/**
 * Extracts the reference key from a reference string.
 * Returns null if not a reference.
 */
export function extractReferenceKey(value: string): string | null {
  const match = value.match(/^\{([^}]+)\}$/);
  return match ? match[1] : null;
}
