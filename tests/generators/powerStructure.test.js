/**
 * tests/generators/powerStructure.test.js — F31 structural pins for the
 * powerGenerator split.
 *
 * powerGenerator.js was a ~2,500-line de-minified monolith. It is now a thin
 * re-export barrel over cohesive modules under src/generators/power/. These
 * pins keep that shape from eroding back into a monolith:
 *
 *   1. the entry file stays a barrel (small line ceiling),
 *   2. every power/ module stays under the module ceiling,
 *   3. the public export surface equals an explicit, checked-in list.
 *
 * These are pure file-structure assertions (no pipeline import), so they stay
 * meaningful and green regardless of unrelated engine state. Behaviour
 * preservation across the split is proven separately and byte-for-byte by
 * tests/property/generatorGoldenMaster.test.js.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const ENTRY = path.join(ROOT, 'src/generators/powerGenerator.js');
const POWER_DIR = path.join(ROOT, 'src/generators/power');

// Line ceilings. The entry is a barrel; the ~400 ceiling is the documented
// contract, not the current size (it is a handful of lines). Modules stay
// under 800 so no single module drifts back toward monolith scale.
const ENTRY_LINE_CEILING = 400;
const MODULE_LINE_CEILING = 800;

// The frozen public surface. powerGenerator.js must re-export exactly these —
// the symbols external importers (steps/, generateSettlementPipeline,
// narrativeGenerator, npcGenerator) depend on. Adding/removing one is a
// deliberate API change: update this list in the same commit.
const PUBLIC_EXPORTS = [
  'computeRelTension',
  'genRelNarrative',
  'genSuccessionNarr',
  'generateConflicts',
  'generateFactions',
  'generatePowerStructure',
].sort();

const lineCount = (file) => fs.readFileSync(file, 'utf8').split('\n').length;

/** Names re-exported by the barrel via `export { a, b as c } from '...'`. */
function barrelExports(src) {
  const names = [];
  for (const m of src.matchAll(/export\s*\{([^}]*)\}\s*from/g)) {
    for (const part of m[1].split(',')) {
      const token = part.trim();
      if (!token) continue;
      const asMatch = token.match(/\bas\s+([A-Za-z_$][\w$]*)/);
      names.push(asMatch ? asMatch[1] : token);
    }
  }
  return names;
}

describe('F31: powerGenerator split structure', () => {
  it('the entry file stays a thin re-export barrel (line ceiling)', () => {
    expect(lineCount(ENTRY)).toBeLessThanOrEqual(ENTRY_LINE_CEILING);
  });

  it('the entry file contains no implementation (only re-exports)', () => {
    const src = fs
      .readFileSync(ENTRY, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');
    // A barrel declares nothing of its own — no const/function/class bodies.
    expect(src).not.toMatch(/^\s*(export\s+)?(const|let|var|function|class)\s/m);
  });

  it('every power/ module stays under the module line ceiling', () => {
    const modules = fs
      .readdirSync(POWER_DIR)
      .filter((f) => f.endsWith('.js'))
      .sort();
    expect(modules.length).toBeGreaterThan(0);
    const oversized = modules
      .map((f) => [f, lineCount(path.join(POWER_DIR, f))])
      .filter(([, n]) => n > MODULE_LINE_CEILING)
      .map(([f, n]) => `${f}: ${n} lines`);
    expect(oversized).toEqual([]);
  });

  it('the public export surface equals the checked-in list', () => {
    const src = fs.readFileSync(ENTRY, 'utf8');
    expect(barrelExports(src).sort()).toEqual(PUBLIC_EXPORTS);
  });
});
