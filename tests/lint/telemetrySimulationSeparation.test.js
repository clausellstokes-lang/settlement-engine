/**
 * The telemetry two-layer law: simulation internals and product analytics may
 * meet only in an application adapter after the engine returns. The engine may
 * not emit analytics, and analytics modules may not read worldPulse/worldState.
 *
 * `campaignWorldPulseDeferred` is intentionally outside this census: it is the
 * store-side adapter that observes a completed user action. The deterministic
 * engine itself lives under src/domain/worldPulse and is walked in full here.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const WORLD_PULSE_ROOT = join(ROOT, 'src/domain/worldPulse');
const LIB_ROOT = join(ROOT, 'src/lib');
const IMPORT_SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(|\brequire\s*\()\s*['"]([^'"]+)['"]/g;

function filesBelow(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesBelow(path);
    return /\.[cm]?[jt]sx?$/.test(entry.name) ? [path] : [];
  });
}

function forbiddenImports(source, forbidden) {
  return [...source.matchAll(IMPORT_SPECIFIER)]
    .map(match => match[1])
    .filter(specifier => forbidden.test(specifier));
}

describe('simulation observability and product telemetry stay separate', () => {
  it('the detector catches static, dynamic, and require imports', () => {
    const fixture = [
      "import { track } from '../../lib/analytics.js';",
      "const state = await import('./worldPulse/worldState.js');",
      "require('../analyticsQueue.js');",
    ].join('\n');
    expect(forbiddenImports(fixture, /analytics|worldPulse\/worldState/i)).toEqual([
      '../../lib/analytics.js',
      './worldPulse/worldState.js',
      '../analyticsQueue.js',
    ]);
  });

  it('worldPulse engine modules do not import product analytics', () => {
    const files = filesBelow(WORLD_PULSE_ROOT);
    expect(files.length).toBeGreaterThan(100);
    const violations = files.flatMap(file => forbiddenImports(readFileSync(file, 'utf8'), /analytics/i)
      .map(specifier => `${file.slice(ROOT.length + 1)} -> ${specifier}`));
    expect(violations).toEqual([]);
  });

  it('analytics modules do not import worldPulse or worldState internals', () => {
    const files = filesBelow(LIB_ROOT).filter(file => /analytics/i.test(file));
    expect(files.length).toBeGreaterThanOrEqual(6);
    const violations = files.flatMap(file => forbiddenImports(readFileSync(file, 'utf8'), /worldPulse|worldState/i)
      .map(specifier => `${file.slice(ROOT.length + 1)} -> ${specifier}`));
    expect(violations).toEqual([]);
  });

  it('Operator Messages uses receipts, never a parallel analytics event', () => {
    const files = [
      ...filesBelow(join(ROOT, 'src')),
      ...filesBelow(join(ROOT, 'supabase/functions')),
    ].filter(file => /operator-?message/i.test(file));
    expect(files.length).toBeGreaterThanOrEqual(5);
    const violations = files.flatMap(file => {
      const source = readFileSync(file, 'utf8');
      const imports = forbiddenImports(source, /analytics/i)
        .map(specifier => `${file.slice(ROOT.length + 1)} -> ${specifier}`);
      if (/\btrack\s*\(|\bEVENTS\s*\./.test(source)) {
        imports.push(`${file.slice(ROOT.length + 1)} -> analytics emission`);
      }
      return imports;
    });
    expect(violations).toEqual([]);
  });
});
