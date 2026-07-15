/**
 * settlementLifecycleVerbs.test.js — W-LIFECYCLE Stage 3: the FORCE verbs
 * (registrable shape; NOT manifest-registered — the W-COMPOSER-2 lift).
 *
 * THE FORCE ≡ ORGANIC PIN (design §4): every verb resolves through the SAME
 * kernel paths the organic lanes use — mintSteading / buildTerminalDeathOutcome /
 * buildResettleOutcome and the ONE writer — so a forced event is structurally
 * identical to an organic one. The walls HOLD under force: tier caps, parent
 * headroom, willing-settler conservation; a refusal is returned, never a
 * silent swallow or a population mint.
 */
import { describe, expect, it } from 'vitest';

import { createPRNG } from '../../src/kernel/prng.js';
import {
  SETTLEMENT_LIFECYCLE_TUNING,
  mintSteading,
  forceFoundSteading,
  forceFoundSteadingEntry,
} from '../../src/domain/worldPulse/settlementLifecycleKernel.js';
import {
  buildTerminalDeathOutcome,
  forceAbandonSettlement,
  forceResettleSettlement,
  forceAbandonEntry,
  forceResettleEntry,
  applySettlementLifecycleOutcomeToSettlement,
  lifecycleStatusOf,
} from '../../src/domain/worldPulse/settlementLifecycleFirstClass.js';

const T = SETTLEMENT_LIFECYCLE_TUNING;

const town = (over = {}) => ({
  name: 'Ashford', tier: 'town', population: 4800, culture: 'germanic',
  config: { tier: 'town', settType: 'town', tradeRouteAccess: 'road' },
  economicState: { prosperity: 'Prosperous' },
  activeConditions: [], populationHistory: [], npcs: [], institutions: [],
  ...over,
});
const thorp = (over = {}) => ({
  name: 'Dimwell', tier: 'thorp', population: 14, culture: 'germanic',
  config: { tier: 'thorp', settType: 'thorp', peakTier: 'city', nearbyResources: [] },
  economicState: { prosperity: 'Struggling' },
  activeConditions: [], populationHistory: [], npcs: [{ id: 'n1', name: 'Old Wick' }], institutions: [],
  ...over,
});
const forkFn = (seed = 'verbs') => { const r = createPRNG(seed); return r.fork.bind(r); };
const calmPIndex = { get: () => ({ score: 0 }) };

describe('FORCE_FOUND_STEADING (force ≡ organic through the ONE mint)', () => {
  it('a forced founding is structurally identical to an organic mint (same shape, same walls)', () => {
    const parent = town();
    const forced = forceFoundSteading({ parent, parentId: 'a', sats: [], tick: 100, forkFn: forkFn('same') });
    expect('record' in forced).toBe(true);
    const organic = mintSteading({
      parent, parentId: 'a', sats: [], tick: 100,
      draw: (() => { const f = forkFn('same')('satellite:a:100'); return () => f.random(); })(),
      provenance: 'growth',
    });
    expect('record' in organic).toBe(true);
    // Identical record shape and identical seeded draws — only provenance +
    // history prose differ (the decree line).
    const { provenance: fp, history: fh, ...fRest } = forced.record;
    const { provenance: op, history: oh, ...oRest } = organic.record;
    expect(fRest).toEqual(oRest);
    expect(fp).toBe('forced');
    expect(op).toBe('growth');
    expect(forced.debit).toBe(organic.debit);
    expect(forced.receipt.forced).toBe(true);
  });

  it('the freetext name dial is cosmetic; the resource dial stamps resourceKey', () => {
    const out = forceFoundSteading({
      parent: town(), parentId: 'a', sats: [], tick: 100, forkFn: forkFn(),
      name: 'Wyrmditch', resourceKey: 'iron_deposits',
    });
    expect(out.record.name).toBe('Wyrmditch');
    expect(out.record.resourceKey).toBe('iron_deposits');
  });

  it('the walls HOLD under force: tier cap, sub-town parent, and headroom all REFUSE (never silently)', () => {
    const sats = Array.from({ length: T.SATELLITE_CAPS.town }, (_, i) => ({
      id: `s${i}`, name: `S${i}`, parentId: 'a', tier: 'thorp', population: 20,
      foundedTick: 1, provenance: 'growth', orbit: i, inflow: 20, backing01: 0.5, history: [],
    }));
    expect(forceFoundSteading({ parent: town(), parentId: 'a', sats, tick: 100, forkFn: forkFn() }).refusal).toContain('cap');
    expect(forceFoundSteading({ parent: town({ tier: 'village', population: 800 }), parentId: 'a', sats: [], tick: 100, forkFn: forkFn() }).refusal).toContain('town-or-higher');
    expect(forceFoundSteading({ parent: town({ population: 905 }), parentId: 'a', sats: [], tick: 100, forkFn: forkFn() }).refusal).toContain('headroom');
  });
});

describe('FORCE_ABANDON (dwell-bypassing; force ≡ organic through the ONE builder + writer)', () => {
  const item = (s) => ({ id: 'a', name: s.name, settlement: s });
  const snapshot = (s) => ({ settlements: [item(s)], byId: new Map([['a', item(s)]]), regionalGraph: { edges: [] } });

  it('produces the SAME outcome shape as the organic evaluator (probability 1, dwell 0, forced receipt)', () => {
    const s = thorp();
    const forced = forceAbandonSettlement({ item: item(s), snapshot: snapshot(s), pIndex: calmPIndex, tick: 200, spatialActive: true });
    expect(forced.candidateType).toBe('settlement_terminal_death');
    expect(forced.probability).toBe(1);
    expect(forced.metadata.spatialEmigration).toEqual({ loss: 14 });
    expect(forced.metadata.lifecycle.forced).toBe(true);
    // The organic builder with the same inputs yields the same structural core.
    const organic = buildTerminalDeathOutcome({
      item: item(s), snapshot: snapshot(s), pIndex: calmPIndex, tick: 200,
      spatialActive: true, dwell: 0, support: 1, applyMode: 'auto',
    });
    expect(forced.populationDeltas).toEqual(organic.populationDeltas);
    expect(forced.lifecyclePatch).toEqual(organic.lifecyclePatch);
  });

  it('the writer resolves a forced abandonment exactly like an organic death (scarcity + fates hold)', () => {
    const s = thorp();
    const outcome = forceAbandonSettlement({ item: item(s), snapshot: snapshot(s), pIndex: calmPIndex, tick: 200, spatialActive: false });
    const dead = applySettlementLifecycleOutcomeToSettlement(s, outcome);
    expect(lifecycleStatusOf(dead)).toBe('relic_ruin'); // peakTier city — the scarcity law
    expect(dead.population).toBe(0);
    expect(dead.npcs.length).toBe(1);
    expect(dead.npcs[0].dispersed).toBe(true); // fates unresolved, record kept
  });

  it('refuses an above-thorp target and a remnant (the ladder ends where it began)', () => {
    const big = town();
    expect(forceAbandonSettlement({ item: { id: 'a', settlement: big }, snapshot: snapshot(big), pIndex: calmPIndex, tick: 1, spatialActive: false }).refusal).toContain('thorp');
    const remnant = thorp({ lifecycleStatus: 'relic_ruin' });
    expect(forceAbandonSettlement({ item: { id: 'a', settlement: remnant }, snapshot: snapshot(remnant), pIndex: calmPIndex, tick: 1, spatialActive: false }).refusal).toContain('remnant');
  });
});

describe('FORCE_RESETTLE (fallow-bypassing; settlers stay conserved even under force)', () => {
  const remnant = thorp({ population: 0, lifecycleStatus: 'relic_ruin', config: { tier: 'thorp', settType: 'thorp', peakTier: 'city', lifecycleStatus: 'relic_ruin', nearbyResources: [] } });
  const donors = [
    { id: 'b', name: 'Brim', settlement: town({ name: 'Brim' }) },
    { id: 'c', name: 'Crest', settlement: town({ name: 'Crest' }) },
  ];

  it('produces a conserved outcome (Σ deltas === 0) with the freetext name dial honored', () => {
    const out = forceResettleSettlement({
      item: { id: 'a', name: 'Dimwell', settlement: remnant }, donorPool: donors,
      tick: 300, forkFn: forkFn(), name: 'Thornhollow',
    });
    expect(out.candidateType).toBe('settlement_resettled');
    expect(out.probability).toBe(1);
    expect(out.lifecyclePatch.name).toBe('Thornhollow');
    expect(out.populationDeltas.reduce((s, d) => s + d.delta, 0)).toBe(0);
  });

  it('REFUSES with no willing settlers — force never mints people', () => {
    const out = forceResettleSettlement({
      item: { id: 'a', name: 'Dimwell', settlement: remnant }, donorPool: [],
      tick: 300, forkFn: forkFn(),
    });
    expect(out.refusal).toContain('settlers');
  });

  it('refuses a living site', () => {
    const alive = thorp();
    expect(forceResettleSettlement({
      item: { id: 'a', settlement: alive }, donorPool: donors, tick: 300, forkFn: forkFn(),
    }).refusal).toContain('alive');
  });
});

describe('the affordance-manifest entry factories (registrable shape, NOT registered — W-COMPOSER-2)', () => {
  it('each entry mirrors the forceCalamityEntry factory shape', () => {
    for (const [entry, type] of [
      [forceFoundSteadingEntry(), 'FORCE_FOUND_STEADING'],
      [forceAbandonEntry(), 'FORCE_ABANDON'],
      [forceResettleEntry(), 'FORCE_RESETTLE'],
    ]) {
      expect(entry.type).toBe(type);
      expect(entry.scope).toBe('settlement');
      expect(entry.authority).toBe('dm_direct');
      expect(Array.isArray(entry.dials)).toBe(true);
      expect(typeof entry.predicate).toBe('function');
      expect(entry.predicate().available).toBe(true);
      expect(Object.isFrozen(entry)).toBe(true);
    }
  });

  it('the verbs are NOT in the affordance manifest (the W-COMPOSER-2 park holds)', async () => {
    const manifest = await import('../../src/domain/events/affordanceManifest.js');
    const json = JSON.stringify(Object.keys(manifest.AFFORDANCE_MANIFEST || manifest.default || {}));
    for (const t of ['FORCE_FOUND_STEADING', 'FORCE_ABANDON', 'FORCE_RESETTLE']) {
      expect(json.includes(t)).toBe(false);
    }
  });
});
