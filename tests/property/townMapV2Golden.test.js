/**
 * townMapV2Golden.test.js — the committed TOWN LAYOUT v2 model GOLDEN (task #38).
 *
 * The v2 goldens EXTEND the v1 set — this is a SEPARATE manifest; the v1 golden
 * (townMapGolden.test.js / town-map-golden.json) is untouched, so the versioning law
 * ("existing settlements stay v1, byte-identical") is preserved by construction: a
 * geometry-law nudge, a Lynch-rubric change, an affinity-table drift, or a
 * key-order/shape change in the v2 engine trips THIS pin, never the v1 one.
 *
 * Because buildTownMapModel(settlement, { layoutLawVersion: 2 }) is a pure function
 * with an internally-derived seed and no trig, the hash is stable across machines.
 *
 * Capture/refresh (only for an APPROVED v2 model change — e.g. a vetoed morphology-
 * weight / rubric-floor tuning): UPDATE_GOLDEN=1 npx vitest run tests/property/townMapV2Golden.test.js
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { LYNCH_ACCEPT_FLOOR } from '../../src/domain/townMap/lynchRubric.js';
import { V2_GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'town-map-v2-golden.json');
const UPDATE = process.env.UPDATE_GOLDEN === '1';

/** Build the per-config v2 model outputs (the hashed payload). */
function goldenOutputs() {
  return V2_GOLDEN_CONFIGS.map(({ settlement, mapEdits }) => buildTownMapModel(settlement, mapEdits));
}

const hashOf = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** Aggregate legible meta beside the hash. */
function metaOf(outputs) {
  const morphs = new Set();
  let totalBuildings = 0;
  let totalDistricts = 0;
  let minScore = 1;
  let fabricLit = 0;
  for (const m of outputs) {
    morphs.add(m.meta.morphology);
    totalBuildings += m.meta.buildingCount;
    totalDistricts += m.meta.districtCount;
    if (m.meta.lynchScore < minScore) minScore = m.meta.lynchScore;
    if (m.meta.hasFabric) fabricLit++;
  }
  return {
    configs: outputs.length,
    totalBuildings,
    totalDistricts,
    distinctMorphologies: morphs.size,
    fabricLitConfigs: fabricLit,
    minLynchScore: Math.round(minScore * 10000) / 10000,
    townMapGeometryVersion: outputs[0].townMapGeometryVersion,
    layoutLawVersion: outputs[0].layoutLawVersion,
    bytes: JSON.stringify(outputs).length,
  };
}

describe('GOLDEN — town-map v2 model', () => {
  it('the fixed v2 corpus hashes to the committed manifest', () => {
    const outputs = goldenOutputs();
    const hash = hashOf(outputs);
    const meta = metaOf(outputs);
    const record = { hash, ...meta };
    if (UPDATE) {
      mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(record, Object.keys(record).sort(), 2) + '\n');
    }
    expect(
      existsSync(MANIFEST),
      'town-map-v2-golden.json missing — for an APPROVED v2 model change run: UPDATE_GOLDEN=1 npx vitest run tests/property/townMapV2Golden.test.js',
    ).toBe(true);
    const pinned = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
    expect(hash).toBe(pinned.hash);
    expect(meta.configs).toBe(pinned.configs);
    expect(meta.totalBuildings).toBe(pinned.totalBuildings);
    expect(meta.totalDistricts).toBe(pinned.totalDistricts);
    expect(meta.layoutLawVersion).toBe(pinned.layoutLawVersion);
  });

  it('is reproducible — a second build hashes identically', () => {
    expect(hashOf(goldenOutputs())).toBe(hashOf(goldenOutputs()));
  });

  it('every v2 model is layout-law v2 / geometry v2', () => {
    for (const m of goldenOutputs()) {
      expect(m.layoutLawVersion).toBe(2);
      expect(m.townMapGeometryVersion).toBe(2);
      expect(m.meta.layoutVariant).toBe(0);
    }
  });

  it('THE LYNCH RUBRIC — every accepted layout rates at or above the floor', () => {
    // The self-scoring bounded-retry loop's contract: a candidate must RATE before
    // acceptance. This pins that every golden seed's accepted layout clears the floor.
    for (const m of goldenOutputs()) {
      expect(m.meta.lynchScore, `${m.meta.morphology} @ ${m.meta.tier}`).toBeGreaterThanOrEqual(LYNCH_ACCEPT_FLOOR);
      // the parts are all present + in range
      const p = m.meta.lynchParts;
      for (const k of ['paths', 'edges', 'districts', 'nodes', 'landmarks', 'jacobs', 'alexander', 'gehl', 'gradient']) {
        expect(p[k]).toBeGreaterThanOrEqual(0);
        expect(p[k]).toBeLessThanOrEqual(1);
      }
    }
  });

  it('the corpus spans all FIVE morphologies (form vocabulary)', () => {
    const morphs = new Set(goldenOutputs().map((m) => m.meta.morphology));
    for (const want of ['organic-radial', 'concentric', 'river-spine', 'harbor-fan', 'bastide-grid']) {
      expect(morphs.has(want), `missing morphology ${want}`).toBe(true);
    }
  });

  it('anti-vacuity — real buildings and districts across the corpus', () => {
    const meta = metaOf(goldenOutputs());
    expect(meta.totalBuildings).toBeGreaterThan(0);
    expect(meta.totalDistricts).toBeGreaterThan(0);
    expect(meta.fabricLitConfigs).toBeGreaterThanOrEqual(1); // the fabric branch is exercised
  });
});
