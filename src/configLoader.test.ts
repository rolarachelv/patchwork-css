import * as fs from 'fs';
import * as path from 'path';
import { loadConfig, writeOutput } from './configLoader';

const TMP_DIR = path.resolve(__dirname, '../tmp-test');
const VALID_CONFIG_PATH = path.join(TMP_DIR, 'tokens.json');
const OUTPUT_PATH = path.join(TMP_DIR, 'output', 'tokens.css');

beforeAll(() => {
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
});

afterAll(() => {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
});

describe('loadConfig', () => {
  it('loads a valid JSON config', () => {
    const config = { color: { primary: '#fff' } };
    fs.writeFileSync(VALID_CONFIG_PATH, JSON.stringify(config), 'utf-8');
    const result = loadConfig(VALID_CONFIG_PATH);
    expect(result).toEqual(config);
  });

  it('throws if file does not exist', () => {
    expect(() => loadConfig('/nonexistent/path/tokens.json')).toThrow(
      'Config file not found'
    );
  });

  it('throws on invalid JSON', () => {
    const badPath = path.join(TMP_DIR, 'bad.json');
    fs.writeFileSync(badPath, '{ invalid json }', 'utf-8');
    expect(() => loadConfig(badPath)).toThrow('Failed to parse config file');
  });

  it('throws if root value is not an object', () => {
    const arrPath = path.join(TMP_DIR, 'arr.json');
    fs.writeFileSync(arrPath, JSON.stringify([1, 2, 3]), 'utf-8');
    expect(() => loadConfig(arrPath)).toThrow('must export a JSON object');
  });
});

describe('writeOutput', () => {
  it('writes css to the output path', () => {
    const css = ':root { --color-primary: #fff; }';
    writeOutput(OUTPUT_PATH, css);
    const written = fs.readFileSync(OUTPUT_PATH, 'utf-8');
    expect(written).toBe(css);
  });

  it('creates intermediate directories if needed', () => {
    const deepPath = path.join(TMP_DIR, 'deep', 'nested', 'out.css');
    writeOutput(deepPath, '/* css */');
    expect(fs.existsSync(deepPath)).toBe(true);
  });
});
