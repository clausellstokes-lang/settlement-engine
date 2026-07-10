/**
 * tests/data/depletedImportRegistry.test.js — the depleted-resource import map
 * and the income-gate resource needles must name REAL catalog keys.
 *
 * Regression pin for the dead-literal class: economicState's
 * DEPLETED_IMPORT_MAP once keyed 'clay_pits' (real key: 'river_clay') and the
 * timber income gate probed 'forest_access'/'timber_rights' (no such keys) —
 * each dead literal silently disabled a whole terrain's economics. The map is
 * function-local, so this pin scans the module source (the repo's established
 * source-scan pattern) and asserts:
 *   1. every DEPLETED_IMPORT_MAP key is an EXACT RESOURCE_DATA key;
 *   2. every hasNearbyResource(...) needle substring-matches at least one
 *      RESOURCE_DATA key (hasNearbyResource is a substring test).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';

const SRC = readFileSync(
  resolve(process.cwd(), 'src', 'generators', 'economy', 'economicState.js'),
  'utf-8',
);
const CATALOG_KEYS = Object.keys(RESOURCE_DATA);

describe('DEPLETED_IMPORT_MAP keys are real resource-catalog keys', () => {
  // Extract the object literal after "const DEPLETED_IMPORT_MAP = {".
  const start = SRC.indexOf('DEPLETED_IMPORT_MAP = {');
  expect(start, 'DEPLETED_IMPORT_MAP must exist in economicState.js').toBeGreaterThan(-1);
  const body = SRC.slice(start, SRC.indexOf('};', start));
  const keys = [...body.matchAll(/^\s*([a-z_]+):\s*'/gm)].map((m) => m[1]);

  it('extracts a non-trivial key set (scan is not vacuous)', () => {
    expect(keys.length).toBeGreaterThanOrEqual(8);
  });

  it.each(keys.map((k) => [k]))('%s is an exact RESOURCE_DATA key', (key) => {
    expect(CATALOG_KEYS, `dead map key '${key}' can never receive a depleted resource`).toContain(key);
  });
});

describe('hasNearbyResource needles substring-match real catalog keys', () => {
  // Every quoted needle passed to hasNearbyResource(...) in the module.
  const needles = new Set();
  for (const m of SRC.matchAll(/hasNearbyResource\(([^)]*)\)/g)) {
    for (const q of m[1].matchAll(/'([^']+)'/g)) needles.add(q[1]);
  }

  it('extracts a non-trivial needle set (scan is not vacuous)', () => {
    expect(needles.size).toBeGreaterThanOrEqual(4);
  });

  it.each([...needles].map((n) => [n]))('needle %s matches at least one catalog key', (needle) => {
    expect(
      CATALOG_KEYS.some((k) => k.includes(needle)),
      `dead needle '${needle}' substring-matches no RESOURCE_DATA key — the gate it guards can never fire on it`,
    ).toBe(true);
  });
});
