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
 * "tier|culture|terrainOverride|trade|threat|seed" → sha256(JSON.stringify(settlement)).
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
// The pipeline's REAL terrain vocabulary. terrainOverride is the live key the
// pipeline reads (terrainHelpers.getTerrainType, resolveConfig, resolveResources);
// a bare `terrain` key is dead. These seven tokens are the ones getTerrainType
// returns and resolveConfig weights, so each value genuinely changes the terrain
// type, the terrain-specific resource pool, and the terrain institution modifiers.
const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
// Each terrain is swept with the trade route that HONESTLY reaches its resources:
// water terrains (riverside/coastal) need river/port access to unlock their
// water-terrain resources, and a forest hamlet is reached by an isolated track.
// Pairing terrain with its natural route is what makes riverside/coastal exercise
// their full resource unlock rather than degrading to the road-access subset.
const TERRAIN_ROUTE = {
  plains: 'road', hills: 'road', forest: 'isolated',
  riverside: 'river', coastal: 'port', mountain: 'road', desert: 'road',
};
const TRADE    = ['road', 'river', 'port', 'crossroads', 'isolated', 'none'];
const THREAT   = ['safe', 'civilized', 'frontier', 'plagued'];

/** The fixed corpus. One-dimension-at-a-time sweeps from a base config plus a
 *  full tier×culture×terrain grid — broad categorical-branch coverage without a
 *  combinatorial explosion. Each grid row pins terrainOverride (the live terrain
 *  key) paired with a terrain-honest trade route, so the seven terrains each drive
 *  a genuinely distinct output (distinct terrainType, terrain-specific resources,
 *  and terrain institution modifiers) rather than an inert echoed config string.
 *  Deterministic order; the seed is folded into each key so the manifest is
 *  stable. */
function corpus() {
  const rows = [];
  const base = { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized' };
  const seed = 'golden-master-v3';
  // Full tier × culture × terrain grid (terrain paired with its honest route).
  for (const settType of TIERS) {
    for (const culture of CULTURES) {
      for (const terrainOverride of TERRAINS) {
        rows.push({ ...base, settType, culture, terrainOverride, tradeRouteAccess: TERRAIN_ROUTE[terrainOverride], _seed: seed });
      }
    }
  }
  // Sweep trade and threat independently from the base (plains baseline).
  for (const tradeRouteAccess of TRADE) rows.push({ ...base, tradeRouteAccess, _seed: seed });
  for (const monsterThreat of THREAT) rows.push({ ...base, monsterThreat, _seed: seed });
  // Pin the random_trade machinery: the weighted terrain roll (TERRAIN_WEIGHTS)
  // and the terrain-constrained route pools (TERRAIN_ROUTE_POOLS) in
  // resolveConfig are reachable ONLY via tradeRouteAccess:'random_trade' with an
  // 'auto' (unpinned) terrain, so every fixed-route/fixed-terrain row above
  // bypasses them. terrainOverride 'auto' is required here: the base pins
  // 'plains', which suppresses the roll (doRandomTerrain needs an unset/auto
  // override). Seeded → deterministic. The 'mountain' variant pins the
  // override+random_trade interaction: the explicit override wins the terrain, so
  // doRandomTerrain stays false and the route rolls from the GENERIC pool, not
  // the terrain pool.
  for (const s of [seed, 'gm-seed-a', 'gm-seed-b', 'gm-seed-c']) {
    rows.push({ ...base, tradeRouteAccess: 'random_trade', terrainOverride: 'auto', _seed: s });
    rows.push({ ...base, tradeRouteAccess: 'random_trade', terrainOverride: 'mountain', _seed: s });
  }
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

const keyOf = (c) => [c.settType, c.culture, c.terrainOverride, c.tradeRouteAccess, c.monsterThreat, c._seed].join('|');

function hashFor(config) {
  const { _seed, ...cfg } = config;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  return createHash('sha256').update(JSON.stringify(s)).digest('hex');
}

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'generator-golden-master.json');

describe('generator golden master (cross-build output stability)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    // ~190 full-pipeline generations overrun the root 20s testTimeout on
    // slow/parallel runners — a wall-clock false positive, not drift. Precedent:
    // worldMapMobileGate + pglite override blocks.
    it('captures the golden manifest', () => {
      const out = {};
      for (const c of rows) out[keyOf(c)] = hashFor(c);
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    }, 120_000);
    return;
  }

  it('manifest exists (run UPDATE_GOLDEN=1 to create it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full corpus (no keys added/removed without a manifest update)', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  // Same wall-clock allowance as the capture block above.
  it('every config produces byte-identical output to the golden master', () => {
    const drift = [];
    for (const c of rows) {
      const k = keyOf(c);
      const got = hashFor(c);
      if (manifest[k] !== got) drift.push(k);
    }
    expect(drift).toEqual([]);
  }, 120_000);
});
