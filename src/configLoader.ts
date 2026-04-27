import * as fs from 'fs';
import * as path from 'path';
import { TokenConfig } from './types';

/**
 * Loads and parses a JSON token config file from the given path.
 * Throws descriptive errors on missing file or invalid JSON.
 */
export function loadConfig(filePath: string): TokenConfig {
  const resolved = path.resolve(filePath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`[patchwork-css] Config file not found: ${resolved}`);
  }

  let raw: string;
  try {
    raw = fs.readFileSync(resolved, 'utf-8');
  } catch (err) {
    throw new Error(
      `[patchwork-css] Failed to read config file: ${resolved}\n${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `[patchwork-css] Failed to parse config file as JSON: ${resolved}\n${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(
      `[patchwork-css] Config file must export a JSON object: ${resolved}`
    );
  }

  return parsed as TokenConfig;
}

/**
 * Writes a CSS string to the specified output file.
 * Creates intermediate directories if they don't exist.
 */
export function writeOutput(outputPath: string, css: string): void {
  const resolved = path.resolve(outputPath);
  const dir = path.dirname(resolved);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(resolved, css, 'utf-8');
}
