/**
 * servicesStructure.test.js — F31 decomposition pin.
 *
 * servicesGenerator.js was a ~2000-line de-minified monolith (wrong function
 * names, dead underscore duplicates, single-letter locals). It was split into
 * cohesive modules under src/generators/services/ behind a thin entry that
 * re-exports the one public symbol. This test locks that shape so the monolith
 * cannot silently regrow and the public surface cannot drift:
 *
 *  - the entry stays a thin orchestrator (line ceiling),
 *  - every services/ module stays focused (line ceiling),
 *  - the entry's public export surface is exactly { generateAvailableServices }.
 *
 * Behavior preservation itself is guarded elsewhere (generatorGoldenMaster).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const GEN_DIR = join(import.meta.dirname, '../../src/generators');
const ENTRY = join(GEN_DIR, 'servicesGenerator.js');
const SERVICES_DIR = join(GEN_DIR, 'services');

const lineCount = (path) => readFileSync(path, 'utf8').split('\n').length;

const ENTRY_CEILING = 400;
const MODULE_CEILING = 800;

describe('servicesGenerator decomposition (F31)', () => {
  test('entry stays a thin orchestrator (<= 400 lines)', () => {
    expect(lineCount(ENTRY)).toBeLessThanOrEqual(ENTRY_CEILING);
  });

  test('every services/ module stays under 800 lines', () => {
    const modules = readdirSync(SERVICES_DIR).filter((f) => f.endsWith('.js'));
    // The split produced real seams; guard against a module re-absorbing the rest.
    expect(modules.length).toBeGreaterThanOrEqual(4);
    const oversize = modules.filter((f) => lineCount(join(SERVICES_DIR, f)) >= MODULE_CEILING);
    expect(oversize, 'services/ modules over the line ceiling').toEqual([]);
  });

  test('entry public export surface is exactly { generateAvailableServices }', () => {
    const src = readFileSync(ENTRY, 'utf8');
    const exported = [...src.matchAll(/^export\s+(?:const|function|let|class)\s+([A-Za-z0-9_$]+)/gm)].map(
      (m) => m[1]
    );
    const reexported = [...src.matchAll(/^export\s*\{([^}]*)\}/gm)]
      .flatMap((m) => m[1].split(','))
      .map((s) => s.trim().split(/\s+as\s+/).pop().trim())
      .filter(Boolean);
    expect([...exported, ...reexported].sort()).toEqual(['generateAvailableServices']);
  });
});
