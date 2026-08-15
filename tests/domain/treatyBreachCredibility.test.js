/**
 * treatyBreachCredibility.test.js — GR-4c's acceptance battery (C1–C7).
 *
 * THE CLOSED DENOMINATOR, and it is closed: seven cases, no eighth. C8 (the privacy
 * boundary) is OMITTED rather than replaced — GR-4c mints no beat and no audience
 * projection; the succession voice is GR-4b-α's and it is terminal.
 *
 * ⚠ STRAIGHT-LINE REGISTRATION ONLY. A `test(`/`it(` registered inside a loop is
 * TEST_UNREGISTERED to the estate's lighting census and PARKS THE WHOLE FILE, losing
 * every other title in it; `.each()` parks the same way. Every case below is registered
 * at the top level of its describe, and every loop lives INSIDE an `it`.
 *
 * ⚠ THE FILE NAME AND HOME ARE PART OF THE CONTRACT. `mutationCoverage.shared.mjs`
 * makes a file a governed invariant automatically by living in one of seven enforcer
 * dirs or by a basename matching `census|scan|baseline|ratchet|walker|…|contract|pin`.
 * This file sits in `tests/domain/` and matches none of them, so it is an ordinary
 * behavior battery. That dodge is deliberate and is lost to a rename.
 *
 * WHAT THIS BATTERY IS ABOUT. `spatialLedgers.credibility` shipped with a live reader
 * chain — `credibilityScoreOf` → `reserveFor` → `OATHBREAKER_PENALTY` — and no producer
 * on the other side: no treaty breach had ever written a credibility delta, so a court
 * could tear up one oath after another and every counterparty went on treating its word
 * as good. GR-4c closes that seam on both roads at once, AT THE BREACH rather than at a
 * later fold — see the leaf's own note on the dead fracture window.
 */
import { describe, expect, it } from 'vitest';

import { repudiateTreaty } from '../../src/domain/worldPulse/treatyBreach.js';
import {
  BREACH_CREDIBILITY_TUNING, breachCredibilityDeltas,
} from '../../src/domain/worldPulse/treatyBreachCredibility.js';
import {
  CREDIBILITY_TUNING, advanceCredibility, credibilityScoreOf, credibilityWeight,
} from '../../src/domain/worldPulse/informationStatecraft.js';
import { PACT_FORMATION_TUNING } from '../../src/domain/worldPulse/pactFormation.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';

const WAR = { warLayerEnabled: true, peaceEngineEnabled: true };
/**
 * Both roads' gate: the oath layer lit AND the information layer lit. `infoMode` is
 * load-bearing and not decoration — `beliefsActive` reads it through `infoModeOf`, which
 * DEFAULTS to `'omniscient'`, and an omniscient world has no belief layer to charge. A
 * fixture that set only the two flags would leave `advanceCredibility` self-gated dark
 * and every assertion below would measure the fixture instead of the feature.
 */
const BOTH_LIT = {
  ...WAR, oathHolderEnabled: true, infoStatecraftEnabled: true, infoMode: 'unreliable',
};
const TICK = 20;
const KEY = 'crown>march';
const SECOND_KEY = 'march>north';
const FALLEN = 'npc_old';
const CHARGE = BREACH_CREDIBILITY_TUNING.CHARGE_BASE;
/** The signed fall one unit of charge buys, through the landed fold's own constant. */
const FALL = CREDIBILITY_TUNING.FRACTURE_FALL_W;

/** A live non-aggression pact — the instrument the DM verb's own predicate requires. */
function nap(patch = {}) {
  return {
    type: 'non_aggression', family: 'security', magnitude: 0.4, mintedTick: 0,
    expiresTick: 60, weightSpent: 0.4, complianceState: 'honored', trueState: 'honored',
    burden01: 0.9, receipt: 'non_aggression term', ...patch,
  };
}

/** One treaty record between `parties`, optionally stamped with the fallen holder's oath. */
function treaty({ parties = ['crown', 'march'], sworn = null, terms = null } = {}) {
  return {
    parties, victorId: parties[0], loserId: parties[1], mintedTick: 0,
    believedMarginAtSignature: 0.35, budgetGranted: 3, budgetSpent: 1,
    complianceState: 'honored', receipts: ['pin'],
    terms: terms || [nap()],
    ...(sworn ? { sworn } : {}),
  };
}

/**
 * A world carrying the given treaty ledger. `spatialCanonVersion` is what `beliefsActive`
 * reads, and `advanceCredibility` self-gates on `infoStatecraftActive` — which is
 * `beliefsActive` ∧ `infoStatecraftEnabled === true`.
 */
function world({ rules = BOTH_LIT, treaties = null, canon = 1 } = {}) {
  return {
    tick: TICK,
    spatialCanonVersion: canon,
    simulationRules: { ...rules },
    calendar: { elapsedWeeks: 30 },
    deployments: {},
    relationshipStates: {},
    spatialLedgers: { treaties: treaties || { [KEY]: treaty() } },
  };
}

/** The two-instrument world C4's order-independence claim needs, both sworn by `march`. */
function twoInstrumentWorld() {
  const stamp = { march: { npcId: FALLEN, name: 'Old March', swornTick: 2 } };
  return world({
    treaties: {
      [KEY]: treaty({ parties: ['crown', 'march'], sworn: stamp }),
      [SECOND_KEY]: treaty({ parties: ['march', 'north'], sworn: stamp }),
    },
  });
}

/**
 * GR-4a's two graded succession severities, and the DM road's ungraded one. They are the
 * grades `treatySuccession.js` authors — a coup-born seat pays least, a lineal heir more,
 * and only the DM's open repudiation carries the full 1.
 */
const COUP_BORN_SEVERITY = 0.35;
const LINEAL_SEVERITY = 0.75;
const OPEN_REPUDIATION_SEVERITY = 1;

/** A succession question as `treatySuccession.js` derives it, at the severity under test. */
function question({ severity01, treatyKey = KEY, otherId = 'crown' }) {
  const lineal = severity01 === LINEAL_SEVERITY;
  return {
    treatyKey,
    settlementId: 'march',
    otherId,
    npcId: FALLEN,
    cause: lineal ? 'succession' : 'coup',
    kind: lineal ? 'lineal' : 'coup_born',
    answer: 'disavow',
    severity01,
    pressure01: 0.9,
  };
}

const credibilityOf = (worldState) => getSpatialLedger(worldState, 'credibility') || {};
const scoreOf = (worldState, id) => (credibilityOf(worldState)[id] || {}).score;

/** Break one instrument on the DM's open-repudiation road. */
const openRepudiation = (worldState, { fromId = 'crown', toId = 'march', tick = TICK } = {}) =>
  repudiateTreaty(worldState, { fromId, toId, tick });

/** Break one instrument on the heir's disavowal road, at a chosen grade. */
const disavowal = (worldState, args, tick = TICK) =>
  repudiateTreaty(worldState, { tick, succession: question(args) });

// ── C1) MAIN REACHABLE BEHAVIOR ────────────────────────────────────────────────
describe('GR-4c C1 — a torn-up oath charges the breaker at the act', () => {
  it('an open repudiation charges the breaker exactly -0.4, in the value repudiateTreaty RETURNS', () => {
    const breached = openRepudiation(world());
    // THE FIXTURE IS ADVERSARIAL FIRST: the breach really happens, so the charge below
    // measures GR-4c rather than a drive that broke nothing.
    expect(breached.ok).toBe(true);
    expect(breached.treatyKeys).toEqual([KEY]);
    // THE CHARGE IS IN THE RETURNED VALUE, which is what proves it is written at the ACT
    // rather than by a later fold: the tick-windowed fracture fold runs ~507 lines AHEAD
    // of the treaty writer in the same pulse call, so it cannot see a record written
    // after it. This assertion is what forecloses that mount.
    expect(credibilityOf(breached.worldState).crown)
      .toEqual({ score: -0.4, lastUpdateTick: TICK, holder: 'people_held' });
    // …and -0.4 is the landed constants' own arithmetic rather than a transcribed number:
    // CHARGE_BASE 0.05 × severity01 1 × FRACTURE_FALL_W 8.
    expect(scoreOf(breached.worldState, 'crown'))
      .toBeCloseTo(-(CHARGE * OPEN_REPUDIATION_SEVERITY * FALL), 10);
  });
});

// ── C2) BOUNDARY — THE GRADING IS CARRIED, NOT RE-AUTHORED ─────────────────────
describe('GR-4c C2 — the severity GR-4a graded is the severity that is charged', () => {
  it('coup-born charges strictly less than lineal, and both strictly less than an open repudiation', () => {
    const coupBorn = disavowal(twoInstrumentWorld(), { severity01: COUP_BORN_SEVERITY });
    const lineal = disavowal(twoInstrumentWorld(), { severity01: LINEAL_SEVERITY });
    const open = openRepudiation(world());
    expect([coupBorn.ok, lineal.ok, open.ok]).toEqual([true, true, true]);
    // ONE ASSERTION CHAIN, and it runs the way the design says a world reads a broken
    // oath: a seat that SEIZED power pays least, because everyone watched the line break;
    // a lineal heir pays more, having taken the crown on the continuity he now denies;
    // and tearing up your OWN word costs most of all.
    const charges = [-scoreOf(coupBorn.worldState, 'march'), -scoreOf(lineal.worldState, 'march'),
      -scoreOf(open.worldState, 'crown')];
    expect(charges[0]).toBeLessThan(charges[1]);
    expect(charges[1]).toBeLessThan(charges[2]);
    expect(charges).toEqual([0.14, 0.3, 0.4]);
  });

  it('the three magnitudes are exactly CHARGE_BASE times the three graded severities', () => {
    const magnitudeAt = (severity01) => breachCredibilityDeltas(
      { breachType: 'succession_repudiation', severity01, defaultedBy: 'march' },
    )[0].magnitude01;
    expect(magnitudeAt(COUP_BORN_SEVERITY)).toBeCloseTo(CHARGE * COUP_BORN_SEVERITY, 10);
    expect(magnitudeAt(LINEAL_SEVERITY)).toBeCloseTo(CHARGE * LINEAL_SEVERITY, 10);
    expect([magnitudeAt(COUP_BORN_SEVERITY), magnitudeAt(LINEAL_SEVERITY)])
      .toEqual([0.0175, 0.0375]);
    expect(breachCredibilityDeltas(
      { breachType: 'repudiation', severity01: OPEN_REPUDIATION_SEVERITY, defaultedBy: 'crown' },
    )).toEqual([{ id: 'crown', kind: 'fracture', magnitude01: CHARGE }]);
  });

  it('the leaf is TOTAL: every malformed verdict answers with no delta rather than throwing', () => {
    // The loop lives INSIDE the `it`, never around it — a test registered in a loop is
    // TEST_UNREGISTERED and parks this whole file.
    const refused = [
      null, undefined, 42, 'repudiation', [],
      { breachType: 'repudiation', severity01: 1, defaultedBy: '   ' },
      { breachType: 'repudiation', severity01: Number.NaN, defaultedBy: 'crown' },
      { breachType: 'ordinary_default', severity01: 1, defaultedBy: 'crown' },
      { severity01: 1, defaultedBy: 'crown' },
    ];
    for (const verdict of refused) {
      expect(breachCredibilityDeltas(verdict), JSON.stringify(verdict) || 'undefined').toEqual([]);
    }
  });
});

// ── C3) ABSENT / DISABLED — TWO AXES ───────────────────────────────────────────
describe('GR-4c C3 — dark on either flag, nothing moves', () => {
  it('with oathHolderEnabled absent, and separately explicit false, a breach charges nothing on either road', () => {
    const absent = { ...WAR, infoStatecraftEnabled: true, infoMode: 'unreliable' };
    const explicitFalse = { ...absent, oathHolderEnabled: false };
    const openAbsent = openRepudiation(world({ rules: absent }));
    const openFalse = openRepudiation(world({ rules: explicitFalse }));
    const heirAbsent = disavowal(
      world({ rules: absent, treaties: twoInstrumentWorld().spatialLedgers.treaties }),
      { severity01: LINEAL_SEVERITY },
    );
    // THE ANCHOR: all three drives really do break their instrument, so the three empty
    // ledgers below measure the FLAG and not a fixture nothing could move.
    expect([openAbsent.ok, openFalse.ok, heirAbsent.ok]).toEqual([true, true, true]);
    expect(getSpatialLedger(openAbsent.worldState, 'credibility')).toBeUndefined();
    expect(getSpatialLedger(openFalse.worldState, 'credibility')).toBeUndefined();
    expect(getSpatialLedger(heirAbsent.worldState, 'credibility')).toBeUndefined();
    // Dark-never-permissive: an unwritten flag and a flag written `false` are ONE answer.
    // Compared over the LEDGERS, because the rule bags themselves differ by construction.
    expect(JSON.stringify(openFalse.worldState.spatialLedgers))
      .toBe(JSON.stringify(openAbsent.worldState.spatialLedgers));
  });

  it('with oathHolderEnabled lit but infoStatecraftEnabled dark, the writer own-gates and nothing lands', () => {
    // The SECOND axis, and it is held one level deeper: the block is entered, and
    // `advanceCredibility` refuses at its own first line, returning the same reference.
    const oathOnly = { ...WAR, oathHolderEnabled: true, infoMode: 'unreliable' };
    const breached = openRepudiation(world({ rules: oathOnly }));
    expect(breached.ok).toBe(true);
    expect(getSpatialLedger(breached.worldState, 'credibility')).toBeUndefined();
    // …and the same holds when the belief layer itself is absent (an omniscient world
    // has nothing to be credible TO), which is the other half of `infoStatecraftActive`.
    const omniscient = openRepudiation(world({ rules: { ...BOTH_LIT, infoMode: 'omniscient' } }));
    expect(omniscient.ok).toBe(true);
    expect(getSpatialLedger(omniscient.worldState, 'credibility')).toBeUndefined();
  });
});

// ── C4) DUPLICATE / IDEMPOTENT + ORDER INDEPENDENCE ────────────────────────────
describe('GR-4c C4 — charged once, and the same however the tick is ordered', () => {
  it('re-running the same breach is refused by the eligibility predicate and charges nothing further', () => {
    const first = openRepudiation(world());
    expect(scoreOf(first.worldState, 'crown')).toBe(-0.4);
    const repeated = openRepudiation(first.worldState);
    // EXACTLY-ONCE IS STRUCTURAL, not a tick window and not a consume-once marker: the
    // instrument is already defaulted, so the predicate refuses it.
    expect(repeated.ok).toBe(false);
    expect(repeated.code).toBe('treaty_breach_no_live_nap');
    expect(scoreOf(repeated.worldState, 'crown')).toBe(-0.4);
  });

  it('two disavowals on two instruments in one tick both fold, and the ledger is order-independent', () => {
    const coup = { severity01: COUP_BORN_SEVERITY, treatyKey: KEY, otherId: 'crown' };
    const heir = { severity01: LINEAL_SEVERITY, treatyKey: SECOND_KEY, otherId: 'north' };
    const forward = disavowal(disavowal(twoInstrumentWorld(), coup).worldState, heir);
    const reverse = disavowal(disavowal(twoInstrumentWorld(), heir).worldState, coup);
    expect([forward.ok, reverse.ok]).toEqual([true, true]);
    // BOTH fold — the second is not swallowed by the first. After the first fold every
    // entry carries `lastUpdateTick: now`, so the second decays at age 0 (factor 1).
    expect(scoreOf(forward.worldState, 'march')).toBe(-0.44);
    expect(credibilityOf(forward.worldState)).toEqual(credibilityOf(reverse.worldState));
  });
});

// ── C5) WRITER → READER INTEGRATION: THE DESIGN'S HEADLINE CLAIM, AS ARITHMETIC ─
describe('GR-4c C5 — the door closes on the third open repudiation', () => {
  it('three successive repudiations drive the reserve oathbreaker term 0.140 → 0.278 → saturated', () => {
    // Three separate live instruments, torn up on three successive ticks. The consumer
    // is `reserveFor`'s own expression — `OATHBREAKER_PENALTY * clamp01(-score)` — read
    // through the estate's ONE credibility reader.
    const ledger = {
      'crown>march': treaty({ parties: ['crown', 'march'] }),
      'crown>north': treaty({ parties: ['crown', 'north'] }),
      'crown>south': treaty({ parties: ['crown', 'south'] }),
    };
    const term = (worldState, tick) => PACT_FORMATION_TUNING.OATHBREAKER_PENALTY
      * Math.min(1, Math.max(0, -credibilityScoreOf(worldState, 'crown', tick)));
    const one = openRepudiation(world({ treaties: ledger }), { toId: 'march', tick: TICK });
    const two = openRepudiation(one.worldState, { toId: 'north', tick: TICK + 1 });
    const three = openRepudiation(two.worldState, { toId: 'south', tick: TICK + 2 });
    expect([one.ok, two.ok, three.ok]).toEqual([true, true, true]);
    expect(term(one.worldState, TICK)).toBeCloseTo(0.14, 3);
    expect(term(two.worldState, TICK + 1)).toBeCloseTo(0.278, 3);
    // THE HEADLINE: the full penalty is reached ONLY at the third, so a counterparty that
    // would have signed at n=1 refuses at n=3.
    expect(term(three.worldState, TICK + 2)).toBe(PACT_FORMATION_TUNING.OATHBREAKER_PENALTY);
    expect(term(one.worldState, TICK)).toBeLessThan(PACT_FORMATION_TUNING.OATHBREAKER_PENALTY);
    expect(term(two.worldState, TICK + 1)).toBeLessThan(PACT_FORMATION_TUNING.OATHBREAKER_PENALTY);
  });
});

// ── C6) COUNTERFORCE — THE MARK IS NOT A RATCHET ───────────────────────────────
describe('GR-4c C6 — the mark fades, and it never distorts the belief economy', () => {
  it('the charge halves at the half-life, reads zero past the lookback, and prunes', () => {
    const breached = openRepudiation(world());
    const T = CREDIBILITY_TUNING;
    expect(credibilityScoreOf(breached.worldState, 'crown', TICK)).toBe(-0.4);
    expect(credibilityScoreOf(breached.worldState, 'crown', TICK + T.HALF_LIFE_TICKS))
      .toBeCloseTo(-0.2, 10);
    // Past MAX_LOOKBACK the mark is SPENT — a reformed lineage is pactable again.
    expect(credibilityScoreOf(breached.worldState, 'crown', TICK + T.MAX_LOOKBACK_TICKS + 1))
      .toBe(0);
    // …and the ledger itself drops the entry once it decays below the prune epsilon,
    // which is what makes a fully-faded world byte-identical to one that never charged.
    const swept = advanceCredibility({
      worldState: breached.worldState, tick: TICK + T.MAX_LOOKBACK_TICKS + 1, deltas: [],
    });
    expect(swept.changed).toBe(true);
    expect(getSpatialLedger(swept.worldState, 'credibility')).toBeUndefined();
  });

  it('after three open repudiations the corroboration weight is still at least 0.90', () => {
    const ledger = {
      'crown>march': treaty({ parties: ['crown', 'march'] }),
      'crown>north': treaty({ parties: ['crown', 'north'] }),
      'crown>south': treaty({ parties: ['crown', 'south'] }),
    };
    const one = openRepudiation(world({ treaties: ledger }), { toId: 'march', tick: TICK });
    const two = openRepudiation(one.worldState, { toId: 'north', tick: TICK + 1 });
    const three = openRepudiation(two.worldState, { toId: 'south', tick: TICK + 2 });
    // THE CHARGE BITES GR-2's ACCEPTANCE RESERVE, NOT THE CORROBORATION MATH. A mark
    // heavy enough to shut the treaty door is still a light touch on what the world
    // BELIEVES this court's reports are worth, which is the separation the band was
    // chosen to preserve.
    const weight = credibilityWeight(credibilityScoreOf(three.worldState, 'crown', TICK + 2));
    expect(weight).toBeGreaterThanOrEqual(0.9);
    expect(weight).toBeLessThan(1);
  });
});

// ── C7) LIFECYCLE ROUND TRIP ───────────────────────────────────────────────────
describe('GR-4c C7 — the stock outlives the instrument', () => {
  it('a charged entry survives a JSON round trip and re-decays correctly against a later tick', () => {
    const breached = openRepudiation(world());
    const revived = JSON.parse(JSON.stringify(breached.worldState));
    expect(credibilityOf(revived).crown)
      .toEqual({ score: -0.4, lastUpdateTick: TICK, holder: 'people_held' });
    // The decay is derived from the persisted `lastUpdateTick`, so it re-derives after a
    // save/load exactly as it did in memory — no in-session state carries it.
    expect(credibilityScoreOf(revived, 'crown', TICK + CREDIBILITY_TUNING.HALF_LIFE_TICKS))
      .toBeCloseTo(-0.2, 10);
  });

  it('a world whose treaty shell was pruned still carries the charge', () => {
    const breached = openRepudiation(world());
    const shell = breached.worldState.spatialLedgers.treaties[KEY];
    // The broken shell stays legible only until its promises' original horizon; past
    // `breachExpiresTick` a later wave may drop it entirely. The credibility mark is a
    // SEPARATE stock and must not vanish with the parchment that earned it.
    expect(shell.breachExpiresTick).toBe(60);
    const pruned = {
      ...breached.worldState,
      spatialLedgers: { ...breached.worldState.spatialLedgers, treaties: {} },
    };
    expect(credibilityOf(pruned).crown)
      .toEqual({ score: -0.4, lastUpdateTick: TICK, holder: 'people_held' });
    expect(credibilityScoreOf(pruned, 'crown', TICK)).toBe(-0.4);
  });
});
