/**
 * townMapGolden.test.js — the committed town-map model GOLDEN (design §7).
 *
 * The ~18-config synthetic corpus (townMapFixtures.GOLDEN_CONFIGS) ⇒ a sha256-
 * pinned set of per-config render models. A geometry-law nudge, an affinity-table
 * change, a tie-break drift, an assigner bug, or a schema/key-order change trips
 * this. Because buildTownMapModel is a pure function of (settlement, mapEdits)
 * with an internally-derived seed and no trig, the hash is stable across machines
 * and runs.
 *
 * Capture/refresh (only for an APPROVED model change):
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/townMapGolden.test.js
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'town-map-golden.json');
const UPDATE = process.env.UPDATE_GOLDEN === '1';

/** Build the per-config model outputs (the hashed payload). */
function goldenOutputs() {
  return GOLDEN_CONFIGS.map(({ settlement }) => buildTownMapModel(settlement));
}

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** Aggregate legible meta beside the hash. */
function metaOf(outputs) {
  const tiers = new Set();
  const terrains = new Set();
  let walledTrue = 0;
  let walledFalse = 0;
  let waterTrue = 0;
  let waterFalse = 0;
  let totalBuildings = 0;
  let totalDistricts = 0;
  for (let i = 0; i < outputs.length; i++) {
    const m = outputs[i].meta;
    tiers.add(m.tier);
    if (m.terrain) terrains.add(m.terrain);
    if (m.hasWalls) walledTrue++; else walledFalse++;
    const spec = GOLDEN_CONFIGS[i].spec;
    if (spec.water) waterTrue++; else waterFalse++;
    totalBuildings += m.buildingCount;
    totalDistricts += m.districtCount;
  }
  return {
    configs: outputs.length,
    totalBuildings,
    totalDistricts,
    distinctTiers: tiers.size,
    distinctTerrains: terrains.size,
    walledTrue,
    walledFalse,
    waterTrue,
    waterFalse,
    townMapGeometryVersion: outputs[0].townMapGeometryVersion,
    layoutLawVersion: outputs[0].layoutLawVersion,
    overlayVersion: outputs[0].overlayVersion,
    bytes: JSON.stringify(outputs).length,
  };
}

describe('GOLDEN — town-map model', () => {
  it('the fixed corpus hashes to the committed manifest', () => {
    const outputs = goldenOutputs();
    const hash = hashOf(outputs);
    const meta = metaOf(outputs);
    const record = { hash, ...meta };
    if (UPDATE) {
      mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(record, Object.keys(record).sort(), 2) + '\n');
    }
    // Fail-closed: a missing manifest must NOT self-mint a fresh green pin. A
    // merge/checkout that drops the fixture reds here — with regen instructions —
    // instead of laundering a geometry/affinity drift into a new pin.
    expect(
      existsSync(MANIFEST),
      'town-map-golden.json missing — for an APPROVED model change run: UPDATE_GOLDEN=1 npx vitest run tests/property/townMapGolden.test.js',
    ).toBe(true);
    const pinned = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
    expect(hash).toBe(pinned.hash);
    // Meta guards against a silent shape drift that happened to re-hash.
    expect(meta.configs).toBe(pinned.configs);
    expect(meta.totalBuildings).toBe(pinned.totalBuildings);
    expect(meta.totalDistricts).toBe(pinned.totalDistricts);
    expect(meta.townMapGeometryVersion).toBe(pinned.townMapGeometryVersion);
  });

  it('is reproducible — a second build hashes identically', () => {
    expect(hashOf(goldenOutputs())).toBe(hashOf(goldenOutputs()));
  });

  it('anti-vacuity — the corpus is non-empty and spans the axes', () => {
    const outputs = goldenOutputs();
    const meta = metaOf(outputs);
    // A stubbed/empty model cannot pass: real buildings and districts exist.
    expect(meta.totalBuildings).toBeGreaterThan(0);
    expect(meta.totalDistricts).toBeGreaterThan(0);
    // The corpus actually spans the declared axes.
    expect(meta.distinctTiers).toBeGreaterThanOrEqual(6);
    expect(meta.distinctTerrains).toBeGreaterThanOrEqual(7);
    expect(meta.walledTrue).toBeGreaterThanOrEqual(2);
    expect(meta.walledFalse).toBeGreaterThanOrEqual(2);
    expect(meta.waterTrue).toBeGreaterThanOrEqual(2);
    expect(meta.waterFalse).toBeGreaterThanOrEqual(2);
  });
});
