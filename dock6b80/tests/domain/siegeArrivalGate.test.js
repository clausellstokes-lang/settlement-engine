/**
 * siegeArrivalGate.test.js — JOIN 2: A SIEGE MUST WAIT FOR THE ARMY TO ARRIVE.
 *
 * THE BROKEN JOIN (closed here). Two movement models never met. The aspatial war
 * layer (warDeployment.js) committed an army and resolved a siege on the very next
 * tick, no matter how far the target was. The spatial transit layer
 * (spatial/armyTransit.js + worldPulse/armyTransitKernel.js) meanwhile gave that same
 * army a route, a march time and a position along it — and warDeployment.js imported
 * exactly ONE symbol from it (`armyTransitActive`, used only to switch the siege
 * verdict core from a capacity roll to a starvation roll). NOTHING in the siege path
 * ever read the position. An army besieged from the road.
 *
 * THE FIX is a single READ, never a second position model: `siegeArrivalGate` builds a
 * predicate over the published `armyTransit` ledger, and the besieger set excludes any
 * army whose march to THAT target has not landed. An army in transit neither rolls the
 * siege, nor ages it, nor takes siege attrition, nor withdraws.
 *
 * THE THREE PROPERTIES pinned below:
 *   1. BOTH ARMS — in transit does NOT besiege; arrived DOES (same fixture, same seed).
 *   2. DARK SPATIAL is untouched — off the canon the gate is provably the identity
 *      filter, and the aspatial fixture resolves exactly as it did before the join.
 *   3. TERMINATION survives — the march is bounded by MAX_MARCH_WEEKS, which is
 *      strictly below SIEGE_MAX_AGE, so even the LONGEST legal march leaves the hard
 *      ceiling room to fire. Driven, not argued: a 52-tick march is run to resolution.
 */
import { describe, expect, test } from 'vitest';

import { evaluateWarLayer, SIEGE_MAX_AGE } from '../../src/domain/worldPulse/warDeployment.js';
import {
  siegeArrivalGate, armyRecordOf, ARMY_ROLES, ARMY_TRANSIT_TUNING,
} from '../../src/domain/spatial/armyTransit.js';
import { setSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

const NOW = '2026-01-01T00:00:00.000Z';

// ── Fixture (modelled on siegeTermination.test.js so the two read as siblings) ──
function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: [],
    economicState: { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: [
        { faction: 'Military Council', category: 'military', power: 78, isGoverning: true },
        { faction: 'Merchant League', category: 'economy', power: 52 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}

const save = (id, name, patch = {}) => ({
  id, name, phase: 'canon', settlement: settlement(name, patch),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

/** The three-node line atlas — marka — borin (the armyTransit fixture's own digest). */
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
    tiers: { atlas: { marka: 1, borin: 1 }, marka: { atlas: 1, borin: 1 }, borin: { marka: 1, atlas: 1 } },
  };
}

/** One in-flight march record: atlas → borin, departing `departTick`, landing `arrivalTick`. */
const marchRecord = ({ departTick, arrivalTick, strength = 60 }) => armyRecordOf({
  armyId: 'atlas', role: ARMY_ROLES.MARCH, originId: 'atlas', destId: 'borin',
  path: ['atlas', 'marka', 'borin'], departTick, arrivalTick,
  position01: 0, strength, readiness: 0.5, supplyQuality: 1, funding: 0.5,
  beliefStaleness: 0, lastTick: departTick,
});

/** A STATEFUL siege record pinned to a chosen strength + age (siegeTermination's idiom). */
const siegeRecord = (targetId, { age, strength, sinceTick = 0 }) => ({
  targetId, sinceTick, role: 'siege',
  maxStartStrength: strength, currentEffectiveStrength: strength,
  accumulatedAttrition: 0, reinforcementFlow: 0, deploymentAge: age,
  manpower: 0.6, supplyIntegrity: 0.6, morale: 0.6, equipmentCondition: 0.6,
  magicSupport: 0.6, commandQuality: 0.6, foodReserve: 0.6,
  logisticsBurden: 0.2, objective: 'conquest', returnCondition: 'pending',
});

const EDGES = [{ id: 'edge.atlas.borin', from: 'atlas', to: 'borin', relationshipType: 'hostile' }];
const CHANNELS = [{ type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' }];

/**
 * Drive ONE war-layer tick. `transit` (null ⇒ no ledger) is the armyTransit ledger the
 * gate reads; `spatial` toggles the canon marker + frozen digest.
 */
function evaluate({ saves, deployments, warExhaustion = {}, tick, spatial = false, transit = null, edges = EDGES, channels = CHANNELS }) {
  const relationshipStates = Object.fromEntries(edges.map(e => [e.id, { relationshipType: e.relationshipType }]));
  let worldState = {
    rngSeed: 'war-seed', tick, relationshipStates, deployments, warExhaustion,
    simulationRules: { warLayerEnabled: true },
    ...(spatial ? { spatialCanonVersion: 1, spatialDigest: lineDigest() } : {}),
  };
  if (transit) worldState = setSpatialLedger(worldState, 'armyTransit', transit);
  const campaign = {
    id: 'arrival-fixture', name: 'Arrival Fixture', settlementIds: saves.map(s => s.id),
    worldState,
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: tick, entries: [] },
  };
  const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
  return evaluateWarLayer({
    snapshot, worldState: snapshot.worldState, rng: createPRNG('war-seed'), tick, now: NOW,
    rules: { warLayerEnabled: true },
  });
}

// A besieger that OUT-CLASSES its target and has run the hard ceiling: at the walls it
// STORMS (a deterministic conquest, no rng). That makes "did the siege loop process this
// besieger?" a single, unmistakable observable.
const DOMINANT_SAVES = [
  save('atlas', 'Atlas', { tier: 'city', population: 30000 }),
  save('borin', 'Borin', { tier: 'town', population: 9000, legitimacy: 65 }),
];
const DOMINANT_STRENGTH = 60;

// ─────────────────────────────────────────────────────────────────────────────
describe('JOIN 2 — siegeArrivalGate: the predicate is a READ of the transit ledger', () => {
  const REC = { armyTransit: { atlas: marchRecord({ departTick: 10, arrivalTick: 18 }) } };

  test('OFF the spatial canon the gate is the IDENTITY filter (dark spatial ⇒ nothing gates)', () => {
    // No ledger at all, an EMPTY namespace, and a namespace holding OTHER spatial
    // ledgers: in every dark shape the predicate is true for every pair, which is why
    // the aspatial besieger set is byte-identical.
    const pairs = [['atlas', 'borin'], ['borin', 'atlas'], ['marka', 'borin'], ['77', '88']];
    for (const world of [null, undefined, {}, { spatialLedgers: {} }, { spatialLedgers: { embattlement: { marka: { level: 1 } } } }]) {
      const gate = siegeArrivalGate(world, 12);
      for (const [army, target] of pairs) expect(gate(army, target), JSON.stringify({ world, army, target })).toBe(true);
    }
  });

  test('a march to THIS target gates until arrival, then opens — and stays open', () => {
    const gate = (t) => siegeArrivalGate({ spatialLedgers: REC }, t)('atlas', 'borin');
    expect(gate(10)).toBe(false);   // departed
    expect(gate(17)).toBe(false);   // one tick short of the walls
    expect(gate(18)).toBe(true);    // landed
    expect(gate(40)).toBe(true);    // and never re-closes
  });

  test('a record aimed ELSEWHERE never gates (the stale-front retirement path is untouched)', () => {
    // atlas marches on borin; a stale confirmed war_front still points atlas → marka.
    // The gate must not silence marka's siege loop, or that stale front could never retire.
    const gate = siegeArrivalGate({ spatialLedgers: REC }, 12);
    expect(gate('atlas', 'marka')).toBe(true);
    // And an army with NO record at all (planMarch returned null — an unreachable or
    // unmapped pair) besieges exactly as the aspatial layer always did.
    expect(gate('borin', 'atlas')).toBe(true);
  });

  test('THE TERMINATION INVARIANT: the longest legal march is strictly shorter than the siege ceiling', () => {
    // This is the cross-module guarantee the gate rests on. If MAX_MARCH_WEEKS ever
    // reached SIEGE_MAX_AGE, a maximal march could consume the entire siege clock and
    // the hard ceiling would have no ticks left to fire in.
    expect(ARMY_TRANSIT_TUNING.MAX_MARCH_WEEKS).toBeLessThan(SIEGE_MAX_AGE);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('JOIN 2 — BOTH ARMS: an army on the road does not besiege; an arrived one does', () => {
  const dominantAtCeiling = (extra) => evaluate({
    saves: DOMINANT_SAVES,
    warExhaustion: { atlas: 1.0 },
    deployments: { atlas: siegeRecord('borin', { age: SIEGE_MAX_AGE - 1, strength: DOMINANT_STRENGTH }) },
    ...extra,
  });

  test('ARM A — IN TRANSIT: no conquest, no siege attrition, the army is still marching', () => {
    const war = dominantAtCeiling({
      tick: 700, spatial: true,
      transit: { atlas: marchRecord({ departTick: 690, arrivalTick: 710 }) },
    });
    expect(war.outcomes.filter(o => o.candidateType === 'conquest')).toEqual([]);
    expect(war.deployments.atlas).toBeTruthy();                       // still committed
    expect(war.resolvedDeployments).toEqual([]);                      // and not withdrawn
    // The siege loop never touched it: attrition is applied only inside the besieger
    // loop, so a marching column's accumulated attrition is exactly what it arrived with.
    expect(war.deployments.atlas.accumulatedAttrition).toBe(0);
  });

  test('ARM B — ARRIVED: the identical fixture one tick past arrival STORMS the walls', () => {
    const war = dominantAtCeiling({
      tick: 710, spatial: true,
      transit: { atlas: marchRecord({ departTick: 690, arrivalTick: 710 }) },
    });
    const conquest = war.outcomes.find(o => o.candidateType === 'conquest');
    expect(conquest).toBeTruthy();
    expect(conquest.targetSaveId).toBe('borin');
    expect(conquest.powerTransfer.toPowerName).toBe('Atlas occupation authority');
    expect(war.deployments.atlas).toBeUndefined();                    // the army resolved home
  });

  test('DARK SPATIAL: the same fixture with no canon resolves exactly as it did before the join', () => {
    // The pre-join behaviour, verbatim (this is siegeTermination.test.js's DOMINANT
    // ceiling case): with no marker there is no ledger to read, so the gate cannot fire.
    const war = dominantAtCeiling({ tick: 700, spatial: false, transit: null });
    const conquest = war.outcomes.find(o => o.candidateType === 'conquest');
    expect(conquest).toBeTruthy();
    expect(conquest.targetSaveId).toBe('borin');
    expect(war.deployments.atlas).toBeUndefined();
  });

  test('MARKER WITHOUT A LEDGER: a spatial world whose army never got a route still besieges', () => {
    // planMarch returns null for an unreachable/unmapped pair, so no record is ever
    // written for that army. The war layer must keep running for it, not stall forever.
    const war = dominantAtCeiling({ tick: 700, spatial: true, transit: null });
    expect(war.outcomes.some(o => o.candidateType === 'conquest')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('JOIN 2 — DECLARED BEHAVIOUR SHIFT: a conquest no longer recalls a marching co-besieger', () => {
  test('the arrived power storms; the column still on the road keeps its army and its front', () => {
    // Two powers converge on borin. atlas is AT THE WALLS at the hard ceiling (it storms);
    // marka is still marching. Before the join both were in the besieger set, so the
    // conquest cleared BOTH deployments and retired BOTH war_fronts. Now marka is simply
    // not there when the town falls: its column keeps marching and will invest the
    // (newly occupied) town when it arrives. This is the coherent physics — a conquest by
    // a rival does not teleport a third party's army home — and it is recorded here
    // because it is a real, deliberate change to the coalition-siege resolution.
    const war = evaluate({
      saves: [
        save('atlas', 'Atlas', { tier: 'city', population: 30000 }),
        save('marka', 'Marka', { tier: 'city', population: 30000 }),
        save('borin', 'Borin', { tier: 'town', population: 9000, legitimacy: 65 }),
      ],
      edges: [
        { id: 'edge.atlas.borin', from: 'atlas', to: 'borin', relationshipType: 'hostile' },
        { id: 'edge.marka.borin', from: 'marka', to: 'borin', relationshipType: 'hostile' },
      ],
      channels: [
        { type: 'war_front', from: 'atlas', to: 'borin', status: 'confirmed' },
        { type: 'war_front', from: 'marka', to: 'borin', status: 'confirmed' },
      ],
      warExhaustion: { atlas: 1.0 },
      deployments: {
        atlas: siegeRecord('borin', { age: SIEGE_MAX_AGE - 1, strength: DOMINANT_STRENGTH }),
        marka: siegeRecord('borin', { age: 0, strength: DOMINANT_STRENGTH }),
      },
      tick: 700, spatial: true,
      transit: {
        // Only marka is afield; atlas has no record (it is already at the walls).
        marka: armyRecordOf({
          armyId: 'marka', role: ARMY_ROLES.MARCH, originId: 'marka', destId: 'borin',
          path: ['marka', 'borin'], departTick: 690, arrivalTick: 720,
          position01: 0, strength: DOMINANT_STRENGTH, readiness: 0.5, lastTick: 700,
        }),
      },
    });
    expect(war.outcomes.some(o => o.candidateType === 'conquest')).toBe(true);
    expect(war.deployments.atlas).toBeUndefined();   // the storming power went home
    expect(war.deployments.marka).toBeTruthy();      // the marching column did not
    // Its front stays live, because its campaign is still live.
    const markaFront = war.retiredChannels.filter(id => String(id).includes('marka'));
    expect(markaFront).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('JOIN 2 — the march time is a REAL cost: distance delays the first siege tick', () => {
  /**
   * Drive ticks from `from` to `to` with a FIXED transit record, feeding the war
   * layer's own deployment ledger forward, and report the first tick on which the
   * besieger took siege attrition (the direct signature of "the siege loop ran on it").
   */
  function firstSiegeTick({ arrivalTick, from, to }) {
    let deployments = { atlas: siegeRecord('borin', { age: 0, strength: 50.9, sinceTick: 0 }) };
    const transit = { atlas: marchRecord({ departTick: 0, arrivalTick, strength: 50.9 }) };
    for (let tick = from; tick <= to; tick += 1) {
      const war = evaluate({
        saves: [save('atlas', 'Atlas', { tier: 'city', population: 22000 }),
          save('borin', 'Borin', { tier: 'city', population: 22000, legitimacy: 70 })],
        warExhaustion: { atlas: 1.0 }, deployments, tick, spatial: true, transit,
      });
      if (Number(war.deployments.atlas?.accumulatedAttrition) > 0) return tick;
      if (!war.deployments.atlas) return tick; // resolved some other way — report it
      deployments = war.deployments;
    }
    return null;
  }

  test('a LONGER march pushes the first siege tick out — and it lands exactly on arrival', () => {
    const near = firstSiegeTick({ arrivalTick: 2, from: 1, to: 30 });
    const far = firstSiegeTick({ arrivalTick: 9, from: 1, to: 30 });
    expect(near).toBe(2);
    expect(far).toBe(9);
    expect(far).toBeGreaterThan(near);   // distance measurably costs the campaign ticks
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('JOIN 2 — TERMINATION: the longest legal march cannot outlive the hard ceiling', () => {
  test('a MAX_MARCH_WEEKS march still resolves inside the siege-duration ceiling', () => {
    // The worst legal case: the army spends MAX_MARCH_WEEKS (52) ticks on the road while
    // its deploymentAge climbs anyway (step 0 ages every committed deployment). The
    // ceiling reads that age, so the campaign must still end by SIEGE_MAX_AGE.
    const arrivalTick = ARMY_TRANSIT_TUNING.MAX_MARCH_WEEKS;
    const transit = { atlas: marchRecord({ departTick: 0, arrivalTick, strength: 50.9 }) };
    let deployments = { atlas: siegeRecord('borin', { age: 0, strength: 50.9, sinceTick: 0 }) };
    let resolvedAt = null;
    let besiegedFirstAt = null;
    for (let tick = 1; tick <= SIEGE_MAX_AGE + 10; tick += 1) {
      const war = evaluate({
        saves: [save('atlas', 'Atlas', { tier: 'city', population: 22000 }),
          save('borin', 'Borin', { tier: 'city', population: 22000, legitimacy: 70 })],
        warExhaustion: { atlas: 1.0 }, deployments, tick, spatial: true, transit,
      });
      if (besiegedFirstAt == null && Number(war.deployments.atlas?.accumulatedAttrition) > 0) besiegedFirstAt = tick;
      if (!war.deployments.atlas) { resolvedAt = tick; break; }
      deployments = war.deployments;
    }
    // It terminated — the join did NOT create a forever-war.
    expect(resolvedAt).not.toBeNull();
    // And it terminated inside the ceiling the war layer already guaranteed.
    expect(resolvedAt).toBeLessThanOrEqual(SIEGE_MAX_AGE + 1);
    // Anti-vacuity: the army really did spend the whole march on the road (the gate was
    // load-bearing for the entire run), and really did invest the town before the end.
    expect(besiegedFirstAt).toBe(arrivalTick);
    expect(resolvedAt).toBeGreaterThan(arrivalTick);
  }, 30_000);
});
