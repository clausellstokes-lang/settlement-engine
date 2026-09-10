/**
 * spatialConsequenceKernel.test.js — DOOR 1 engine consumers:
 *   (a) the calamity WHERE field (totals untouched, bucket-neutral prose),
 *   (c) the covert district-diffusion beat,
 *   (b) the fabric scar gaining wallSegmentId/districtId precision (additivity).
 *
 * The kernel is a PURE READER — it derives nothing and mutates no worldState; it reads
 * the frozen substrate (written at canonize) and emits chronicle beats. Dark ⇒ a
 * complete no-op.
 */
import { describe, it, expect } from 'vitest';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { deriveSpatialSubstrate } from '../../src/domain/spatial/spatialSubstrate.js';
import { advanceSpatialConsequence } from '../../src/domain/worldPulse/spatialConsequenceKernel.js';
import { advanceUrbanFabric } from '../../src/domain/worldPulse/urbanFabricKernel.js';

function walledCity() {
  return {
    _seed: 'consumer-fixture-1', id: 's1', name: 'Ashford', tier: 'city', population: 9000,
    config: { tradeRouteAccess: 'road', economicBase: 'trade', terrainType: 'plains' },
    defenseProfile: { hasWalls: true, fortificationLevel: 'walled' },
    spatialLayout: { quarters: [
      { name: 'Temple Ward', location: 'central', category: 'religious' },
      { name: 'Merchant Row', location: 'east', category: 'merchant' },
      { name: 'The Tanneries', location: 'south', category: 'industrial' },
      { name: 'Garrison', location: 'north', category: 'military' },
      { name: 'Shadow Docks', location: 'west', category: 'criminal' },
      { name: 'High Manor', location: 'hilltop', category: 'noble' },
    ] },
    institutions: [
      { name: 'Grand Temple', category: 'religious', status: 'active' },
      { name: 'Town Hall', category: 'civic', required: true, status: 'active' },
    ],
    economicState: { prosperity: 'Comfortable', exports: ['leather'] },
    powerStructure: { factions: [{ name: 'Guild', isGoverning: true }] },
  };
}
const TICK = 260;
function substrateFor(s) { return deriveSpatialSubstrate(buildTownMapModel(s, null)); }
/** A worldState with the substrate seeded (as the canonize body would), optionally lit. */
function worldWith(settlement, { lit = true, exposed = null } = {}) {
  return {
    tick: TICK,
    simulationRules: lit ? { spatialConsequenceEnabled: true } : {},
    spatialLedgers: {
      spatialSubstrate: { s1: substrateFor(settlement) },
      ...(exposed ? { exposedCorruption: exposed } : {}),
    },
  };
}
const snapshotOf = (settlement) => ({ settlements: [{ id: 's1', name: 'Ashford', settlement }] });

// A disaster kind must NEVER appear in the engine's bucket-neutral prose.
const KIND_WORDS = /\b(fire|blaze|flood|deluge|plague|quake|earthquake|storm|conflagration|pestilence)\b/i;

describe('DOOR 1 — dormancy (the pure reader is a no-op when dark)', () => {
  it('flag absent ⇒ no beat, changed false', () => {
    const s = walledCity();
    s.calamityHistory = [{ type: 'fire', name: 'The Calamity', year: 5, tick: TICK, deaths: 200, exodus: 100, k: 1, targets: ['Tannery'] }];
    const r = advanceSpatialConsequence({ snapshot: snapshotOf(s), worldState: worldWith(s, { lit: false }), tick: TICK, now: null });
    expect(r.changed).toBe(false);
    expect(r.newsEntries).toEqual([]);
  });
});

describe('DOOR 1 consumer (a) — calamity toll WHERE-not-HOW-MUCH', () => {
  it('a fresh calamity ⇒ a district-naming beat; totals untouched; bucket-neutral', () => {
    const s = walledCity();
    const stamp = { type: 'fire', name: 'The Calamity', year: 5, tick: TICK, deaths: 200, exodus: 120, k: 1, targets: ['Tannery'] };
    s.calamityHistory = [stamp];
    const ws = worldWith(s, { lit: true });
    const r = advanceSpatialConsequence({ snapshot: snapshotOf(s), worldState: ws, tick: TICK, now: null });
    expect(r.newsEntries.length).toBe(1);
    const beat = r.newsEntries[0];
    expect(beat.impactKind).toBe('spatial_consequence');
    expect(beat.tags).toContain('calamity_where');
    // WHERE-not-HOW-MUCH: the kernel returns no worldState — it CANNOT touch the toll;
    // the stamp's deaths/exodus are exactly as passed in.
    expect(r.worldState).toBeUndefined();
    expect(stamp.deaths).toBe(200);
    expect(stamp.exodus).toBe(120);
    // Bucket-neutral: the prose names a DISTRICT category, never the disaster kind.
    expect(KIND_WORDS.test(beat.headline + ' ' + beat.summary)).toBe(false);
    expect(beat.summary).toMatch(/quarter/);
  });

  it('a STALE calamity (tick ≠ now) ⇒ no beat', () => {
    const s = walledCity();
    s.calamityHistory = [{ type: 'fire', name: 'Old', year: 1, tick: TICK - 50, deaths: 200, exodus: 100, k: 1, targets: ['Tannery'] }];
    const r = advanceSpatialConsequence({ snapshot: snapshotOf(s), worldState: worldWith(s), tick: TICK, now: null });
    expect(r.newsEntries).toEqual([]);
  });

  it('no substrate ⇒ honest-null (no beat) even with a fresh calamity', () => {
    const s = walledCity();
    s.calamityHistory = [{ type: 'fire', name: 'X', year: 5, tick: TICK, deaths: 200, exodus: 100, k: 1, targets: ['Tannery'] }];
    const ws = { tick: TICK, simulationRules: { spatialConsequenceEnabled: true }, spatialLedgers: {} };
    const r = advanceSpatialConsequence({ snapshot: snapshotOf(s), worldState: ws, tick: TICK, now: null });
    expect(r.newsEntries).toEqual([]);
  });
});

describe('DOOR 1 consumer (c) — covert district diffusion', () => {
  it('a freshly-exposed covert corruption ⇒ a district-diffusion beat', () => {
    const s = walledCity();
    const ws = worldWith(s, { lit: true, exposed: { 's1>patronville': { magnitude01: 0.6, tick: TICK } } });
    const r = advanceSpatialConsequence({ snapshot: snapshotOf(s), worldState: ws, tick: TICK, now: null });
    expect(r.newsEntries.length).toBe(1);
    expect(r.newsEntries[0].tags).toContain('covert_diffusion');
    expect(r.newsEntries[0].summary).toMatch(/quarter/);
  });

  it('a STALE exposure (tick ≠ now) ⇒ no beat', () => {
    const s = walledCity();
    const ws = worldWith(s, { lit: true, exposed: { 's1>patronville': { magnitude01: 0.6, tick: TICK - 10 } } });
    const r = advanceSpatialConsequence({ snapshot: snapshotOf(s), worldState: ws, tick: TICK, now: null });
    expect(r.newsEntries).toEqual([]);
  });
});

describe('DOOR 1 consumer (b) — the fabric scar gains breach precision (additive)', () => {
  // Drive advanceUrbanFabric (urbanFabricEnabled LIT) over a relieved-siege settlement.
  function siegeSnapshot(withBreach) {
    const cause = { source: 's1', effect: 'siege_lifted', reason: 'relieved' };
    if (withBreach) { cause.wallSegmentId = 3; cause.districtId = 'district.shadow_docks'; }
    const settlement = {
      name: 'Ashford', tier: 'city', population: 9000,
      institutions: [{ name: 'Town Hall', required: true, category: 'civic' }],
      powerStructure: { factions: [{ name: 'Guild', isGoverning: true, power: 60 }], publicLegitimacy: { score: 55 } },
      economicState: { prosperity: 'Comfortable' },
      activeConditions: [{ archetype: 'siege_lifted', severity: 0.6, causes: [cause] }],
      calamityHistory: [],
    };
    return { settlement };
  }
  function runFabric(withBreach) {
    const { settlement } = siegeSnapshot(withBreach);
    const worldState = { simulationRules: { urbanFabricEnabled: true }, calendar: { elapsedWeeks: 260, year: 5 }, stressors: [] };
    const snapshot = { settlements: [{ id: 's1', name: 'Ashford', settlement }] };
    const settlementUpdates = [{ saveId: 's1', settlement }];
    const res = advanceUrbanFabric({ snapshot, worldState, settlementUpdates, tick: 260, now: null });
    return res.worldState?.spatialLedgers?.urbanFabric?.s1?.scars?.siege_repairs;
  }

  it('a breach cause ⇒ the siege_repairs scar carries wall segment + district', () => {
    const scar = runFabric(true);
    expect(scar).toBeTruthy();
    expect(scar.seg).toBe(3);
    expect(scar.did).toBe('district.shadow_docks');
  });

  it('NO breach cause ⇒ the scar has NO seg/did (byte-identical to pre-door-1)', () => {
    const scar = runFabric(false);
    expect(scar).toBeTruthy();
    expect('seg' in scar).toBe(false);
    expect('did' in scar).toBe(false);
    // Exactly the legacy shape: sev/tick/week only.
    expect(Object.keys(scar).sort()).toEqual(['sev', 'tick', 'week']);
  });
});
