/**
 * tests/data/depletedImportRegistry.test.js — the depleted-resource shortage contract
 * and the income-gate resource needles must name REAL catalog keys.
 *
 * Regression pin for the dead-literal class: economicState's former local
 * depletion map once keyed 'clay_pits' (real key: 'river_clay') and the
 * timber income gate probed 'forest_access'/'timber_rights' (no such keys) —
 * each dead literal silently disabled a whole terrain's economics. Shortage
 * prose now lives beside the canonical resource condition, so this pin asserts:
 *   1. every RESOURCE_SEMANTICS entry has a non-empty shortage import;
 *   2. every hasNearbyResource(...) needle substring-matches at least one
 *      RESOURCE_DATA key (hasNearbyResource is a substring test).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';
import {
  RESOURCE_SEMANTICS,
  resourceShortageImport,
} from '../../src/domain/resourceSemantics.js';

const SRC = readFileSync(
  resolve(process.cwd(), 'src', 'generators', 'economy', 'economicState.js'),
  'utf-8',
);
const CATALOG_KEYS = Object.keys(RESOURCE_DATA);

describe('canonical depleted-resource shortage prose', () => {
  it.each(Object.keys(RESOURCE_SEMANTICS).map((key) => [key]))(
    '%s resolves through the canonical semantics table',
    (key) => {
      const label = resourceShortageImport(key);
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(10);
    },
  );

  it('covers exactly the native resource catalog', () => {
    expect(Object.keys(RESOURCE_SEMANTICS).sort()).toEqual(CATALOG_KEYS.sort());
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
