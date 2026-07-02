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
import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

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

// ── worldPulse cross-build golden master ──────────────────────────────────────
// Finding: the generator golden above pins generation only. The pulse layer had
// strong WITHIN-build determinism tests but NO cross-build pin, so a tuning
// constant or an rng fork-label rename in pulse code would ship silently. This
// closes that gap. It pins the MECHANICAL projection of a preview run — the
// candidate rolls (id, roll value, passed) plus the selected candidate ids and
// the tick — NOT prose, so it catches tuning/rng drift without false-positiving
// on unrelated narrative-copy edits. Inputs are fully deterministic (fixed
// rngSeed + fixed `now`), the same seams the within-build determinism test uses.
const PULSE_MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'worldpulse-golden-master.json');

function pulseSettlement(name, patch = {}) {
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
    institutions: [], economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 28, label: 'Legitimacy Crisis' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 72 },
        { faction: 'Temple Wardens', category: 'religious', power: 54 },
      ],
      conflicts: [],
    },
    npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
    activeConditions: [], ...patch,
  };
}
const pulseSave = (id, name, patch = {}) => ({
  id, name, phase: 'canon', settlement: pulseSettlement(name, patch),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

/** The pulse corpus: a fixed base world driven at a few (seed, tick, interval)
 *  points. Small and deterministic — broad enough to trip on a candidate-set,
 *  roll-formula, or selection-order change without depending on prose. */
function pulseCorpus() {
  return [
    { seed: 'gm-pulse-a', tick: 3, interval: 'one_week' },
    { seed: 'gm-pulse-a', tick: 3, interval: 'one_month' },
    { seed: 'gm-pulse-b', tick: 5, interval: 'one_month' },
    { seed: 'gm-pulse-c', tick: 8, interval: 'one_week' },
  ];
}
const pulseKeyOf = (c) => [c.seed, c.tick, c.interval].join('|');

/** Hash the MECHANICAL projection only (rolls + selected ids + tick), never prose. */
function pulseHashFor({ seed, tick, interval }) {
  const campaign = {
    id: 'camp-world', name: 'World', settlementIds: ['a', 'b'],
    worldState: { rngSeed: seed, tick },
    regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }] }),
    wizardNews: { currentTick: tick, entries: [] },
  };
  const saves = [
    pulseSave('a', 'Ashford', { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.7 }] }),
    pulseSave('b', 'Briarwatch'),
  ];
  const r = previewCampaignWorldPulse({ campaign, saves, interval, now: '2026-01-01T00:00:00.000Z' });
  const projection = {
    tick: r.tick,
    rolls: (r.rollExplanations || []).map((x) => [x.candidateId, x.roll, x.passed]),
    selected: (r.selected || []).map((x) => x.id),
  };
  return createHash('sha256').update(JSON.stringify(projection)).digest('hex');
}

describe('worldPulse golden master (cross-build mechanical stability)', () => {
  const rows = pulseCorpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the pulse golden manifest', () => {
      const out = {};
      for (const c of rows) out[pulseKeyOf(c)] = pulseHashFor(c);
      if (!existsSync(dirname(PULSE_MANIFEST))) mkdirSync(dirname(PULSE_MANIFEST), { recursive: true });
      writeFileSync(PULSE_MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    });
    return;
  }

  it('pulse manifest exists (run UPDATE_GOLDEN=1 to create it)', () => {
    expect(existsSync(PULSE_MANIFEST)).toBe(true);
  });

  const manifest = existsSync(PULSE_MANIFEST) ? JSON.parse(readFileSync(PULSE_MANIFEST, 'utf-8')) : {};

  it('covers the full pulse corpus (no keys added/removed without a manifest update)', () => {
    expect(rows.map(pulseKeyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('every pulse config produces the golden mechanical projection', () => {
    const drift = [];
    for (const c of rows) {
      const k = pulseKeyOf(c);
      if (manifest[k] !== pulseHashFor(c)) drift.push(k);
    }
    expect(drift).toEqual([]);
  });
});
