/**
 * ES-Da — THE DARK-PATH BYTE-IDENTITY FENCE, proven THREE ways because one way is not a
 * proof.
 *
 * CR-ESDA-1 rules that the dark path's byte identity is a CONSTRUCTION rather than a
 * property to be tested for afterwards: the rider gates on `espionageActive` before it
 * touches a world object, and a declining rider contributes `{}` to the argument spread, so
 * the object handed to `mintEnvoyErrand` is the object that existed before this wave. The
 * three fences below are what make that claim falsifiable.
 *
 * ⭐⭐ FENCE 1'S GOLDEN IS A REAL FROZEN LITERAL, MEASURED AT THE PRE-FEATURE COMMIT.
 * `PRE_ESDA_DARK_LEDGER_HASH` was executed against a `git archive` of committed `caa6094a`
 * — the parent this wave was built on, which carries NO rider leaf and NO `covertRiderFor`
 * call in `envoyDiplomacy.js` — over the identical ten-tick lifecycle this file runs. That
 * is deliberate and it is the recorded lesson of the ES-1 fence beside this one, whose
 * shipped version compared a dark run against ANOTHER DARK RUN — the same call twice — and
 * therefore could not fail for any mutation at all. A golden that is re-derived from the
 * code under test measures nothing.
 *
 * ⭐ FENCE 3 IS NOT OPTIONAL. Without a lit mutant the two fences above would pass by
 * measuring nothing: a rider that returned `null` unconditionally would satisfy every
 * dark assertion in this file. The lit arm proves the fence can SEE.
 *
 * ⚠ THE SPINE FLAG IS HELD LIT IN EVERY ARM, on purpose. This fence is about the COVERT
 * arm's dormancy; holding `errandSpineEnabled` constant is what stops it measuring SP-D's
 * dormancy a second time under a new name.
 *
 * ⚠ STRAIGHT-LINE REGISTRATION ONLY — a `test()` inside a loop parks the whole file.
 */
import { createHash } from 'node:crypto';
import { describe, expect, test } from 'vitest';

import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { readWarPeaceDecision } from '../../src/domain/worldPulse/warPeaceDecision.js';
import { dispatchAcceptedPeaceEnvoy } from '../../src/domain/worldPulse/envoyDiplomacy.js';
import { advanceEnvoyErrands, envoyErrandsOf } from '../../src/domain/worldPulse/envoyErrand.js';
import {
  PROVENANCE_GENERATED,
  routeEdge,
  routeEdgeId,
} from '../../src/domain/worldPulse/routeNetworkLedger.js';
import { covertRiderFor } from '../../src/domain/worldPulse/espionage/espionageRider.js';
import { espionageActive } from '../../src/domain/worldPulse/espionage/espionageGate.js';
import { covertDwellRead } from '../../src/domain/worldPulse/espionage/espionageGauntlet.js';
import { advanceEspionageProducts } from '../../src/domain/worldPulse/espionage/espionageProductStage.js';
import { normalizeCovertMission } from '../../src/domain/worldPulse/envoyErrandRecords.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const NOW = '2026-08-02T00:00:00.000Z';
const FROM = 'ashford';
const TO = 'westmarch';
const WAR_RULES = Object.freeze({
  warLayerEnabled: true,
  warTerminationEnabled: true,
  peaceEngineEnabled: true,
  envoyDiplomacyEnabled: true,
  npcConsequencesEnabled: true,
  routeLifecycleEnabled: true,
});
/** The substrate, lit in EVERY arm — see the header. */
const SPINE_RULES = Object.freeze({ infoMode: 'unreliable', errandSpineEnabled: true });

/**
 * ⛔ THE PRE-FEATURE GOLDEN. Executed against a `git archive` of committed `caa6094a`,
 * whose `envoyDiplomacy.js` contains no `covertRiderFor` call and whose espionage directory
 * contains no rider leaf. Ten ticks of a real accepted-peace errand lifecycle.
 * ⛔ THIS NUMBER MOVING IS A STOP, NEVER A RE-RECORD — it is the owner's condition.
 */
const PRE_ESDA_DARK_LEDGER_HASH = 'cf6b2c95cb26e3b915eb6907d628cf5d82e7283c5ad2351a75a6c7dfbc545d3a';

/** The ten per-tick ledger hashes, so a divergence names the tick it started at. */
const PRE_ESDA_DARK_TICK_HASHES = Object.freeze([
  '27d77a475e219a7f3337fb7f6a07f6899dad16a0b4b668b3df843545afaa3a90', // tick 13
  '27d77a475e219a7f3337fb7f6a07f6899dad16a0b4b668b3df843545afaa3a90', // tick 14
  '27d77a475e219a7f3337fb7f6a07f6899dad16a0b4b668b3df843545afaa3a90', // tick 15
  'cf6b2c95cb26e3b915eb6907d628cf5d82e7283c5ad2351a75a6c7dfbc545d3a', // tick 16
  'cf6b2c95cb26e3b915eb6907d628cf5d82e7283c5ad2351a75a6c7dfbc545d3a', // tick 17
  'cf6b2c95cb26e3b915eb6907d628cf5d82e7283c5ad2351a75a6c7dfbc545d3a', // tick 18
  'cf6b2c95cb26e3b915eb6907d628cf5d82e7283c5ad2351a75a6c7dfbc545d3a', // tick 19
  'cf6b2c95cb26e3b915eb6907d628cf5d82e7283c5ad2351a75a6c7dfbc545d3a', // tick 20
  'cf6b2c95cb26e3b915eb6907d628cf5d82e7283c5ad2351a75a6c7dfbc545d3a', // tick 21
  'cf6b2c95cb26e3b915eb6907d628cf5d82e7283c5ad2351a75a6c7dfbc545d3a', // tick 22
]);

const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

function save(id, name, population, npcs = []) {
  return {
    id,
    name,
    settlement: {
      id,
      name,
      seed: `seed.${id}`,
      tier: 'town',
      population,
      config: { priorityEconomy: 30, priorityMilitary: 30, tradeRouteAccess: 'road' },
      economicState: { prosperity: 'Stable', primaryExports: [], primaryImports: [] },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ id: `${id}.seat`, faction: `${name} Seat`, power: 60, isGoverning: true }],
      },
      npcs,
      activeConditions: [],
    },
  };
}

const EDGE = Object.freeze({
  id: `edge.${FROM}.${TO}`, from: FROM, to: TO, relationshipType: 'hostile',
});
const KEY = relationshipKeyFromEdge(EDGE);

function peaceOffer() {
  return {
    id: `candidate.strategy.sue_for_peace.${FROM}.12`,
    generatedAtTick: 12,
    type: 'relationship',
    candidateType: 'strategy_sue_for_peace',
    ruleFamily: 'strategy',
    targetSaveId: FROM,
    severity: 0.72,
    probability: 1,
    applyMode: 'auto',
    headline: 'Ashford sues for peace',
    summary: 'Ashford offers terms.',
    reasons: [],
    relationshipKey: KEY,
    relationshipPatch: { proposedRelationshipType: 'cold_war', trajectory: 'transitioning' },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey: KEY,
      fromType: 'hostile',
      toType: 'cold_war',
      peaceOffer: true,
      offererId: FROM,
      targetId: TO,
      peaceFrontOwnerId: FROM,
      peaceFrontSinceTick: 3,
      reason: 'Ashford offered peace.',
    },
  };
}

/** One world, with the espionage flag spelled however the arm asks for it. */
function world(flag) {
  const saves = [
    save(FROM, 'Ashford', 1000, [{
      id: 'npc.mara', name: 'Mara Vale', role: 'Chancellor', importance: 'notable', status: 'active',
    }]),
    save(TO, 'Westmarch', 12000),
  ];
  const graph = ensureRegionalGraph({ edges: [EDGE], channels: [] }, { now: NOW });
  const roadId = routeEdgeId(FROM, TO, 'land');
  const worldState = {
    tick: 12,
    spatialCanonVersion: 1,
    simulationRules: {
      ...WAR_RULES,
      ...SPINE_RULES,
      ...(flag === undefined ? {} : { espionageEnabled: flag }),
    },
    relationshipStates: { [KEY]: { relationshipType: 'hostile', trust: 0.5, resentment: 0.2 } },
    deployments: {
      [FROM]: {
        targetId: TO, sinceTick: 3, role: 'siege',
        maxStartStrength: 100, currentEffectiveStrength: 100, casusReasons: [],
      },
    },
    warExhaustion: { [TO]: 1 },
    spatialLedgers: {
      warReasons: {},
      routeNetwork: {
        edges: {
          [roadId]: routeEdge({
            a: FROM, b: TO, grade: 'road', mode: 'land',
            provenance: PROVENANCE_GENERATED, flavor: 'genesis', tick: 0,
            dominantFlowClass: null,
          }),
        },
        corridor: {},
      },
    },
  };
  const settlements = saves.map((row) => ({
    id: row.id, name: row.name, save: row, settlement: row.settlement,
  }));
  return {
    worldState,
    graph,
    snapshot: {
      settlements,
      byId: new Map(settlements.map((row) => [row.id, row])),
      regionalGraph: graph,
      worldState,
      campaign: {},
    },
  };
}

/** A REAL dispatch followed by ten ticks of the real advance writer. */
function lifecycle(flag) {
  const f = world(flag);
  const outcome = peaceOffer();
  const decision = readWarPeaceDecision({
    worldState: f.worldState, snapshot: f.snapshot, outcome, tick: 12,
  });
  const dispatched = dispatchAcceptedPeaceEnvoy({
    worldState: f.worldState, snapshot: f.snapshot, outcome, decision, tick: 12,
  });
  let state = dispatched.worldState;
  const tickHashes = [];
  for (let tick = 13; tick <= 22; tick += 1) {
    state = advanceEnvoyErrands({ worldState: state, tick }).worldState;
    tickHashes.push(hash(envoyErrandsOf(state)));
  }
  return {
    fixture: f,
    reason: dispatched.reason,
    changed: dispatched.changed,
    ledger: envoyErrandsOf(state),
    ledgerHash: hash(envoyErrandsOf(state)),
    tickHashes,
    worldState: state,
  };
}

describe('ES-Da FENCE 1 — the dark path is the object that existed before this wave', () => {
  test('the ten-tick dark lifecycle hashes to the PRE-FEATURE golden, tick by tick', () => {
    const dark = lifecycle(undefined);
    // The run has to have actually happened, or the golden is a hash of nothing.
    expect(dark.reason).toBe('dispatched');
    expect(dark.changed).toBe(true);
    expect(dark.ledger).toHaveLength(1);
    expect(dark.tickHashes).toHaveLength(10);
    expect(dark.ledgerHash).toBe(PRE_ESDA_DARK_LEDGER_HASH);
    expect(dark.tickHashes).toEqual([...PRE_ESDA_DARK_TICK_HASHES]);
  });

  test('absent, false, 0 and the STRING "true" are ONE WORLD, byte for byte', () => {
    const spellings = [undefined, false, 0, 'true'].map((flag) => lifecycle(flag));
    expect(spellings.map((run) => run.reason)).toEqual([
      'dispatched', 'dispatched', 'dispatched', 'dispatched',
    ]);
    expect(spellings.map((run) => run.ledgerHash)).toEqual([
      PRE_ESDA_DARK_LEDGER_HASH,
      PRE_ESDA_DARK_LEDGER_HASH,
      PRE_ESDA_DARK_LEDGER_HASH,
      PRE_ESDA_DARK_LEDGER_HASH,
    ]);
    // ...and every intermediate tick agrees too, not merely the end state.
    expect(spellings.map((run) => run.tickHashes)).toEqual([
      [...PRE_ESDA_DARK_TICK_HASHES],
      [...PRE_ESDA_DARK_TICK_HASHES],
      [...PRE_ESDA_DARK_TICK_HASHES],
      [...PRE_ESDA_DARK_TICK_HASHES],
    ]);
  });

  test('THE CONSTRUCTION ITSELF: a declining rider contributes ZERO KEYS to the spread', () => {
    // CR-ESDA-1 in one assertion. This is the spread expression from the call site,
    // evaluated on the real dark return value rather than on a stand-in.
    const rider = covertRiderFor({
      worldState: world(undefined).worldState,
      item: world(undefined).snapshot.byId.get(FROM),
      fromId: FROM,
      toId: TO,
      errandId: 'errand.whatever',
    });
    expect(rider.covert).toBeNull();
    const spread = { ...(rider.covert ? { purposeClass: 'covert', covert: rider.covert } : {}) };
    expect(Object.keys(spread)).toEqual([]);
    // ...and the LIT rider really does fill that same spread — so the emptiness above is a
    // gate refusing, not an expression that can never carry anything.
    const litRider = covertRiderFor({
      worldState: world(true).worldState,
      item: world(true).snapshot.byId.get(FROM),
      fromId: FROM,
      toId: TO,
      errandId: 'errand.a',
    });
    const litSpread = {
      ...(litRider.covert ? { purposeClass: 'covert', covert: litRider.covert } : {}),
    };
    expect(Object.keys(litSpread).sort()).toEqual(['covert', 'purposeClass']);
  });

  test('the dark row grows NO covert field and NO face fields at all', () => {
    const row = lifecycle(undefined).ledger[0];
    const keys = Object.keys(row);
    // Each exclusion carries its own liveness anchor: `state` must be PRESENT on the same
    // row, so none of the three can pass by measuring a row that never existed.
    expectAbsentWithAnchor(keys, 'covert', 'state', 'the dark errand row');
    expectAbsentWithAnchor(keys, 'declaredPurpose', 'state', 'the dark errand row');
    expectAbsentWithAnchor(keys, 'truePurpose', 'state', 'the dark errand row');
  });
});

describe('ES-Da FENCE 2 — the per-door census, every arm dropped ALONE', () => {
  test('each of the five doors is separately reachable and names itself', () => {
    const lit = world(true);
    const item = lit.snapshot.byId.get(FROM);
    const call = (patch) => covertRiderFor({
      worldState: lit.worldState, item, fromId: FROM, toId: TO, errandId: 'errand.a', ...patch,
    });
    // 1 — the gate.
    expect(call({ worldState: world(undefined).worldState }).reason).toBe('dark');
    // 2 — the endpoints, each arm of the conjunction on its own.
    expect(call({ fromId: '' }).reason).toBe('invalid_endpoints');
    expect(call({ toId: '' }).reason).toBe('invalid_endpoints');
    expect(call({ errandId: '' }).reason).toBe('invalid_endpoints');
    expect(call({ toId: FROM }).reason).toBe('invalid_endpoints');
    // 4 — the draw. (Door 3 is a fail-closed guard no production input reaches; its
    // unreachability is MEASURED and driven at the module seam in
    // tests/domain/espionageRider.test.js rather than pretended to be live here.)
    expect(call({ errandId: 'errand.b' }).reason).toBe('cadence_declined');
    // 5 — the ride.
    expect(call({}).reason).toBe('rides');
  });

  test('a refusing door returns cargo of exactly null, never an empty object', () => {
    const lit = world(true);
    const item = lit.snapshot.byId.get(FROM);
    const refusals = ['', FROM].map((toId) => covertRiderFor({
      worldState: lit.worldState, item, fromId: FROM, toId, errandId: 'errand.a',
    }).covert);
    expect(refusals).toEqual([null, null]);
    // An empty object would be a KEY, and a key is a byte.
    expect(refusals.map((value) => value === null)).toEqual([true, true]);
  });
});

describe('ES-Da FENCE 3 — THE LIT MUTANT: the fence can SEE', () => {
  test('a lit world with a drawing court mints a lawful covert sub-record', () => {
    const lit = lifecycle(true);
    expect(lit.reason).toBe('dispatched');
    // THE LITERAL DRIVE, spelled out rather than composed, for the lit-coverage census.
    expect(espionageActive({
      spatialCanonVersion: 1,
      simulationRules: { infoMode: 'unreliable', errandSpineEnabled: true, espionageEnabled: true },
    })).toBe(true);
    // The golden MOVES when the flag lights — without this the fence measures nothing.
    expect(lit.ledgerHash).not.toBe(PRE_ESDA_DARK_LEDGER_HASH);
    const row = lit.ledger[0];
    expect(row.covert).toEqual({
      demand: 'confirm',
      itinerary: [{ face: 'declared', settlementId: TO, stayTicks: 1 }],
      product: 'confirm',
      subjectId: TO,
    });
    // The face the row wears in public is DERIVED, and it is not the secret.
    expect(row.declaredPurpose).toBe('diplomatic');
    expect(row.truePurpose).toBe('covert');
    // The real validator accepts what the rider composed, unchanged.
    expect(normalizeCovertMission(row.covert).covert).toEqual(row.covert);
  });

  test('THE TRAFFIC FLOWS: the embassy dwells at its own destination and products accrue', () => {
    const lit = lifecycle(true);
    const f = lit.fixture;
    // Walk to the stop with the real advance writer and read the real gauntlet.
    const outcome = peaceOffer();
    const decision = readWarPeaceDecision({
      worldState: f.worldState, snapshot: f.snapshot, outcome, tick: 12,
    });
    let state = dispatchAcceptedPeaceEnvoy({
      worldState: f.worldState, snapshot: f.snapshot, outcome, decision, tick: 12,
    }).worldState;
    let dwell = null;
    let atTick = 0;
    for (let tick = 13; tick <= 22 && !dwell; tick += 1) {
      state = advanceEnvoyErrands({ worldState: state, tick }).worldState;
      const read = covertDwellRead({ errand: envoyErrandsOf(state)[0], tick });
      if (read.dwelling) { dwell = read; atTick = tick; }
    }
    expect(dwell).not.toBeNull();
    expect(dwell.settlementId).toBe(TO);
    // interval 0 is the MINTED stay — the one tick the embassy's own schedule reserves.
    expect(dwell.intervalIdx).toBe(0);
    expect(dwell.rooted).toBe(false);
    expect(envoyErrandsOf(state)[0].state).toBe('parlaying');
    // ES-3's stage, which walks an empty ledger today, gets its first row.
    const products = advanceEspionageProducts({
      worldState: state, tick: atTick, snapshot: f.snapshot, regionalGraph: f.graph,
    });
    expect(products.gatherings).toHaveLength(1);
    expect(products.gatherings[0]).toMatchObject({ stopId: TO, written: true });
    const amended = envoyErrandsOf(products.worldState)[0];
    expect(amended.covert.gathered).toHaveLength(1);
    expect(amended.covert.gathered[0].subjectId).toBe(TO);
  });

  test('the SAME fixture dark accrues nothing — the mutant control', () => {
    const dark = lifecycle(undefined);
    const f = dark.fixture;
    let state = dark.worldState;
    const products = advanceEspionageProducts({
      worldState: state, tick: 16, snapshot: f.snapshot, regionalGraph: f.graph,
    });
    expect(products.gatherings).toEqual([]);
    // The stage returns the world BY REFERENCE when nothing moved — writeErrands' own law.
    expect(products.worldState).toBe(state);
    expect(envoyErrandsOf(products.worldState)[0].covert).toBeUndefined();
  });
});
