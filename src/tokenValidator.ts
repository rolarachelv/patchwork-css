import { DesignTokens, TokenValue } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
}

const VALID_UNITS = ['px', 'rem', 'em', '%', 'vh', 'vw', 'pt', 'ms', 's', 'deg'];
const REFERENCE_PATTERN = /^\{[a-zA-Z0-9._-]+\}$/;

export function validateTokens(tokens: DesignTokens, path = ''): ValidationResult {
  const errors: ValidationError[] = [];

  for (const [key, value] of Object.entries(tokens)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(key)) {
      errors.push({
        path: currentPath,
        message: `Invalid token key "${key}": must start with a letter and contain only alphanumeric characters, hyphens, or underscores`,
      });
    }

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const nested = validateTokens(value as DesignTokens, currentPath);
      errors.push(...nested.errors);
    } else {
      const valueErrors = validateTokenValue(String(value), currentPath);
      errors.push(...valueErrors);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateTokenValue(value: string, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (value === undefined || value === null || value.trim() === '') {
    errors.push({ path, message: 'Token value must not be empty' });
    return errors;
  }

  if (REFERENCE_PATTERN.test(value)) {
    return errors;
  }

  const numericWithUnit = /^-?[0-9]+(\.[0-9]+)?([a-zA-Z%]+)?$/;
  if (numericWithUnit.test(value)) {
    const unitMatch = value.match(/[a-zA-Z%]+$/);
    if (unitMatch && !VALID_UNITS.includes(unitMatch[0])) {
      errors.push({
        path,
        message: `Unknown unit "${unitMatch[0]}" in value "${value}". Expected one of: ${VALID_UNITS.join(', ')}`,
      });
    }
  }

  return errors;
}
