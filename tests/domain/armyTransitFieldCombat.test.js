/**
 * armyTransitFieldCombat.test.js — Phase 5.5 mover wave M5: ARMY-TRANSIT + FIELD
 * COMBAT (the war convergence). Pins the pure engine (position, the clamped field-
 * battle sigmoid, collisions + the O(armies²) bound, the courier umbilical, retreat
 * routing), the SIEGE-AS-STARVATION replacement (spatial resolves by supply+time+
 * relief; aspatial byte-identical), the army rumor carrier, the kernel adapter, and
 * the two soaks (the war-distribution/homeostasis re-run + a 30y border war that ENDS
 * endogenously). Everything is DETERMINISTIC — a failure means a real constant moved.
 */

import { describe, it, expect } from 'vitest';

import {
  ARMY_TRANSIT_TUNING, ARMY_ROLES,
  armyTransitActive, armyMarchWeeks, armyRecordOf, stepArmyPosition, hasArrived,
  currentRegion, remainingRegions, effectiveFieldStrength, fieldBattleWinProbability,
  resolveFieldBattle, assertArmyBound, detectCollisions, retreatRoute, planMarch,
  stepBeliefStaleness, umbilicalFog, staleAssessment, armyTransitLedger,
} from '../../src/domain/spatial/armyTransit.js';
import { advanceArmyTransit } from '../../src/domain/worldPulse/armyTransitKernel.js';
import { resolveSiegeVerdict, evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { armyPathNeighbourMap, RUMOR_CARRIER_ARMY } from '../../src/domain/spatial/rumorNetwork.js';
import { setSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { createPRNG } from '../../src/kernel/prng.js';

const T = ARMY_TRANSIT_TUNING;

// ── A minimal hand digest: a line  atlas — marka — borin (both directions). Two
//    armies marching toward each other cross at marka. ──────────────────────────
function lineDigest() {
  return {
    spatialCanonVersion: 1,
    settlementIds: ['atlas', 'marka', 'borin'],
    gates: [
      { between: ['atlas', 'marka'], cost: 100 },
      { between: ['marka', 'borin'], cost: 100 },
    ],
    distanceMatrix: {
      atlas: { marka: 100, borin: 200 },
      marka: { atlas: 100, borin: 100 },
      borin: { marka: 100, atlas: 200 },
    },
    tiers: {
      atlas: { marka: 1, borin: 1 },
      marka: { atlas: 1, borin: 1 },
      borin: { marka: 1, atlas: 1 },
    },
  };
}

const worldWith = (extra = {}) => ({ spatialCanonVersion: 1, ...extra });

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — DORMANCY: no marker ⇒ no-op, byte-identical', () => {
  it('armyTransitActive is false without the spatial-canon marker', () => {
    expect(armyTransitActive({})).toBe(false);
    expect(armyTransitActive({ spatialCanonVersion: 0 })).toBe(false);
    expect(armyTransitActive(null)).toBe(false);
    expect(armyTransitActive(worldWith())).toBe(true);
  });

  it('advanceArmyTransit is a no-op off the marker (no ledger key, byte-identical)', () => {
    const ws = { deployments: { atlas: { targetId: 'borin', sinceTick: 0, currentEffectiveStrength: 50 } } };
    const out = advanceArmyTransit({ snapshot: {}, worldState: ws, digest: lineDigest(), graph: {}, rng: createPRNG('x'), tick: 1 });
    expect(out.changed).toBe(false);
    expect(out.worldState).toBe(ws);
    expect(out.newsEntries).toEqual([]);
    expect('spatialLedgers' in out.worldState).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — army speed: slower than a courier, readiness modulates, bounded', () => {
  it('an army marches SLOWER than the courier hop time (ARMY_SPEED_FACTOR > 1)', () => {
    expect(armyMarchWeeks(4, 0.5)).toBeGreaterThan(4);
  });
  it('a drilled (high-readiness) army marches faster than a rusty levy', () => {
    expect(armyMarchWeeks(10, 0.9)).toBeLessThan(armyMarchWeeks(10, 0.1));
  });
  it('is floored ≥ 1 for a distinct hop and 0 for a zero base; capped at MAX_MARCH_WEEKS', () => {
    expect(armyMarchWeeks(0, 0.5)).toBe(0);
    expect(armyMarchWeeks(0.001, 0.5)).toBeGreaterThanOrEqual(1);
    expect(armyMarchWeeks(1e6, 0.5)).toBe(T.MAX_MARCH_WEEKS);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — position stepping along the path', () => {
  const rec = () => armyRecordOf({ armyId: 'atlas', originId: 'atlas', destId: 'borin', path: ['atlas', 'marka', 'borin'], departTick: 0, arrivalTick: 4, strength: 50 });

  it('position advances linearly and saturates at 1 on arrival', () => {
    expect(stepArmyPosition(rec(), 0).position01).toBe(0);
    expect(stepArmyPosition(rec(), 2).position01).toBe(0.5);
    expect(stepArmyPosition(rec(), 4).position01).toBe(1);
    expect(stepArmyPosition(rec(), 9).position01).toBe(1);
    expect(hasArrived(stepArmyPosition(rec(), 4), 4)).toBe(true);
    expect(hasArrived(stepArmyPosition(rec(), 3), 3)).toBe(false);
  });

  it('currentRegion + remainingRegions track the column down its path', () => {
    expect(currentRegion(stepArmyPosition(rec(), 0))).toBe('atlas');
    expect(currentRegion(stepArmyPosition(rec(), 2))).toBe('marka');
    expect(currentRegion(stepArmyPosition(rec(), 4))).toBe('borin');
    expect([...remainingRegions(stepArmyPosition(rec(), 0))].sort()).toEqual(['atlas', 'borin', 'marka']);
    expect(remainingRegions(stepArmyPosition(rec(), 2)).has('borin')).toBe(true);
    expect(remainingRegions(stepArmyPosition(rec(), 2)).has('atlas')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — effective field strength: fatigue, defender ground, quality', () => {
  const base = { armyId: 'a', size: 100 };
  it('travel fatigue REDUCES effective strength; defender ground RAISES it', () => {
    const fresh = effectiveFieldStrength({ ...base, fatigue01: 0 });
    const tired = effectiveFieldStrength({ ...base, fatigue01: 1 });
    expect(tired).toBeLessThan(fresh);
    const openField = effectiveFieldStrength({ ...base, groundAdvantage01: 0 });
    const homeGround = effectiveFieldStrength({ ...base, groundAdvantage01: 1 });
    expect(homeGround).toBeGreaterThan(openField);
    expect(homeGround / openField).toBeCloseTo(1 + T.GROUND_ADVANTAGE, 6);
  });
  it('readiness / supplyQuality / funding each scale strength (a degraded army fights weaker, never zero)', () => {
    const strong = effectiveFieldStrength({ ...base, readiness: 1, supplyQuality: 1, funding: 1 });
    const weak = effectiveFieldStrength({ ...base, readiness: 0, supplyQuality: 0, funding: 0 });
    expect(weak).toBeLessThan(strong);
    expect(weak).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — the field-battle sigmoid + the no-hand-of-miracle CLAMP', () => {
  it('P(upset) BEYOND the clamp threshold is EXACTLY 0 (a CLAMP_RATIO:1 force cannot lose)', () => {
    expect(fieldBattleWinProbability(300, 100)).toBe(1);   // 3:1 → certain
    expect(fieldBattleWinProbability(100, 300)).toBe(0);   // 1:3 → hopeless
    expect(fieldBattleWinProbability(1000, 10)).toBe(1);   // 100:1 → no lucky roll
    expect(fieldBattleWinProbability(10, 1000)).toBe(0);
  });
  it('is a MONOTONIC sigmoid inside the band (three-point monotonicity)', () => {
    const p1 = fieldBattleWinProbability(90, 110);
    const p2 = fieldBattleWinProbability(100, 100);
    const p3 = fieldBattleWinProbability(110, 90);
    expect(p1).toBeLessThan(p2);
    expect(p2).toBeLessThan(p3);
    expect(p2).toBeCloseTo(0.5, 6); // an even matchup is a coin flip
  });
  it('two equal armies (both zero) read 0.5; a lone army wins for free', () => {
    expect(fieldBattleWinProbability(0, 0)).toBe(0.5);
    expect(fieldBattleWinProbability(50, 0)).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — resolveFieldBattle: seeded, bounded, aggregate-only', () => {
  const a = { armyId: 'atlas', size: 120, readiness: 0.7 };
  const b = { armyId: 'borin', size: 60, readiness: 0.5 };

  it('forks the stable composite battle key and is deterministic given the seed', () => {
    const r1 = resolveFieldBattle({ a, b, rng: createPRNG('seed'), tick: 5 });
    const r2 = resolveFieldBattle({ a, b, rng: createPRNG('seed'), tick: 5 });
    expect(r1).toEqual(r2);
    // pair-sorted key ⇒ order-independent winner attribution
    const swapped = resolveFieldBattle({ a: b, b: a, rng: createPRNG('seed'), tick: 5 });
    expect(swapped.roll).toBe(r1.roll);
  });

  it('the loser is MAULED but never annihilated (a floor survives to retreat)', () => {
    const r = resolveFieldBattle({ a, b, rng: createPRNG('seed'), tick: 5 });
    const loserBefore = r.loserId === 'atlas' ? a.size : b.size;
    const loserAfter = r.strengthDelta[r.loserId];
    expect(loserAfter).toBeLessThan(loserBefore);
    expect(loserAfter).toBeGreaterThanOrEqual(loserBefore * (1 - T.LOSER_MAX_LOSS));
    // the winner pays a smaller price than the loser
    const winnerAfter = r.strengthDelta[r.winnerId];
    const winnerBefore = r.winnerId === 'atlas' ? a.size : b.size;
    expect(winnerBefore - winnerAfter).toBeLessThan(loserBefore - loserAfter);
  });

  it('a clamped (decisive) matchup is deterministic (winner fixed regardless of roll)', () => {
    const strong = { armyId: 'atlas', size: 500 };
    const weak = { armyId: 'borin', size: 50 };
    const r = resolveFieldBattle({ a: strong, b: weak, rng: createPRNG('any'), tick: 1 });
    expect(r.clamped).toBe(true);
    expect(r.winnerId).toBe('atlas');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — collision detection: crossing paths, hostility, the O(armies²) bound', () => {
  const records = {
    atlas: armyRecordOf({ armyId: 'atlas', originId: 'atlas', destId: 'borin', path: ['atlas', 'marka', 'borin'], departTick: 0, arrivalTick: 4, position01: 0.4, strength: 100 }),
    borin: armyRecordOf({ armyId: 'borin', originId: 'borin', destId: 'atlas', path: ['borin', 'marka', 'atlas'], departTick: 0, arrivalTick: 4, position01: 0.4, strength: 80 }),
  };
  const mutual = (x, y) => records[x].destId === records[y].originId || records[y].destId === records[x].originId;

  it('two hostile armies on crossing paths collide at the shared region', () => {
    const cols = detectCollisions(records, mutual);
    expect(cols.length).toBe(1);
    expect(cols[0]).toMatchObject({ aId: 'atlas', bId: 'borin' });
    expect(['marka', 'atlas', 'borin']).toContain(cols[0].region);
  });
  it('a FRIENDLY pair never collides (the predicate gates it)', () => {
    expect(detectCollisions(records, () => false)).toEqual([]);
  });
  it('an ARRIVED army (position ≥ 1) is at the walls, not in the open — no collision', () => {
    const arrived = { ...records, borin: { ...records.borin, position01: 1 } };
    expect(detectCollisions(arrived, mutual)).toEqual([]);
  });
  it('assertArmyBound holds for few armies and pins the O(armies²) ceiling', () => {
    expect(assertArmyBound(2)).toBe(true);
    expect(assertArmyBound(T.MAX_ARMIES)).toBe(true);
    expect(assertArmyBound(T.MAX_ARMIES + 1)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — retreat routes by the M1 danger re-score', () => {
  it('a retreating army re-routes home, avoiding an embattled intermediary', () => {
    const digest = lineDigest();
    // Make marka maximally embattled: the danger re-score should still return a route
    // home (the line has only one path), but the effectiveCost reflects the danger.
    const ws = setSpatialLedger(worldWith(), 'embattlement', { marka: { level: 1, phase: 'embattled', sinceTick: 0, lastTick: 0 } });
    const safe = retreatRoute(digest, worldWith(), 'borin', 'atlas', { lawfulness01: 1 });
    const danger = retreatRoute(digest, ws, 'borin', 'atlas', { lawfulness01: 1 });
    expect(safe).toBeTruthy();
    expect(danger).toBeTruthy();
    expect(danger.effectiveCost).toBeGreaterThan(safe.effectiveCost); // danger raises the cost
    expect(danger.path[danger.path.length - 1]).toBe('atlas'); // still reaches home
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — the courier umbilical (belief-staleness fog)', () => {
  it('staleness GROWS while the route home is cut and RESETS on reconnection', () => {
    let s = 0;
    s = stepBeliefStaleness(s, true, true); // cut, active
    expect(s).toBe(1);
    s = stepBeliefStaleness(s, true, true);
    expect(s).toBe(2);
    s = stepBeliefStaleness(s, false, true); // reconnected
    expect(s).toBe(0);
  });

  it('is ABSENT under an omniscient world (umbilical INACTIVE ⇒ staleness pinned 0)', () => {
    expect(stepBeliefStaleness(5, true, false)).toBe(0);
    expect(stepBeliefStaleness(0, true, false)).toBe(0);
  });

  it('fog grows with staleness (bounded) and blends a read from truth toward stale', () => {
    expect(umbilicalFog(0)).toBe(0);
    expect(umbilicalFog(T.UMBILICAL_STALE_SATURATION)).toBeCloseTo(T.UMBILICAL_MAX_DRIFT, 6);
    expect(umbilicalFog(1e6)).toBeCloseTo(T.UMBILICAL_MAX_DRIFT, 6); // saturates
    // fog 0 ⇒ truth verbatim; fog>0 ⇒ drifts toward the stale value
    expect(staleAssessment(100, 40, 0)).toBe(100);
    const foggy = staleAssessment(100, 40, T.UMBILICAL_STALE_SATURATION);
    expect(foggy).toBeLessThan(100);
    expect(foggy).toBeGreaterThan(40);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — SIEGE-AS-STARVATION: spatial by supply+time+relief; aspatial byte-identical', () => {
  const baseArgs = (extra = {}) => ({
    targetId: 'c',
    besiegers: ['x'],
    capacityFor: (id) => (id === 'c'
      ? { offensive: 40, homeDefense: 40, facets: {} }
      : { offensive: 55, homeDefense: 55, facets: {} }),
    effectiveStrengthFor: () => null,
    defenderItem: { name: 'C' },
    rng: createPRNG('siege'),
    tick: 3,
    siegeAge: 6,
    ...extra,
  });

  it('ASPATIAL (spatialSiege default false) is BYTE-IDENTICAL to the pre-M5 capacity roll', () => {
    const a = resolveSiegeVerdict(baseArgs());
    const b = resolveSiegeVerdict({ ...baseArgs(), spatialSiege: false });
    const c = resolveSiegeVerdict({ ...baseArgs(), supplyInterdiction: 0 });
    expect(a.pFall).toBe(b.pFall);
    expect(a.pFall).toBe(c.pFall);
    expect(a.falls).toBe(b.falls);
  });

  it('SPATIAL: NO interdiction ⇒ the town HOLDS (you must cut the roads to starve it)', () => {
    const fed = resolveSiegeVerdict({ ...baseArgs(), spatialSiege: true, supplyInterdiction: 0 });
    expect(fed.pFall).toBeLessThan(0.1);
    expect(fed.falls).toBe(false);
  });

  it('SPATIAL: a starved town falls MORE as interdiction and TIME grow (starvation core)', () => {
    const early = resolveSiegeVerdict({ ...baseArgs(), spatialSiege: true, supplyInterdiction: 1, siegeAge: 1 });
    const late = resolveSiegeVerdict({ ...baseArgs(), spatialSiege: true, supplyInterdiction: 1, siegeAge: 12 });
    expect(late.pFall).toBeGreaterThan(early.pFall); // time compounds starvation
    const halfStarved = resolveSiegeVerdict({ ...baseArgs(), spatialSiege: true, supplyInterdiction: 0.4, siegeAge: 12 });
    expect(late.pFall).toBeGreaterThan(halfStarved.pFall); // more interdiction, faster fall
  });

  it('SPATIAL: RELIEF pushes back toward holding (an allied relief bonus lowers pFall)', () => {
    const starved = resolveSiegeVerdict({ ...baseArgs(), spatialSiege: true, supplyInterdiction: 1, siegeAge: 12, defenderReliefBonus: 0 });
    const relieved = resolveSiegeVerdict({ ...baseArgs(), spatialSiege: true, supplyInterdiction: 1, siegeAge: 12, defenderReliefBonus: 30 });
    expect(relieved.pFall).toBeLessThan(starved.pFall);
  });

  it('SPATIAL: the feasibility gate + outcome bands still govern (anti-snowball envelope)', () => {
    // A hopeless attacker (thorpe vs city) is auto-filtered BEFORE the starvation roll.
    const hopeless = resolveSiegeVerdict({
      ...baseArgs(),
      spatialSiege: true, supplyInterdiction: 1, siegeAge: 12,
      capacityFor: (id) => (id === 'c' ? { offensive: 95, homeDefense: 95, facets: {} } : { offensive: 3, homeDefense: 3, facets: {} }),
    });
    expect(hopeless.falls).toBe(false); // feasibility gate, not the starvation core
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — the army rumor carrier (round 9)', () => {
  it('armyPathNeighbourMap links each path node to its route neighbours (both ways)', () => {
    const map = armyPathNeighbourMap([['atlas', 'marka', 'borin']]);
    expect(map.get('atlas').map((n) => n.neighbourId)).toEqual(['marka']);
    expect(map.get('marka').map((n) => n.neighbourId).sort()).toEqual(['atlas', 'borin']);
    expect(map.get('borin').map((n) => n.neighbourId)).toEqual(['marka']);
    // edge ids are codepoint-stable + shared both directions
    expect(map.get('atlas')[0].edgeId).toBe('army.atlas.marka');
    expect(map.get('marka').find((n) => n.neighbourId === 'atlas').edgeId).toBe('army.atlas.marka');
  });
  it('is EMPTY (dormant) when no army paths are supplied — the army lane is off', () => {
    expect(armyPathNeighbourMap(null).size).toBe(0);
    expect(armyPathNeighbourMap([]).size).toBe(0);
    expect(RUMOR_CARRIER_ARMY).toBe('army');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — the kernel adapter: derive, advance, collide, persist', () => {
  const snapshot = {
    byId: { get: (id) => ({ id, name: String(id), causal: { scores: { economic_capacity: 60 } } }) },
    settlements: [{ id: 'atlas' }, { id: 'borin' }],
  };
  const worldState = () => worldWith({
    simulationRules: { warLayerEnabled: true, infoMode: 'omniscient' },
    deployments: {
      atlas: { targetId: 'borin', sinceTick: 0, currentEffectiveStrength: 120, readiness: 0.7 },
      borin: { targetId: 'atlas', sinceTick: 0, currentEffectiveStrength: 60, readiness: 0.5 },
    },
  });

  it('derives one transit record per deployment (cardinality: never per-soldier)', () => {
    const out = advanceArmyTransit({ snapshot, worldState: worldState(), digest: lineDigest(), graph: {}, rng: createPRNG('k'), tick: 1 });
    expect(out.changed).toBe(true);
    const ledger = armyTransitLedger(out.worldState);
    expect(Object.keys(ledger).sort()).toEqual(['atlas', 'borin']);
    expect(ledger.atlas.role).toBe(ARMY_ROLES.MARCH); // a fresh campaign seeds a march
    expect(ledger.atlas.originId).toBe('atlas');
    expect(ledger.atlas.destId).toBe('borin');
    // ONGOING (a prior record exists, still mid-route) ⇒ re-roled a reinforcement column.
    const out2 = advanceArmyTransit({ snapshot, worldState: out.worldState, digest: lineDigest(), graph: {}, rng: createPRNG('k'), tick: 2 });
    expect(armyTransitLedger(out2.worldState).atlas.role).toBe(ARMY_ROLES.REINFORCEMENT);
  });

  it('two crossing armies fight a FIELD BATTLE — the loser is mauled + written back weaker', () => {
    // Tick 0: seed both marches at position 0. Tick 1: they are mid-route → collide.
    let ws = worldState();
    let out = advanceArmyTransit({ snapshot, worldState: ws, digest: lineDigest(), graph: {}, rng: createPRNG('k'), tick: 0 });
    ws = out.worldState;
    out = advanceArmyTransit({ snapshot, worldState: ws, digest: lineDigest(), graph: {}, rng: createPRNG('k'), tick: 1 });
    expect(out.newsEntries.length).toBe(1);
    expect(out.newsEntries[0].impactKind).toBe('field_battle');
    // the deployment write-back: the weaker army (borin) loses strength
    const dep = out.worldState.deployments;
    expect(dep.borin.currentEffectiveStrength).toBeLessThan(60);
  });

  it('is deterministic: two identical runs produce identical ledgers + news', () => {
    const run = () => {
      let ws = worldState();
      let o = advanceArmyTransit({ snapshot, worldState: ws, digest: lineDigest(), graph: {}, rng: createPRNG('det'), tick: 0 });
      ws = o.worldState;
      return advanceArmyTransit({ snapshot, worldState: ws, digest: lineDigest(), graph: {}, rng: createPRNG('det'), tick: 1 });
    };
    const a = run();
    const b = run();
    expect(JSON.stringify(a.worldState.spatialLedgers)).toBe(JSON.stringify(b.worldState.spatialLedgers));
    expect(JSON.stringify(a.newsEntries)).toBe(JSON.stringify(b.newsEntries));
  });

  it('the courier umbilical grows staleness when the home is besieged (route home cut)', () => {
    const graphCut = { channels: [{ type: 'war_front', status: 'confirmed', from: 'borin', to: 'atlas' }] };
    // infoMode unreliable ⇒ umbilical ACTIVE; atlas's home (atlas) is besieged by borin.
    let ws = worldWith({
      simulationRules: { warLayerEnabled: true, infoMode: 'unreliable' },
      deployments: { atlas: { targetId: 'borin', sinceTick: 0, currentEffectiveStrength: 100, readiness: 0.6 } },
    });
    let out = advanceArmyTransit({ snapshot, worldState: ws, digest: lineDigest(), graph: graphCut, rng: createPRNG('u'), tick: 0 });
    out = advanceArmyTransit({ snapshot, worldState: out.worldState, digest: lineDigest(), graph: graphCut, rng: createPRNG('u'), tick: 1 });
    expect(armyTransitLedger(out.worldState).atlas.beliefStaleness).toBeGreaterThan(0);
  });

  it('under OMNISCIENT the umbilical never accrues staleness (no fog)', () => {
    const graphCut = { channels: [{ type: 'war_front', status: 'confirmed', from: 'borin', to: 'atlas' }] };
    let ws = worldWith({
      simulationRules: { warLayerEnabled: true, infoMode: 'omniscient' },
      deployments: { atlas: { targetId: 'borin', sinceTick: 0, currentEffectiveStrength: 100, readiness: 0.6 } },
    });
    let out = advanceArmyTransit({ snapshot, worldState: ws, digest: lineDigest(), graph: graphCut, rng: createPRNG('u'), tick: 0 });
    out = advanceArmyTransit({ snapshot, worldState: out.worldState, digest: lineDigest(), graph: graphCut, rng: createPRNG('u'), tick: 5 });
    expect(armyTransitLedger(out.worldState).atlas.beliefStaleness).toBe(0);
  });

  it('planMarch returns null for an unreachable pair (no transit; war layer still runs)', () => {
    expect(planMarch(lineDigest(), worldWith(), 'atlas', 'nowhere', 0.5, null, 0)).toBe(null);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — SOAK A: the 30-year two-power border war ENDS endogenously', () => {
  it('a mutual siege under the spatial marker terminates within a bounded window (cite the cause)', () => {
    // A two-power border war: both besiege each other under the spatial marker
    // (spatialSiege ON ⇒ siege-as-starvation), both supply-cut (interdiction 1). The
    // exhaustion homeostasis + starvation must END it — never a forever-war.
    const capacityFor = (id) => ({ offensive: 50, homeDefense: 50, facets: { will: 40, logistics: 30 } });
    const starvedLedger = {
      'atlas:smithy:iron': { settlementId: 'atlas', starving: true, institutionId: 'smithy', input: 'iron', sourceId: '', arrivalTick: -1 },
      'borin:smithy:iron': { settlementId: 'borin', starving: true, institutionId: 'smithy', input: 'iron', sourceId: '', arrivalTick: -1 },
    };
    let ended = null;
    for (let siegeAge = 0; siegeAge <= 30 * 4; siegeAge += 1) {
      // Drive the siege verdict for atlas-besieging-borin at the growing age.
      const ws = worldWith({ spatialLedgers: { supplyShipments: starvedLedger } });
      const v = resolveSiegeVerdict({
        targetId: 'borin', besiegers: ['atlas'], capacityFor, effectiveStrengthFor: () => null,
        defenderItem: { name: 'Borin' }, rng: createPRNG('border'), tick: siegeAge, siegeAge,
        supplyInterdiction: 1, spatialSiege: true, defenderResolveEnabled: true,
      });
      if (v.falls || v.forcedLift || v.capitulation) { ended = { siegeAge, band: v.band, capitulation: !!v.capitulation, falls: v.falls }; break; }
    }
    expect(ended).toBeTruthy();               // it ENDED — never a forever-war
    expect(ended.siegeAge).toBeLessThan(30 * 4); // well inside 30 years
    // The ending cause is a STARVATION fall or a will capitulation (both endogenous).
    expect(ended.falls || ended.capitulation).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('M5 — SOAK B: the war-distribution/homeostasis envelope holds WITH armies-in-transit', () => {
  const NOW = '2026-01-01T00:00:00.000Z';
  function settlement(name, conditions = []) {
    return {
      name, tier: 'city', population: 45000,
      config: { tradeRouteAccess: 'road' }, institutions: [],
      economicState: { prosperity: 'Prosperous' },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [
          { faction: 'Military Council', category: 'military', power: 78, isGoverning: true },
          { faction: 'Merchant League', category: 'economy', power: 52 },
        ],
      },
      npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
      activeConditions: conditions,
    };
  }
  function save(id, name, conditions = []) {
    return { id, name, phase: 'canon', settlement: settlement(name, conditions), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
  }
  const CHANNELS = [
    { type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' },
    { type: 'war_front', from: 'borin', to: 'atlas', status: 'confirmed' },
  ];

  it('a full two-power border war (marker ON, armies marching + colliding) ENDS endogenously', () => {
    const starvedLedger = {
      'atlas:smithy:iron': { settlementId: 'atlas', starving: true, institutionId: 'smithy', input: 'iron', sourceId: '', arrivalTick: -1 },
      'borin:smithy:iron': { settlementId: 'borin', starving: true, institutionId: 'smithy', input: 'iron', sourceId: '', arrivalTick: -1 },
    };
    let worldState = {
      rngSeed: 'border', tick: 1,
      spatialCanonVersion: 1, spatialDigest: lineDigest(),
      spatialLedgers: { supplyShipments: starvedLedger },
      relationshipStates: { 'e.a.b': { relationshipType: 'hostile' } },
      deployments: { atlas: { targetId: 'borin', sinceTick: 1, role: 'siege' }, borin: { targetId: 'atlas', sinceTick: 1, role: 'siege' } },
      warExhaustion: {}, simulationRules: { warLayerEnabled: true, infoMode: 'omniscient' },
    };
    let conditions = { atlas: [], borin: [] };
    let ended = null;
    let sawTransit = false;
    for (let tick = 1; tick <= 40; tick += 1) {
      const saves = [save('atlas', 'Atlas', conditions.atlas), save('borin', 'Borin', conditions.borin)];
      const campaign = {
        id: 'soakB', settlementIds: ['atlas', 'borin'], worldState,
        regionalGraph: ensureRegionalGraph({ edges: [{ id: 'e.a.b', from: 'atlas', to: 'borin', relationshipType: 'hostile' }], channels: CHANNELS }),
        wizardNews: { currentTick: tick, entries: [] },
      };
      const snap = buildWorldSnapshot({ campaign, saves, worldState });
      const war = evaluateWarLayer({ snapshot: snap, worldState, rng: createPRNG('border').fork('war-layer'), tick, now: NOW, rules: { warLayerEnabled: true } });
      worldState = { ...worldState, deployments: war.deployments, warExhaustion: war.warExhaustion };
      // Advance the army-transit layer — armies march + can collide in the open.
      const transit = advanceArmyTransit({ snapshot: snap, worldState, digest: worldState.spatialDigest, graph: snap.regionalGraph, rng: createPRNG('border').fork('army-transit'), tick, now: NOW });
      worldState = transit.worldState;
      if (armyTransitLedger(worldState)) sawTransit = true;
      const conquest = war.outcomes.find((o) => o.candidateType === 'conquest');
      const applyConds = (homeId) => war.outcomes.filter((o) => String(o.targetSaveId) === homeId && o.condition).map((o) => ({ archetype: o.condition.archetype, severity: o.condition.severity, status: 'worsening' }));
      conditions = { atlas: applyConds('atlas'), borin: applyConds('borin') };
      if (conquest) { ended = { tick, cause: 'conquest' }; break; }
      if (!worldState.deployments.atlas && !worldState.deployments.borin) { ended = { tick, cause: 'mutual-withdrawal' }; break; }
    }
    // The homeostasis envelope HELD with M5 active: the war ended within the band, and
    // armies-in-transit were genuinely exercised (a transit ledger materialized).
    expect(ended).toBeTruthy();
    expect(ended.tick).toBeLessThan(40);
    expect(['conquest', 'mutual-withdrawal']).toContain(ended.cause);
    expect(sawTransit).toBe(true);
  });
});
