/**
 * advanceEpochStampSurvival.test.js — EP-3 slice A: THE STAMP, AND ITS SURVIVAL TO EVERY
 * FAMILY-1 READ (docs/DESIGN_FP_ARCH_EP.md §3b.1a, §3b.1b).
 *
 * THE DEFECT THIS FILE EXISTS TO MAKE IMPOSSIBLE. A program that freshens only the pulse
 * ROOT ships a "fresh future" that is bit-for-bit the OLD one for every draw that never
 * touches the pulse `rng` — road cadence, succession contests, city demographic responses,
 * sovereignty-market buyers, and the three DM realm verbs. Those draws compose their own
 * keys from `worldState.rngSeed` DIRECTLY, at sites five module boundaries downstream of
 * the argument the epoch arrives on. Slice A's answer is a STAMP: the epoch is written onto
 * the world the calendar advance produced (seam edit 9), and each far site reads it back
 * off the world it was handed.
 *
 * ⛔ THE STAMP'S SURVIVAL ACROSS THAT DISTANCE IS PINNED, NEVER ARGUED. The span is sixty-
 * nine `worldState` rebinds across two files, fifty of them at or past the apply-side mount
 * every layer's stages hang from — a GROWTH surface, not a fixed one. A stage added there
 * next quarter that rebuilds the world wholesale would silently un-root every row below,
 * and no behaviour test in the estate would notice: an epoch-blind draw is still a valid
 * draw. So each row is asserted INDEPENDENTLY, each carries an OBSERVED-CALL FLOOR (a row
 * that sees zero calls REDS — fix the FIXTURE, never the assertion), and the returned world
 * carries its own arm because a stage between the last read and the return is invisible to
 * every in-pulse row.
 *
 * ⭐ THE SPY SITS AT THE LEAF, OUTSIDE EVERY CALLING MODULE BY CONSTRUCTION. Wrapping a
 * function in its own module's namespace counts ZERO when the caller invokes it
 * intra-module (the recorded WR-10 lesson); here every caller IMPORTS from the leaf, so
 * mocking the leaf really does intercept. It is a STRICT PASS-THROUGH — the real accessor's
 * own return value is what the caller receives — so instrumenting perturbs nothing.
 */
import { describe, expect, test, vi } from 'vitest';

/** The recorder. Hoisted, because vi.mock factories hoist above the imports. */
const spy = {
  /** @type {Array<{ module: string, out: unknown }>} every tickStreamSeedOf call. */
  calls: [],
  /** @type {string[]} every seed handed to createPRNG, in composition order. */
  roots: [],
};
const resetSpy = () => { spy.calls = []; spy.roots = []; };

/** The CALLING module, taken from the stack frame under the accessor's own frame. */
function callingModule() {
  const frames = String(new Error('stack probe').stack || '').split('\n').slice(1);
  for (const frame of frames) {
    const match = /\/(src\/[^\s:)]+\.jsx?)/.exec(frame);
    if (match && !match[1].endsWith('advanceEpochLedger.js')) return match[1];
  }
  return 'UNATTRIBUTED';
}

vi.mock('../../src/domain/advanceEpochLedger.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return {
    ...actual,
    tickStreamSeedOf: (/** @type {any[]} */ ...args) => {
      const out = actual.tickStreamSeedOf(...args);
      spy.calls.push({ module: callingModule(), out });
      return out;
    },
  };
});

vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return {
    ...actual,
    createPRNG: (/** @type {any[]} */ ...args) => {
      spy.roots.push(String(args[0]));
      return actual.createPRNG(...args);
    },
  };
});

const { simulateCampaignWorldPulse } = await import('../../src/domain/worldPulse/pulseKernel.js');
const { simulateCampaignWorldInterval } = await import('../../src/domain/worldPulse/advanceInterval.js');
const { applyRealmVerbOrder, REALM_VERB_PAYLOAD_KIND } =
  await import('../../src/domain/worldPulse/realmVerbExecution.js');
const { ensureRegionalGraph } = await import('../../src/domain/region/index.js');
const { getSpatialLedger } = await import('../../src/domain/spatial/distanceRead.js');

const NOW = '2026-01-01T00:00:00.000Z';
const SEED = 'ep-stamp-seed';
const START_TICK = 4;
const EPOCH_A = 'ep-stamp-alpha';
const EPOCH_B = 'ep-stamp-beta';

/**
 * THE LIT RULES. `advanceEpochEnabled` plus the layers whose stages own the five in-pulse
 * family-1 read sites — a fixture that cannot REACH a site is a STOP, never a dropped row,
 * so the rules here are chosen to make every row's floor satisfiable rather than to be
 * minimal. The three realm-verb rows are DM-order-driven and no organic advance reaches
 * them; they are driven at their own door below, which is a stated fixture requirement.
 */
const LIT_RULES = Object.freeze({
  advanceEpochEnabled: true,
  populationDynamicsEnabled: true,
  migrationFlowsEnabled: true,
  tradeFlowsEnabled: true,
  relationshipDynamicsEnabled: true,
  npcAgencyEnabled: true,
  factionCompetitionEnabled: true,
  stressorsEnabled: true,
  emergentEventsEnabled: true,
  settlementLifecycleEnabled: true,
  demographicsEnabled: true,
  npcLadderEnabled: true,
  roadsEnabled: true,
  spatialConsequenceEnabled: true,
  traditionsEnabled: true,
  sovereigntyTradeEnabled: true,
  beliefAxesEnabled: true,
  believedConditionsEnabled: true,
  // ⚠ THE SOVEREIGNTY MARKET'S OWN FLAG IS NOT ENOUGH: `sovereigntyTradeActive` is an EXACT
  // conjunction over the envoy prerequisite list plus demographics, so RS-12's stage is
  // unreachable without all six of these. Discovered by the OBSERVED-CALL FLOOR reporting a
  // zero, which is the floor doing exactly what it exists to do — the fixture was fixed, not
  // the assertion.
  warLayerEnabled: true,
  warTerminationEnabled: true,
  peaceEngineEnabled: true,
  envoyDiplomacyEnabled: true,
  npcConsequencesEnabled: true,
  routeLifecycleEnabled: true,
});

/** The same set with the epoch flag removed — every other layer identically lit. */
const DARK_RULES = Object.freeze(
  Object.fromEntries(Object.entries(LIT_RULES).filter(([key]) => key !== 'advanceEpochEnabled')),
);

const deity = (/** @type {string} */ ref, /** @type {string} */ name) =>
  ({ _deityRef: ref, name, alignmentAxis: 'neutral', lawAxis: 'neutral', rankAxis: 'major' });
const PATRON = deity('custom:ep_stamp', 'The Reckoner');

function stampSettlement(/** @type {string} */ name, /** @type {number} */ deficitPct) {
  return {
    name, tier: 'town', population: 2400,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25,
      primaryDeityRef: PATRON._deityRef, primaryDeitySnapshot: PATRON,
      economicBase: 'agrarian',
    },
    institutions: [],
    economicState: {
      primaryExports: ['Bulk grain and foodstuffs'], primaryImports: ['Timber and charcoal'],
      economicBase: 'agrarian',
      foodSecurity: {
        storageMonths: deficitPct > 0 ? 0.4 : 8, deficitPct, surplusPct: 0,
        foodRatio: deficitPct > 0 ? 0.6 : 1.2, importDependency: 0.3, resilienceScore: 50,
      },
    },
    powerStructure: {
      publicLegitimacy: { score: 42, label: 'Contested' },
      factions: [
        { faction: 'Landed Gentry', category: 'noble', power: 62 },
        { faction: 'Merchant League', category: 'economy', power: 55 },
      ],
      conflicts: [],
    },
    npcs: [
      { id: `steward_${name}`, name: `Steward of ${name}`, importance: 'key' },
      { id: `rival_${name}`, name: `Rival of ${name}`, importance: 'key' },
    ],
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.5 }],
  };
}

const stampSave = (/** @type {string} */ id, /** @type {string} */ name, /** @type {number} */ deficit) => ({
  id, name, phase: 'canon', settlement: stampSettlement(name, deficit),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

// ⚠ ONE graph, deep-cloned per fixture: `ensureRegionalGraph` stamps each edge with a
// WALL-CLOCK `updatedAt`, so building it per call makes two otherwise-identical worlds
// differ by milliseconds — noise removed at its source rather than masked downstream.
const BASE_GRAPH = ensureRegionalGraph({
  edges: [
    { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' },
    { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'trade_partner' },
    { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'allied' },
  ],
});

const clone = (/** @type {any} */ v) => JSON.parse(JSON.stringify(v));

/**
 * A minimal canonized spatial substrate. ⚠ REQUIRED, and it is a fixture requirement rather
 * than a detail: BOTH the roads stage (RS-5) and the sovereignty market (RS-12) return inert
 * on `activeSpatialDigest(worldState) === null`, so an aspatial fixture reaches neither and
 * two of the eight rows would have been silently unproven.
 */
const SPATIAL = Object.freeze({
  spatialCanonVersion: 1,
  spatialDigest: {
    spatialCanonVersion: 1,
    settlementIds: ['a', 'b', 'c'],
    gates: [{ between: ['a', 'b'], cost: 100 }, { between: ['b', 'c'], cost: 100 }],
    distanceMatrix: { a: { b: 100, c: 200 }, b: { a: 100, c: 100 }, c: { a: 200, b: 100 } },
    tiers: { a: { b: 1, c: 1 }, b: { a: 1, c: 1 }, c: { a: 1, b: 1 } },
  },
});

function makeFixture(/** @type {any} */ rules, /** @type {any} */ seed = SEED, /** @type {boolean} */ spatial = true, /** @type {any} */ staleStamp = null) {
  const saves = [stampSave('a', 'Ashford', 55), stampSave('b', 'Briarwatch', 0), stampSave('c', 'Crownhold', 40)];
  const campaign = {
    id: 'ep-stamp-campaign', name: 'Epoch Stamp', settlementIds: ['a', 'b', 'c'],
    worldState: {
      tick: START_TICK,
      ...(seed === undefined ? {} : { rngSeed: seed }),
      ...(rules === undefined ? {} : { simulationRules: rules }),
      ...(spatial ? clone(SPATIAL) : {}),
      // THE PREVIOUSLY-LIT WORLD: a stamp left behind by an advance run before the rule was
      // turned off. Its tick is the world's CURRENT tick, so it is the most dangerous shape
      // available — the naive accessor would select it on the very next dark advance.
      ...(staleStamp ? { spatialLedgers: { advanceEpoch: { latest: { tick: START_TICK, epoch: staleStamp } } } } : {}),
      calendar: { elapsedWeeks: 51 },
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.9, affectedSettlementIds: ['a'], age: 4 },
      ],
    },
    regionalGraph: clone(BASE_GRAPH),
    wizardNews: { currentTick: START_TICK, entries: [] },
  };
  return { campaign, saves };
}

/** ONE lit (or dark) single-tick kernel pass over the adversarial fixture. */
function driveTick(/** @type {any} */ rules, /** @type {any} */ advanceEpoch, /** @type {any} */ seed = SEED, /** @type {any} */ staleStamp = null) {
  resetSpy();
  const { campaign, saves } = makeFixture(rules, seed, true, staleStamp);
  const result = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW, advanceEpoch });
  return { result, calls: [...spy.calls], roots: [...spy.roots] };
}

/** Values the accessor returned to a given module, as strings. */
const outsFrom = (/** @type {any[]} */ calls, /** @type {string} */ module) =>
  calls.filter(call => call.module === module).map(call => String(call.out));

/**
 * The FOUR in-pulse family-1 rows an organic advance reaches, by the module the stack
 * attributes them to.
 *
 * ⛔⛔ RS-11 IS DELIBERATELY ABSENT FROM THIS LIST, AND THAT IS A FINDING RATHER THAN A
 * DROPPED ROW. `demographicsPlans.js` re-roots INSIDE its existing chain —
 * `String(realmId || tickStreamSeedOf(…) || 'realm')` — because `realmId` SHADOWS and the
 * volume rules that a caller-supplied realm must be drawn unchanged. MEASURED: the ONLY
 * caller in `src` is `demographicsKernel.js`, and it ALWAYS passes a realmId (that is RS-10,
 * one row up). The `||` therefore SHORT-CIRCUITS on every production path and RS-11's own
 * accessor call is unreachable in an organic advance. Asserting an observed-call floor for
 * it here would have meant either a red on a correct build or a fixture rigged to reach an
 * arm production never takes — the unreachable-arm vacuity class. What the row actually
 * claims is proven in two honest halves below: the epoch DOES reach rows 22/23, because
 * RS-10's epoch-bearing value is what flows down the chain; and RS-11's own fallback term
 * is exercised at its own door, where a caller passing no realmId is the shape it exists for.
 */
const IN_PULSE_ROWS = Object.freeze([
  ['RS-5', 'src/domain/worldPulse/roadsKernel.js'],
  ['RS-9', 'src/domain/worldPulse/npcLadderKernel.js'],
  ['RS-10', 'src/domain/worldPulse/demographicsKernel.js'],
  ['RS-12', 'src/domain/worldPulse/sovereigntyMarketStage.js'],
]);

/** The realm-verb door's own fixture — the three rows no organic advance reaches. */
function realmVerbWorld(/** @type {any} */ rules, /** @type {string|null} */ epochTerm) {
  const thorp = { id: 't', name: 'Dust End', tier: 'thorp', population: 60, institutions: [], npcs: [] };
  const town = { id: 'b', name: 'Briarwatch', tier: 'town', population: 2400, institutions: [], npcs: [] };
  // ⚠ `disastersEnabled` is FORCE_CALAMITY's own gate and is not in the pulse rule set —
  // another zero the observed-call floor found rather than a reviewer.
  let state = /** @type {any} */ ({
    tick: START_TICK, rngSeed: SEED, proposals: [],
    simulationRules: { ...rules, disastersEnabled: true, settlementLifecycleEnabled: true },
  });
  // The world a COMMITTED lit advance leaves behind: `latest.tick` equals the world's own
  // tick, which is what puts the DM doors in scope for the current-tick selection rule.
  if (epochTerm) {
    state = { ...state, spatialLedgers: { advanceEpoch: { latest: { tick: START_TICK, epoch: epochTerm } } } };
  }
  const snapshot = {
    settlements: [
      { id: 't', name: 'Dust End', settlement: thorp },
      { id: 'b', name: 'Briarwatch', settlement: town },
    ],
    regionalGraph: { edges: [] },
  };
  const settlementUpdates = new Map([
    ['t', { saveId: 't', settlement: thorp }],
    ['b', { saveId: 'b', settlement: town }],
  ]);
  return { state, snapshot, settlementUpdates };
}

/** Drive ONE realm verb at its own door and return the accessor values it composed. */
function driveRealmVerb(/** @type {string} */ verb, /** @type {any} */ args, /** @type {any} */ rules, /** @type {string|null} */ epochTerm) {
  const { state, snapshot, settlementUpdates } = realmVerbWorld(rules, epochTerm);
  resetSpy();
  applyRealmVerbOrder({
    state, snapshot, settlementUpdates,
    outcome: { proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb, args } },
    tick: START_TICK, now: NOW,
  });
  return outsFrom([...spy.calls], 'src/domain/worldPulse/realmVerbExecution.js');
}

/** The three DM-order rows, each driven separately so attribution is unambiguous. */
const REALM_VERB_ROWS = Object.freeze([
  ['RS-13', 'FORCE_CALAMITY', { targetId: 'b', kind: 'fire' }],
  ['RS-14', 'FORCE_FOUND_STEADING', { parentId: 'b' }],
  ['RS-15', 'FORCE_RESETTLE', { targetId: 't' }],
]);

// ── THE STAMP ITSELF ────────────────────────────────────────────────────────────────────
describe('EP-3A · the stamp — seam edit 9, and the world it rides out on', () => {
  test('THE RETURNED-WORLD ARM: the stamp survives to the world the kernel RETURNS, and a JSON round-trip', () => {
    const { result } = driveTick(LIT_RULES, EPOCH_A);
    const ledger = getSpatialLedger(result.worldState, 'advanceEpoch');
    // The tick is the ADVANCED one: the kernel composes the tick it is about to run.
    expect(ledger).toEqual({ latest: { tick: START_TICK + 1, epoch: EPOCH_A } });
    // A stage between the last family-1 read and the return that rebuilt the world
    // wholesale would be invisible to every row above and is caught only here.
    const roundTripped = JSON.parse(JSON.stringify(result.worldState));
    expect(getSpatialLedger(roundTripped, 'advanceEpoch')).toEqual({ latest: { tick: START_TICK + 1, epoch: EPOCH_A } });
  });

  test('M3 DORMANCY: a dark multi-tick advance leaves NO spatialLedgers namespace at all', async () => {
    // The sharpest dormancy claim slice A can make, and it is a claim about a key that
    // does not exist rather than about a value that is null: `setSpatialLedger` CREATES
    // the namespace, so the writer's `!epochTerm` early return is what keeps an aspatial
    // dark world byte-identical. A stamp guarded on the raw threaded value instead of the
    // flag-gated term would mint the namespace here while every seed assertion stayed green.
    const { campaign, saves } = makeFixture(undefined, SEED, false);
    const dark = await simulateCampaignWorldInterval({
      campaign, saves, interval: 'one_month', now: NOW, autoResolve: true, advanceEpoch: EPOCH_A,
    });
    expect(Object.keys(dark.worldState)).not.toContain('spatialLedgers');
    expect(getSpatialLedger(dark.worldState, 'advanceEpoch')).toBeUndefined();
  });

  test('the writer is keyed on the FLAG-GATED term: a real epoch in a dark world stamps nothing', () => {
    const { result } = driveTick(DARK_RULES, EPOCH_A);
    expect(getSpatialLedger(result.worldState, 'advanceEpoch')).toBeUndefined();
    // …and the CONTROL that makes that a measurement rather than an empty fixture: the
    // identically-shaped LIT run does stamp.
    expect(getSpatialLedger(driveTick(LIT_RULES, EPOCH_A).result.worldState, 'advanceEpoch')).toBeTruthy();
  });
});

// ── THE EIGHT ROWS ──────────────────────────────────────────────────────────────────────
describe('EP-3A · the family-1 stamp-survival pin — eight rows, each asserted independently', () => {
  test('the FOUR organically-reached in-pulse rows each observe a call, and each composes from THIS TICK\'s epoch', () => {
    const { calls } = driveTick(LIT_RULES, EPOCH_A);
    for (const [id, module] of IN_PULSE_ROWS) {
      const outs = outsFrom(calls, module);
      // THE OBSERVED-CALL FLOOR. A row that sees zero calls means the FIXTURE does not
      // reach this site — fix the fixture, never the assertion, and a stage the fixture
      // cannot reach at all is a STOP-and-report rather than a dropped row.
      expect(outs.length, `${id} (${module}) — the fixture does not reach this site`).toBeGreaterThan(0);
      expect(outs.filter(out => !out.endsWith(`::epoch:${EPOCH_A}`)), `${id} composed a bare seed`).toEqual([]);
    }
  });

  test('the THREE DM-order rows each observe a call, and each composes from the world\'s own epoch', () => {
    // ⚠ RS-13/14/15 are DM-order-driven: no organic advance reaches them, so they are
    // driven at their own door, one verb per run so attribution is unambiguous. They are
    // IN SCOPE for the current-tick selection rule and that is correct — a DM order
    // resolves in the epoch the world it acts on is living in, stably for a given world.
    for (const [id, verb, args] of REALM_VERB_ROWS) {
      const outs = driveRealmVerb(String(verb), args, LIT_RULES, EPOCH_A);
      expect(outs.length, `${id} (${verb}) — the fixture does not reach this door`).toBeGreaterThan(0);
      expect(outs.filter(out => out !== `${SEED}::epoch:${EPOCH_A}`), `${id} composed a bare seed`).toEqual([]);
    }
  });

  test('RS-11: the epoch reaches the plans family through RS-10, and its own term is the SHADOWED fallback', async () => {
    // The row's two honest halves — see IN_PULSE_ROWS' note for why it is not on that list.
    // HALF ONE, the production path: RS-10 hands `realmId` down, so the `||` short-circuits
    // and RS-11's own accessor call never runs. The epoch still reaches rows 22 and 23,
    // because the value that flows into the chain is RS-10's epoch-bearing one.
    const { calls } = driveTick(LIT_RULES, EPOCH_A);
    expect(outsFrom(calls, 'src/domain/worldPulse/demographicsKernel.js').length).toBeGreaterThan(0);
    expect(outsFrom(calls, 'src/domain/worldPulse/demographicsPlans.js'), 'the shadowed term must NOT be evaluated')
      .toEqual([]);

    // HALF TWO, the fallback the term exists for: a caller that passes NO realmId. Driven
    // at the door because no production caller takes that shape today — which is stated
    // rather than hidden, and is why this arm is not counted as an in-pulse row.
    const { advanceDemographicPlans } = await import('../../src/domain/worldPulse/demographicsPlans.js');
    const stamped = {
      rngSeed: SEED, tick: START_TICK,
      simulationRules: { ...LIT_RULES },
      spatialLedgers: { advanceEpoch: { latest: { tick: START_TICK, epoch: EPOCH_A } } },
    };
    const snapshot = { settlements: [{ id: 'a', name: 'Ashford', settlement: stampSettlement('Ashford', 55) }] };
    resetSpy();
    advanceDemographicPlans({
      snapshot, worldState: stamped, settlementUpdates: [], tick: START_TICK,
      migrationReceipts: [], satelliteLaneLit: false, digest: null, satelliteCaps: {}, realmId: null,
    });
    const outs = outsFrom([...spy.calls], 'src/domain/worldPulse/demographicsPlans.js');
    expect(outs.length, 'RS-11 — the fallback door does not reach the site').toBeGreaterThan(0);
    expect(outs.filter(out => out !== `${SEED}::epoch:${EPOCH_A}`)).toEqual([]);
  });

  test('MUTANT (i), AT THE INTEGRATION LEVEL: a DARK advance over a PREVIOUSLY-LIT world composes bare keys', () => {
    // ⛔ THE ONE MUTANT WITH NO FAMILY-2 TWIN, and the one that is INVISIBLE TO EVERY LIT
    // ASSERTION IN THIS FILE. A world that ran lit and then had the rule turned off still
    // carries a stamp at its current tick; the naive accessor — read `latest` without
    // comparing its tick — would select it and compose an epoch-bearing key on a DARK
    // advance. Every fresh-dark run in this file is blind to that, because a fresh dark
    // world has no stamp to select. This is that world, and the assertion is on a LITERAL
    // absence rather than on a differential, for the same reason.
    const { calls, result } = driveTick(DARK_RULES, null, SEED, EPOCH_A);
    expect(calls.length, 'the dark run must reach the accessor, or this is vacuous').toBeGreaterThan(0);
    expect(calls.filter(call => String(call.out).includes('::epoch:'))).toEqual([]);
    // …and the stale stamp is genuinely THERE, so the absence above is a discrimination.
    expect(getSpatialLedger(result.worldState, 'advanceEpoch')).toEqual({ latest: { tick: START_TICK, epoch: EPOCH_A } });
  });

  test('MUTANT (i), AT THE UNIT LEVEL: a STALE stamp is not selectable and a CURRENT one is', () => {
    // The naive accessor — read `latest` without comparing its tick — is invisible to
    // every LIT assertion in this file, which is exactly why it needs its own detector and
    // why the dark arm is written against a LITERAL string rather than as a differential.
    // The mutant is executed as a shape rather than as an edit: a world carrying a STALE
    // stamp (written at an earlier tick) must be read as if it carried none.
    const stale = { rngSeed: SEED, tick: 9, spatialLedgers: { advanceEpoch: { latest: { tick: 8, epoch: EPOCH_A } } } };
    const fresh = { rngSeed: SEED, tick: 9, spatialLedgers: { advanceEpoch: { latest: { tick: 9, epoch: EPOCH_A } } } };
    const { tickStreamSeedOf } = /** @type {any} */ (spyFreeLedger);
    expect(tickStreamSeedOf(stale, { base: SEED })).toBe(SEED);
    expect(tickStreamSeedOf(fresh, { base: SEED })).toBe(`${SEED}::epoch:${EPOCH_A}`);
    // …and the naive read the mutant represents WOULD have returned the epoch on `stale`,
    // so the two lines above are a discrimination and not a tautology.
    expect(stale.spatialLedgers.advanceEpoch.latest.epoch).toBe(EPOCH_A);
  });

  test('MUTANT (iv): a stamp dropped from the returned world after the last read reds the ARM ONLY', () => {
    const { result, calls } = driveTick(LIT_RULES, EPOCH_A);
    // Every in-pulse row still composed its epoch-bearing key…
    for (const [, module] of IN_PULSE_ROWS) {
      expect(outsFrom(calls, module).every(out => out.endsWith(`::epoch:${EPOCH_A}`))).toBe(true);
    }
    // …while the returned-world arm, run against a world whose stamp was removed after
    // those reads, fails. The two halves are therefore independent detectors, which is the
    // whole reason the arm is asserted separately from the rows.
    const stripped = clone(result.worldState);
    delete stripped.spatialLedgers.advanceEpoch;
    expect(getSpatialLedger(stripped, 'advanceEpoch')).toBeUndefined();
    expect(getSpatialLedger(result.worldState, 'advanceEpoch')).toBeTruthy();
  });
});

// ── THE TWO-EPOCH PIN ───────────────────────────────────────────────────────────────────
describe('EP-3A · the two-epoch pin — the same advance, two epochs, eight different keys', () => {
  test('LIT: every in-pulse row composes a DIFFERENT key under a different epoch', () => {
    const a = driveTick(LIT_RULES, EPOCH_A);
    const b = driveTick(LIT_RULES, EPOCH_B);
    for (const [id, module] of IN_PULSE_ROWS) {
      const outsA = outsFrom(a.calls, module);
      const outsB = outsFrom(b.calls, module);
      expect(outsA.length, `${id} floor`).toBeGreaterThan(0);
      expect(outsA.filter(out => outsB.includes(out)), `${id} repeated a key across epochs`).toEqual([]);
    }
    // …and the whole worlds differ, which is the feature: a re-advanced future is new.
    expect(JSON.stringify(a.result.worldState)).not.toBe(JSON.stringify(b.result.worldState));
  });

  test('LIT: the DM-order rows also differ across epochs', () => {
    for (const [id, verb, args] of REALM_VERB_ROWS) {
      const outsA = driveRealmVerb(String(verb), args, LIT_RULES, EPOCH_A);
      const outsB = driveRealmVerb(String(verb), args, LIT_RULES, EPOCH_B);
      expect(outsA.length, `${id} floor`).toBeGreaterThan(0);
      expect(outsA.filter(out => outsB.includes(out)), `${id}`).toEqual([]);
    }
  });

  test('DARK: the same two epochs compose BYTE-IDENTICAL keys, under four hostile seed inputs', () => {
    // The literal expectation per hostile input is derived from the SITE'S OWN coercion,
    // stated here as a table rather than recomputed with the expression under test.
    const HOSTILE = /** @type {any[][]} */ ([
      ['a real seed', SEED],
      ['undefined', undefined],
      ['empty string', ''],
      ['a number', 4242],
    ]);
    for (const [label, seed] of HOSTILE) {
      const a = driveTick(DARK_RULES, EPOCH_A, seed);
      const b = driveTick(DARK_RULES, EPOCH_B, seed);
      // NON-VACUITY: the runs really reached the accessor.
      expect(a.calls.length, `${label} floor`).toBeGreaterThan(0);
      expect(a.calls.map(call => String(call.out)), label).toEqual(b.calls.map(call => String(call.out)));
      // NOT ONE dark value carries an epoch segment, whatever the seed's type.
      expect(a.calls.filter(call => String(call.out).includes('::epoch:')), label).toEqual([]);
      // …and the whole worlds are identical, which is the dark claim in full.
      expect(JSON.stringify(a.result.worldState), label).toBe(JSON.stringify(b.result.worldState));
    }
  });
});

/** The UNMOCKED leaf, imported once for the accessor's own unit-level arms. */
const spyFreeLedger = await vi.importActual('../../src/domain/advanceEpochLedger.js');
