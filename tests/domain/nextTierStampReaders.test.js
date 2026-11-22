/**
 * nextTierStampReaders.test.js — THE TWO SIBLING READERS OF THE NEXT TIER READ THE STAMP
 * (LANDING-7 lane B, ruling R-B3; X-46 car 2's law).
 *
 * X-46 car 1 gave the owner's roll bands OVERLAP (a hamlet rolls 20–100, a village 75–400, a
 * town 300–2,500) while the tier stamp stays disjoint (`src/data/constants.js ::
 * TIER_STAMP_CUTS`: hamlet 25, village 88, town 350, city 2,250, metropolis 15,000). Car 2's law:
 * a place BECOMES the next tier by the stamp, so a comparison that asks "has this place reached
 * the next tier?" reads the next tier's CUT. A reader of the CURRENT tier's own band minimum (the
 * mint, the demotion floor, a parent's headroom floor) stays on the band, because a town rolled at
 * 300–349 is legitimate.
 *
 * Two readers were left on the band and are re-based here, each pinned through its own door:
 *   1. `settlementLifecycleKernel.js :: advanceSettlementLifecycle`, the in-orbit ladder: thorp →
 *      hamlet promotion, the village charter, and the convergence fold into one hamlet;
 *   2. `demographicsResponses.js :: nextTierHeadroom` and the promotion response's
 *      `at_threshold` lean (lit demographics only).
 *
 * Every arm places a population INSIDE the overlap window (at or above the next tier's roll-band
 * minimum, below its cut) and asserts the window is non-empty, so the arm cannot pass vacuously.
 * Each has a control at the cut that must still cross. Red at `8e568c729` (every overlap arm), green
 * after the re-base.
 */
import { describe, expect, it } from 'vitest';

import { createPRNG } from '../../src/kernel/prng.js';
import { POPULATION_RANGES, TIER_STAMP_CUTS } from '../../src/data/constants.js';
import {
  advanceSettlementLifecycle,
  satellitesOf,
} from '../../src/domain/worldPulse/settlementLifecycleKernel.js';
import {
  RESPONSE_TUNING,
  nextTierHeadroom,
  scoreResponses,
} from '../../src/domain/worldPulse/demographicsResponses.js';

const NOW = '2026-01-01T00:00:00.000Z';

function parent(prosperity) {
  return {
    name: 'Parent', tier: 'city', population: 20000, culture: 'germanic',
    config: { terrainType: 'plains', tradeRouteAccess: 'road', tier: 'city', settType: 'city' },
    economicState: { prosperity },
    powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
    activeConditions: [], populationHistory: [], npcs: [],
  };
}

function steading(id, { tier = 'thorp', population, orbit = 0 }) {
  return {
    id, name: `Stead-${id}`, parentId: 'a', tier, population,
    foundedTick: 100, provenance: 'growth', orbit, inflow: population, backing01: 0.5, history: ['Founded.'],
  };
}

/** Drive the lit lifecycle mover over one parent for `ticks` ticks. */
function drive({ prosperity = 'Prosperous', trade = 0, steadings, ticks = 1 }) {
  const s = parent(prosperity);
  let snapshot = { settlements: [{ id: 'a', name: s.name, settlement: s }] };
  let updates = [{ saveId: 'a', settlement: s }];
  let worldState = {
    tick: 300, simulationRules: { settlementLifecycleEnabled: true },
    spatialLedgers: { satellites: { a: { steadings } } },
  };
  const rng = createPRNG('next-tier-stamp');
  const pIndex = { get: (id, kind) => ({ score: kind === 'trade' ? trade : 0 }) };
  const receipts = [];
  for (let tick = 300; tick < 300 + ticks; tick += 1) {
    const out = advanceSettlementLifecycle({ snapshot, worldState, settlementUpdates: updates, pIndex, rng, tick, now: NOW });
    worldState = { ...out.worldState, tick };
    updates = out.settlementUpdates;
    receipts.push(...out.receipts);
    snapshot = { settlements: updates.map((u) => ({ id: u.saveId, name: u.settlement?.name, settlement: u.settlement })) };
  }
  return { sats: satellitesOf(worldState.spatialLedgers?.satellites || null, 'a'), receipts };
}

describe('the overlap windows exist (non-vacuity)', () => {
  it('each next-tier cut lies above that tier\'s roll-band minimum', () => {
    for (const tier of ['hamlet', 'village', 'town']) {
      expect(TIER_STAMP_CUTS[tier], tier).toBeGreaterThan(POPULATION_RANGES[tier].min);
    }
  });
});

describe('reader 1: the in-orbit ladder (settlementLifecycleKernel) reads the stamp', () => {
  it('a thorp grown into the hamlet roll band but below the hamlet cut stays a thorp', () => {
    const { sats, receipts } = drive({ steadings: { s1: steading('s1', { population: 21 }) } });
    expect(sats[0].population).toBeGreaterThanOrEqual(POPULATION_RANGES.hamlet.min);
    expect(sats[0].population).toBeLessThan(TIER_STAMP_CUTS.hamlet);
    expect(sats[0].tier).toBe('thorp');
    expect(receipts.some((r) => r.kind === 'satellite_promoted')).toBe(false);
  });

  it('control: a thorp at the hamlet cut is promoted', () => {
    const { sats } = drive({ steadings: { s1: steading('s1', { population: TIER_STAMP_CUTS.hamlet }) } });
    expect(sats[0].tier).toBe('hamlet');
  });

  it('a hamlet grown into the village roll band but below the village cut is not charter-pending', () => {
    const { sats, receipts } = drive({ steadings: { s1: steading('s1', { tier: 'hamlet', population: 77 }) } });
    expect(sats[0].population).toBeGreaterThanOrEqual(POPULATION_RANGES.village.min);
    expect(sats[0].population).toBeLessThan(TIER_STAMP_CUTS.village);
    expect(sats[0].charterPending).toBeUndefined();
    expect(receipts.some((r) => r.kind === 'satellite_charter_pending')).toBe(false);
  });

  it('control: a hamlet at the village cut is charter-pending', () => {
    const { sats } = drive({ steadings: { s1: steading('s1', { tier: 'hamlet', population: TIER_STAMP_CUTS.village }) } });
    expect(sats[0].charterPending).toBe(true);
  });

  // The hold band (backing 0.6 x 4/6 + 0.4 x 0 = 0.4: neither grows nor starves), so the pair's
  // sum is fixed and only the convergence draw moves it. Twenty ticks at p = 0.25 per tick.
  it('two thorps whose sum is in the hamlet roll band but below the hamlet cut never fold', () => {
    const steadings = {
      s1: steading('s1', { population: 11, orbit: 0 }),
      s2: steading('s2', { population: 11, orbit: 1 }),
    };
    expect(22).toBeGreaterThanOrEqual(POPULATION_RANGES.hamlet.min);
    expect(22).toBeLessThan(TIER_STAMP_CUTS.hamlet);
    const { sats, receipts } = drive({ prosperity: 'Comfortable', trade: 1, steadings, ticks: 20 });
    expect(sats.length).toBe(2);
    expect(receipts.some((r) => r.kind === 'satellites_converged')).toBe(false);
  });

  it('control: the same pair summing to the hamlet cut folds into one hamlet', () => {
    const steadings = {
      s1: steading('s1', { population: 12, orbit: 0 }),
      s2: steading('s2', { population: TIER_STAMP_CUTS.hamlet - 12, orbit: 1 }),
    };
    const { sats, receipts } = drive({ prosperity: 'Comfortable', trade: 1, steadings, ticks: 20 });
    expect(receipts.some((r) => r.kind === 'satellites_converged')).toBe(true);
    expect(sats.length).toBe(1);
    expect(sats[0].tier).toBe('hamlet');
  });
});

describe('reader 2: earned ascension (demographicsResponses) reads the stamp', () => {
  const readings = (over) => ({
    foodKnown: true, foodFlowRatio: 1.4, foodFlowBand: 'ample', reserveCoverage: 0.5,
    reserveBand: 'stocked', urbanLoadRatio: 1.0, urbanLoadBand: 'packed',
    population: 300, foodCapacity: 2000, densityCeiling: 2000, bound: 2000, binding: 'walls',
    ...over,
  });
  const input = (over) => ({
    readings: readings(over), pressure01: 0.95, tier: 'village', prosperity01: 0.8, connectivity01: 0.8,
    homeostat: { placed: 0, unplaced: 5, considered: 0 },
    ground: { applicable: false, saturated: false, sites: 0 },
    satelliteLaneLit: false, satelliteCap: 0,
  });
  const promotionOf = (scored) => scored.find((s) => s.response === 'promotion');

  it('a food base that covers the town roll-band minimum but not the town cut has no headroom', () => {
    const food = 320;
    expect(food).toBeGreaterThanOrEqual(POPULATION_RANGES.town.min);
    expect(food).toBeLessThan(TIER_STAMP_CUTS.town);
    expect(nextTierHeadroom(readings({ foodCapacity: food }), 'village')).toBe(false);
    expect(promotionOf(scoreResponses(input({ foodCapacity: food }))).refusal).toBe('no_headroom');
  });

  it('control: a food base at the town cut has headroom', () => {
    expect(nextTierHeadroom(readings({ foodCapacity: TIER_STAMP_CUTS.town }), 'village')).toBe(true);
  });

  it('a village at the town roll-band minimum is not yet AT the threshold: the lean ramps to the cut', () => {
    const pop = POPULATION_RANGES.town.min;
    expect(pop).toBeLessThan(TIER_STAMP_CUTS.town);
    const lean = promotionOf(scoreResponses(input({ population: pop })))
      .contributions.find((c) => c.reason === 'at_threshold');
    const expected = (pop / TIER_STAMP_CUTS.town - RESPONSE_TUNING.THRESHOLD_EASE) / (1 - RESPONSE_TUNING.THRESHOLD_EASE);
    expect(lean.reading).toBeLessThan(1);
    expect(lean.reading).toBeCloseTo(expected, 4);
  });

  it('control: a village at the town cut saturates the lean', () => {
    const lean = promotionOf(scoreResponses(input({ population: TIER_STAMP_CUTS.town })))
      .contributions.find((c) => c.reason === 'at_threshold');
    expect(lean.reading).toBe(1);
  });
});
