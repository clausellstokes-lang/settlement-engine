/**
 * generatorGoldenMaster.test.js — characterization (golden-master) guard.
 *
 * The deep-determinism test proves same-seed reproducibility WITHIN a build.
 * This proves something different and complementary: that the generator output
 * does not change ACROSS builds for a fixed corpus of configs+seeds. It exists
 * to make behavior-preserving refactors (de-minifying the big generators,
 * decomposing slices) provably safe — a pure syntactic rewrite must keep every
 * hash identical; any logic drift flips a hash and fails CI.
 *
 * The committed manifest (tests/fixtures/generator-golden-master.json) maps
 * "tier|culture|terrain|trade|threat|seed" → sha256(JSON.stringify(settlement)).
 * To regenerate after an INTENTIONAL output change, run:
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js
 * and review the diff before committing.
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const TIERS    = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic', 'celtic', 'norse', 'mediterranean'];
const TERRAINS = ['grassland', 'forest', 'river', 'coastal', 'mountains', 'swamp'];
const TRADE    = ['road', 'river', 'port', 'crossroads', 'isolated', 'none'];
const THREAT   = ['safe', 'civilized', 'frontier', 'plagued'];

/** The fixed corpus. One-dimension-at-a-time sweeps from a base config plus a
 *  full tier×culture×terrain grid — broad categorical-branch coverage without a
 *  combinatorial explosion. Deterministic order; the seed is folded into each
 *  key so the manifest is stable. */
function corpus() {
  const rows = [];
  const base = { settType: 'town', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road', monsterThreat: 'civilized' };
  const seed = 'golden-master-v1';
  // Full tier × culture × terrain grid (fixed trade/threat).
  for (const settType of TIERS) {
    for (const culture of CULTURES) {
      for (const terrain of TERRAINS) {
        rows.push({ ...base, settType, culture, terrain, _seed: seed });
      }
    }
  }
  // Sweep trade and threat independently from the base.
  for (const tradeRouteAccess of TRADE) rows.push({ ...base, tradeRouteAccess, _seed: seed });
  for (const monsterThreat of THREAT) rows.push({ ...base, monsterThreat, _seed: seed });
  // A few extra seeds on the base config (seed sensitivity is also locked).
  for (const s of ['gm-seed-a', 'gm-seed-b', 'gm-seed-c']) rows.push({ ...base, _seed: s });
  // The trade/threat sweeps re-include the base values; dedupe by key so each
  // config appears once.
  const seen = new Set();
  return rows.filter((c) => {
    const k = keyOf(c);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const keyOf = (c) => [c.settType, c.culture, c.terrain, c.tradeRouteAccess, c.monsterThreat, c._seed].join('|');

function hashFor(config) {
  const { _seed, ...cfg } = config;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  return createHash('sha256').update(JSON.stringify(s)).digest('hex');
}

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'generator-golden-master.json');

describe('generator golden master (cross-build output stability)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the golden manifest', () => {
      const out = {};
      for (const c of rows) out[keyOf(c)] = hashFor(c);
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    });
    return;
  }

  it('manifest exists (run UPDATE_GOLDEN=1 to create it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full corpus (no keys added/removed without a manifest update)', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('every config produces byte-identical output to the golden master', () => {
    const drift = [];
    for (const c of rows) {
      const k = keyOf(c);
      const got = hashFor(c);
      if (manifest[k] !== got) drift.push(k);
    }
    expect(drift).toEqual([]);
  });
});
