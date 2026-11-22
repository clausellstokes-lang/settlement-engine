/**
 * entrepots.test.js — Phase 5.5 mover M6b: ENTREPÔTS / TOLLS.
 *
 * The wave's pure-engine proof. Gates pinned here:
 *   - EARNED CENTRALITY from REAL gate-crossings, NOT digest geometry (a geometric hub
 *     with no shipments earns nothing; a shipment's endpoints earn nothing);
 *   - the TOLL joins the M1 re-score → a GREEDY toll DIVERTS a shipment to a cheaper
 *     detour (the before/after reroute proof), the self-balancing brake;
 *   - the FOUR co-built brakes: throughput ceiling, toll upkeep, wartime targeting, rent cap;
 *   - DORMANT byte-identity (marker/opt-in absent ⇒ no ledger, tollRateOf 0, the M1
 *     re-score byte-identical, rampThreat byte-identical);
 *   - the sustained-centrality clock (the transshipment-institution unlock precondition).
 */
import { describe, it, expect } from 'vitest';
import {
  ENTREPOT_TUNING, TRANSSHIPMENT_INSTITUTIONS,
  entrepotActive, tollFromCentrality, tollProsperityOf, tollProsperityFor,
  entrepotTargetPremium, isSustainedEntrepot, countCrossings, stepEntrepot,
  advanceEntrepots, centralityGini,
} from '../../src/domain/spatial/entrepots.js';
import {
  scoreRoute, chooseRoute, rampThreat, tollRateOf, EMBATTLEMENT_TUNING,
} from '../../src/domain/spatial/embattlement.js';

const T = ENTREPOT_TUNING;

/** A DIAMOND: P→C either via the cheap hub M (P-M-C = 200) or the longer detour X
 *  (P-X-C = 260). A toll on M can divert the P→C shipment onto X. All hops tier-1
 *  cost 100/130 ⇒ medianPrimaryHopCost = 100. */
function diamondDigest() {
  return {
    spatialCanonVersion: 1,
    settlementIds: ['P', 'M', 'X', 'C'],
    gates: [
      { between: ['P', 'M'], cost: 100 }, { between: ['M', 'C'], cost: 100 },
      { between: ['P', 'X'], cost: 130 }, { between: ['X', 'C'], cost: 130 },
    ],
    distanceMatrix: {
      P: { M: 100, X: 130 }, M: { P: 100, C: 100 },
      X: { P: 130, C: 130 }, C: { M: 100, X: 130 },
    },
    tiers: {
      P: { M: 1, X: 1 }, M: { P: 1, C: 1 },
      X: { P: 1, C: 1 }, C: { M: 1, X: 1 },
    },
  };
}

const worldOn = (extra = {}) => ({ spatialCanonVersion: 1, simulationRules: { commodityFlowEnabled: true }, ...extra });
const withEntrepots = (ledger, extra = {}) => worldOn({ spatialLedgers: { entrepots: ledger }, ...extra });

describe('M6b — the activation gate (the SAME double gate as the commodity layer)', () => {
  it('is LIVE only under the marker AND the commodity-flow opt-in (no second flag)', () => {
    expect(entrepotActive(null)).toBe(false);
    expect(entrepotActive({})).toBe(false);
    expect(entrepotActive({ spatialCanonVersion: 1 })).toBe(false);                       // marker, no opt-in
    expect(entrepotActive({ simulationRules: { commodityFlowEnabled: true } })).toBe(false); // opt-in, no marker
    expect(entrepotActive(worldOn())).toBe(true);
  });
});

describe('M6b — EARNED centrality from real gate-crossings (NOT digest geometry)', () => {
  const digest = diamondDigest();

  it('a geometric hub with NO shipments earns ZERO (no ledger materializes)', () => {
    // M is on the shortest P→C path (the geometric hub), but with no active shipments
    // it earns nothing — centrality is EARNED, not conferred by geometry.
    const out = advanceEntrepots({ shipments: [], digest, worldState: worldOn(), tick: 1 });
    expect(out.next).toBeNull();
    expect(out.changed).toBe(false);
    expect(Object.keys(out.outcomes)).toHaveLength(0);
  });

  it('crossings count INTERMEDIARIES only — a shipment P→C crosses M, not its endpoints', () => {
    const shipments = [{ sourceId: 'P', settlementId: 'C' }];
    const crossings = countCrossings(shipments, digest, worldOn(), T.DEFAULT_RISK_TOLERANCE, null);
    expect(crossings).toEqual({ M: 1 }); // M earns; P (origin) and C (destination) do NOT
  });

  it('an active shipment through M makes M — and only M — accrue centrality', () => {
    const shipments = [{ sourceId: 'P', settlementId: 'C' }];
    const out = advanceEntrepots({ shipments, digest, worldState: worldOn(), tick: 1 });
    expect(out.next.M).toBeTruthy();
    expect(out.next.M.centrality).toBeGreaterThan(0);
    expect(out.next.P).toBeUndefined();
    expect(out.next.C).toBeUndefined();
    expect(out.next.X).toBeUndefined(); // X is a valid detour node but no shipment crossed it
  });

  it('skips the starvation-latch records (no sourceId ⇒ no route ⇒ no crossing)', () => {
    const shipments = [{ sourceId: '', settlementId: 'C' }, { sourceId: 'P', settlementId: 'P' }];
    expect(countCrossings(shipments, digest, worldOn(), T.DEFAULT_RISK_TOLERANCE, null)).toEqual({});
  });
});

describe('M6b — the toll term joins the M1 re-score (greedy tolls DIVERT — self-balancing)', () => {
  const digest = diamondDigest();

  it('BEFORE (no toll): the cheap hub route P-M-C wins', () => {
    const route = chooseRoute(digest, worldOn(), 'P', 'C', T.DEFAULT_RISK_TOLERANCE);
    expect(route.path).toEqual(['P', 'M', 'C']);
    expect(route.toll).toBe(0);
    expect(route.tollCost).toBe(0);
  });

  it('AFTER (a greedy toll on M): the SAME O-D pair reroutes onto the detour P-X-C', () => {
    // toll 0.7 on M ⇒ tollCost = 100·0.7 = 70 ⇒ via-M effective 270 > via-X 260 ⇒ divert.
    const world = withEntrepots({ M: { centrality: 0.7, toll: 0.7, since: null, lastTick: 0 } });
    const route = chooseRoute(digest, world, 'P', 'C', T.DEFAULT_RISK_TOLERANCE);
    expect(route.path).toEqual(['P', 'X', 'C']); // rerouted AROUND the greedy toll
  });

  it('the divert is a smooth threshold in the toll rate (a modest toll does NOT divert)', () => {
    // toll 0.4 on M ⇒ via-M effective 240 < via-X 260 ⇒ still through M (rent below the divert).
    const world = withEntrepots({ M: { centrality: 0.4, toll: 0.4, since: null, lastTick: 0 } });
    expect(chooseRoute(digest, world, 'P', 'C', T.DEFAULT_RISK_TOLERANCE).path).toEqual(['P', 'M', 'C']);
  });

  it('the toll surcharge is NOT risk-discounted (every mover pays it, unlike danger)', () => {
    const world = withEntrepots({ M: { centrality: 0.5, toll: 0.5, since: null, lastTick: 0 } });
    // scoreRoute over [P,M,C]: toll counts M (an intermediary) only; tollCost = m·toll.
    const bold = scoreRoute(['P', 'M', 'C'], world, 200, 0, 100);    // risk tolerance 0
    const lawful = scoreRoute(['P', 'M', 'C'], world, 200, 1, 100);  // risk tolerance 1
    expect(bold.toll).toBe(0.5);
    expect(bold.tollCost).toBe(50);
    expect(bold.tollCost).toBe(lawful.tollCost); // toll identical regardless of risk tolerance
  });

  it('tollRateOf reads the ledger (bounded, 0 when absent)', () => {
    const world = withEntrepots({ M: { centrality: 0.9, toll: 0.9, since: 3, lastTick: 5 } });
    expect(tollRateOf(world, 'M')).toBe(0.9);
    expect(tollRateOf(world, 'X')).toBe(0); // no record
    expect(tollRateOf(worldOn(), 'M')).toBe(0); // no ledger
  });
});

describe('M6b — BRAKE 1: gate throughput CEILING (congestion)', () => {
  it('crossings beyond THROUGHPUT_CEILING earn NO extra centrality (load saturates at 1)', () => {
    const now = 10;
    const atCeiling = stepEntrepot(null, T.THROUGHPUT_CEILING, now);
    const overCeiling = stepEntrepot(null, T.THROUGHPUT_CEILING * 3, now);
    expect(atCeiling.centrality).toBe(overCeiling.centrality); // congestion caps the earn
    // …and a partial load earns strictly less.
    const partial = stepEntrepot(null, 1, now);
    expect(partial.centrality).toBeLessThan(atCeiling.centrality);
  });
});

describe('M6b — BRAKE 2: toll UPKEEP (infra is not free money)', () => {
  it('a MARGINAL entrepôt nets nothing (upkeep exceeds its takings)', () => {
    // centrality 0.3, toll 0.3 ⇒ gross 0.09, upkeep 0.35·0.3 = 0.105 ⇒ net < 0 ⇒ 0 lift.
    expect(tollProsperityOf({ centrality: 0.3, toll: 0.3 })).toBe(0);
  });
  it('a BUSY entrepôt profits, but the lift is BOUNDED by PROSPERITY_W', () => {
    const lift = tollProsperityOf({ centrality: 1, toll: 1 });
    expect(lift).toBeGreaterThan(0);
    expect(lift).toBeLessThanOrEqual(T.PROSPERITY_W);
  });
  it('tollProsperityFor reads the ledger (0 when absent ⇒ byte-identical health)', () => {
    expect(tollProsperityFor(worldOn(), 'M')).toBe(0);
    expect(tollProsperityFor(withEntrepots({ M: { centrality: 1, toll: 1, since: 1, lastTick: 5 } }), 'M')).toBeGreaterThan(0);
  });
});

describe('M6b — BRAKE 3: WARTIME TARGETING (a fat entrepôt is a juicy target, bounded)', () => {
  it('the target premium is bounded AND stays BELOW the hysteresis ENTER threshold', () => {
    const premium = entrepotTargetPremium(withEntrepots({ M: { centrality: 1, toll: 1, since: 1, lastTick: 5 } }), 'M');
    expect(premium).toBe(Math.min(T.TARGET_PREMIUM_MAX, T.TARGET_W)); // = 0.2
    expect(premium).toBeLessThan(EMBATTLEMENT_TUNING.ENTER_THRESHOLD); // never embattles a peaceful hub ALONE
  });
  it('the premium adds to the ramp — but a peaceful wealthy hub still does not cross ENTER', () => {
    const peaceful = rampThreat({ targetPremium01: T.TARGET_PREMIUM_MAX });
    expect(peaceful).toBe(T.TARGET_PREMIUM_MAX);
    expect(peaceful).toBeLessThan(EMBATTLEMENT_TUNING.ENTER_THRESHOLD);
    // …but in wartime it tips a besieged hub HIGHER (targeted first).
    const besieged = rampThreat({ besieged: true });
    const besiegedRich = rampThreat({ besieged: true, targetPremium01: T.TARGET_PREMIUM_MAX });
    expect(besiegedRich).toBeGreaterThanOrEqual(besieged);
  });
});

describe('M6b — BRAKE 4: RENT EXTRACTION BOUNDED (no pure tollbooth)', () => {
  it('the toll rate is HARD-capped at TOLL_MAX however central the settlement grows', () => {
    expect(tollFromCentrality(0.5)).toBeCloseTo(0.5, 6);
    expect(tollFromCentrality(5)).toBe(T.TOLL_MAX);       // clamped
    expect(tollFromCentrality(1e9)).toBe(T.TOLL_MAX);
    // …and the advanced ledger's toll never exceeds TOLL_MAX.
    const rec = stepEntrepot({ centrality: 1, toll: 1, since: 1, lastTick: 0 }, T.THROUGHPUT_CEILING * 10, 5);
    expect(rec.toll).toBeLessThanOrEqual(T.TOLL_MAX);
  });
});

describe('M6b — the sustained-centrality clock (transshipment-institution unlock)', () => {
  it('`since` starts when centrality crosses the unlock floor and clears when it falls', () => {
    // Drive centrality up from empty until it crosses INSTITUTION_CENTRALITY.
    const digest = diamondDigest();
    let world = worldOn();
    let firstSustainedTick = null;
    for (let tick = 1; tick <= 40; tick++) {
      // Six crossings/tick on M keeps it at full throughput (rises toward 1).
      const shipments = Array.from({ length: 6 }, () => ({ sourceId: 'P', settlementId: 'C' }));
      const out = advanceEntrepots({ shipments, digest, worldState: world, tick });
      world = { ...world, spatialLedgers: { ...world.spatialLedgers, entrepots: out.next } };
      if (out.outcomes.M?.sustained && firstSustainedTick == null) firstSustainedTick = tick;
    }
    const rec = world.spatialLedgers.entrepots.M;
    expect(rec.centrality).toBeGreaterThanOrEqual(T.INSTITUTION_CENTRALITY);
    expect(rec.since).toBeGreaterThan(0);
    expect(isSustainedEntrepot(rec, 40)).toBe(true);
    // It becomes sustained only AFTER the streak (never on the first crossing over the floor).
    expect(firstSustainedTick).toBeGreaterThan(rec.since);
    expect(firstSustainedTick - rec.since).toBeGreaterThanOrEqual(T.INSTITUTION_STREAK);
  });

  it('the unlock catalog is the three transshipment institutions, in order', () => {
    expect(TRANSSHIPMENT_INSTITUTIONS.map((i) => i.name)).toEqual(['Warehouse', 'Customs House', "Carriers' Guild"]);
  });
});

describe('M6b — DORMANT byte-identity (the constitutional gate)', () => {
  const digest = diamondDigest();

  it('advance is a no-op off the gate; a pre-existing ledger is PRESERVED untouched', () => {
    const prior = { M: { centrality: 0.5, toll: 0.5, since: 2, lastTick: 4 } };
    const dormant = { spatialCanonVersion: 1, spatialLedgers: { entrepots: prior } }; // marker but NO opt-in
    const out = advanceEntrepots({ shipments: [{ sourceId: 'P', settlementId: 'C' }], digest, worldState: dormant, tick: 9 });
    expect(out.changed).toBe(false);
    expect(out.next).toBe(prior); // same reference, untouched
  });

  it('the M1 re-score is BYTE-IDENTICAL with no entrepôt ledger (toll term 0)', () => {
    const noLedger = worldOn();
    const scored = scoreRoute(['P', 'M', 'C'], noLedger, 200, 1, 100);
    expect(scored.toll).toBe(0);
    expect(scored.tollCost).toBe(0);
    expect(scored.effectiveCost).toBe(scored.baseCost + scored.dangerCost); // no toll surcharge
  });

  it('rampThreat is BYTE-IDENTICAL with the target premium defaulted (absent ⇒ 0)', () => {
    for (const inputs of [{}, { besieged: true }, { occupationState: 'contested' }, { warExhaustion01: 0.4, crime01: 0.7, security01: 0.3 }]) {
      expect(rampThreat(inputs)).toBe(rampThreat({ ...inputs, targetPremium01: 0 }));
    }
  });

  it('is deterministic: two identical advances produce byte-identical ledgers', () => {
    const shipments = [{ sourceId: 'P', settlementId: 'C' }];
    const a = advanceEntrepots({ shipments, digest, worldState: worldOn(), tick: 7 });
    const b = advanceEntrepots({ shipments, digest, worldState: worldOn(), tick: 7 });
    expect(JSON.stringify(a.next)).toBe(JSON.stringify(b.next));
  });
});

describe('M6b — the concentration (Gini) read', () => {
  it('is 0 for an empty/even ledger and rises toward 1 as one hub dominates', () => {
    expect(centralityGini(null)).toBe(0);
    expect(centralityGini({ a: { centrality: 0.5 }, b: { centrality: 0.5 } })).toBeCloseTo(0, 6);
    const skewed = centralityGini({ a: { centrality: 1 }, b: { centrality: 0.01 }, c: { centrality: 0.01 } });
    const even = centralityGini({ a: { centrality: 0.4 }, b: { centrality: 0.4 }, c: { centrality: 0.4 } });
    expect(skewed).toBeGreaterThan(even);
  });
});
