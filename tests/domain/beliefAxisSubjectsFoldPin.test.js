/**
 * beliefAxisSubjectsFoldPin.test.js — SP-B REPAIR R1: THE FOLD ARM, PINNED AT THE ENGINE.
 *
 * WHY THIS FILE EXISTS, STATED PLAINLY. SP-B shipped with its fold arm covered only by
 * DIRECT unit calls to `foldSubjectAxes`. The verifier planted two severance mutants in
 * `beliefAxes.foldBeliefAxes` — replacing the fold spread with `return base;`, and passing
 * `gates: null` to it — and BOTH survived the whole focused set with lint clean. The
 * function was tested; nothing proved anything ever CALLED it. That is the exact shape of
 * the recorded harness-default-empty-state class, and it left the half of SP-B that
 * carries adoption-vs-staleness — the fog-of-war seam the wave was built for — able to be
 * deleted whole with every gate green.
 *
 * THE REASON THE FOUR-FENCE SET COULD NOT SEE IT, MEASURED. `advanceBeliefMaps` reaches
 * `reconcileBelief` (and therefore the fold) only for an (observer, subject) pair that has
 * BOTH a surviving prior belief AND a fresh report this window — beliefMap.js:1170 skips a
 * pair with neither, and :1185 takes the SILENCE branch (decay the frozen prior) for a pair
 * with no fresh word. The dormancy fence's fixture carries no rumor ledger at all, so every
 * arm of it — dark, lit and conjunction-dark alike — exercises cold-start seeding and
 * silence decay and never once enters the fold. Its `calls.folds` counter reads zero in a
 * FULLY LIT world for that reason and not because the flags are dark.
 *
 * SO THE DRIVE HERE IS TWO-STEP, AND BOTH STEPS ARE THE REAL ENGINE:
 *   1. a cold-start `advanceBeliefMaps` seeds a ledger from ground truth (engine-produced —
 *      the prior is never hand-authored, which is what keeps this out of the recorded
 *      fixture-mirrors-the-deriver class);
 *   2. that ledger is fed back through `spatialLedgers.beliefMaps` alongside a rumor ledger
 *      carrying one fresh report, and a SECOND advance reconciles the pair — which is the
 *      only path in the estate that reaches `foldSubjectAxes`.
 *
 * AND THE WORLD CHANGES BETWEEN THE TWO STEPS. Aldenmoor's granary empties, hunger sets in
 * and its ascendant patron cult collapses, so the ground truth the second advance sees
 * DIFFERS from the belief the first advance seeded on all three families at once. That is
 * what makes the staircase below a measurement rather than a tautology: a stale prior and a
 * current truth that are actually distinguishable.
 *
 * THE STAIRCASE IS THE POINT. The three families carry three DIFFERENT adoption bars
 * (CONDITIONS 0.5 < DEVOTION 0.6 < SCARCITY 0.7), so one report's fidelity partitions them:
 *   0.30 — below all three: every family keeps the belief it already held (the fog).
 *   0.55 — over CONDITIONS only: the town's size and roads update; its granary and its gods
 *          do not. A court can be right about the road and years out of date about the cult.
 *   0.65 — over CONDITIONS and DEVOTION: only the commercial detail stays stale.
 *   0.90 — over all three: the observer adopts the present world.
 * Every rung is asserted RELATIONALLY — equal to the engine's own prior, or equal to the
 * engine's own fresh ground truth, never to a word this file spells. A band-edge retune
 * therefore does not touch this file, while a severed fold, a collapsed bar set, or a fold
 * that always adopts (or never does) reds immediately.
 */
import { describe, expect, test } from 'vitest';

import { advanceBeliefMaps } from '../../src/domain/worldPulse/beliefMap.js';
import {
  SCARCITY_BANDS,
  DEVOTION_BANDS,
  CONDITIONS_KEYS,
  SUBJECT_AXIS_TUNING,
} from '../../src/domain/worldPulse/beliefAxisSubjects.js';

const HOST = 'beliefAxesEnabled';
const FLAGS = Object.freeze(['believedScarcityEnabled', 'believedConditionsEnabled', 'believedDevotionEnabled']);

/** The host axis flag lit, no family lit — the pre-SP-B engine, exactly. */
const AXES_ONLY = Object.freeze({ [HOST]: true });
const ALL_LIT = Object.freeze({ [HOST]: true, ...Object.fromEntries(FLAGS.map((f) => [f, true])) });

/**
 * The belief layer itself must be live in every arm. `infoMode` defaults to `omniscient`,
 * under which `advanceBeliefMaps` early-returns and writes nothing whatever the SP-B flags
 * say — a drive without this would measure the belief layer's dormancy and call it SP-B's.
 */
const BELIEFS_LIVE = Object.freeze({ infoMode: 'unreliable' });

const SEED_TICK = 11;
const REPORT_TICK = 12;
const RECONCILE_TICK = 13;

/**
 * One town. The economic state is real enough for all three families to resolve: goods it
 * makes, buys and cannot do without (scarcity), a tier / route class / granary / prosperity
 * (conditions), and a pantheon supplied separately (devotion).
 */
const town = (id, name, tier, tradeAccess, prosperity, storageMonths, foodRatio) => ({
  id,
  name,
  settlement: {
    id,
    name,
    tier,
    populationHistory: [{ delta: -20, population: 900 }, { delta: -30, population: 870 }],
    economicState: {
      tier,
      prosperity,
      tradeAccess,
      isEntrepot: tradeAccess === 'crossroads',
      localProduction: ['grain', 'iron'],
      primaryExports: ['Grain surplus'],
      primaryImports: ['Timber'],
      necessityImports: ['Salt'],
      foodSecurity: { storageMonths, foodRatio },
    },
  },
});

const snapshotOf = (a, b) => ({
  byId: new Map([['a', a], ['b', b]]),
  settlements: [a, b],
  relationships: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }],
});

/** BEFORE — Aldenmoor is a fat crossroads town under an ascendant patron. */
function worldBefore() {
  return {
    snapshot: snapshotOf(
      town('a', 'Aldenmoor', 'town', 'crossroads', 'Prosperous', 9, 1.2),
      town('b', 'Thornwall', 'village', 'river', 'Poor', 2, 0.7),
    ),
    worldState: {
      spatialCanonVersion: 1,
      relationshipStates: {},
      religionStates: {
        a: { patronRef: 'deity.vael', deities: { 'deity.vael': { deityRef: 'deity.vael', share: 70, standing: 'ascendant' } } },
        b: { patronRef: null, deities: { 'deity.orr': { deityRef: 'deity.orr', share: 20, standing: 'cult' } } },
      },
    },
  };
}

/** AFTER — the granary is empty, the town is hungry, and the cult has lost both its
 *  standing and the patron seat. All three families move at once. */
function worldAfter() {
  const before = worldBefore();
  return {
    snapshot: snapshotOf(
      town('a', 'Aldenmoor', 'town', 'crossroads', 'Prosperous', 2, 0.7),
      town('b', 'Thornwall', 'village', 'river', 'Poor', 2, 0.7),
    ),
    worldState: {
      ...before.worldState,
      religionStates: {
        ...before.worldState.religionStates,
        a: { patronRef: null, deities: { 'deity.vael': { deityRef: 'deity.vael', share: 70, standing: 'cult' } } },
      },
    },
  };
}

/** Step 1 — a cold-start advance over `world`, producing an ENGINE-derived ledger. */
function coldStart(world, rules) {
  return advanceBeliefMaps({
    snapshot: world.snapshot,
    pressureIdx: null,
    worldState: { ...world.worldState, simulationRules: { ...BELIEFS_LIVE, ...rules } },
    tick: SEED_TICK,
  }).next;
}

/** One fresh telling reaching Thornwall about Aldenmoor, at the given fidelity. */
const rumorLedgerAt = (accuracy01) => ({
  b: {
    'evt.mig.1': {
      arrivalTick: REPORT_TICK,
      hopCount: 0,
      corroborationRoots: ['r1'],
      completeness01: 1,
      accuracy01,
      score: 5,
      framing: [],
      provenance: { originId: 'a' },
      eventRef: `migration.a.b.${SEED_TICK - 1}`,
      content: { what: 'migration_flight', magnitude: 2, partyIds: ['a', 'b'], whereId: 'a' },
    },
  },
});

/** Step 2 — the RECONCILING advance: prior ledger + one fresh report, over `world`. */
function warmAdvance({ world, rules, prior, accuracy01 }) {
  return advanceBeliefMaps({
    snapshot: world.snapshot,
    pressureIdx: null,
    worldState: {
      ...world.worldState,
      simulationRules: { ...BELIEFS_LIVE, ...rules },
      spatialLedgers: { beliefMaps: prior, rumorLedgers: rumorLedgerAt(accuracy01) },
    },
    tick: RECONCILE_TICK,
  }).next;
}

/** The one pair a report arrived for: what Thornwall believes about Aldenmoor. */
const legOf = (ledger) => (ledger && ledger.b && ledger.b.seat ? ledger.b.seat.a : undefined);
/** The pair NO report arrived for — the silence-decay control. */
const silentLegOf = (ledger) => (ledger && ledger.a && ledger.a.seat ? ledger.a.seat.b : undefined);

// The two engine-derived poles every assertion below is measured against.
const PRIOR = coldStart(worldBefore(), ALL_LIT);
const FRESH_TRUTH = coldStart(worldAfter(), ALL_LIT);
const AFTER = worldAfter();

/** @param {Record<string, unknown> | undefined} rec */
const familiesOf = (rec) => ({
  scarcityBands: rec ? rec.scarcityBands : undefined,
  conditionsBands: rec ? rec.conditionsBands : undefined,
  devotionBand: rec ? rec.devotionBand : undefined,
});

describe('SP-B R1 — the fold arm reached through the REAL beliefMap advance', () => {
  test('GUARD THE GUARD: the warm advance RECONCILES the pair rather than decaying it', () => {
    // Everything in this file is a claim about a record that went through
    // `reconcileBelief`. A record that merely DECAYED keeps the prior's fields verbatim,
    // so a severed fold would leave it looking untouched and every assertion below would
    // pass having proved nothing. The tick is the tell: reconcile stamps `now`, silence
    // does not.
    const warm = warmAdvance({ world: AFTER, rules: ALL_LIT, prior: PRIOR, accuracy01: 0.9 });
    expect(legOf(PRIOR), 'the cold start seeded no belief for the pair under test').toBeTruthy();
    expect(legOf(PRIOR).lastUpdateTick).toBe(SEED_TICK);
    expect(legOf(warm), 'the reconciling advance dropped the pair entirely').toBeTruthy();
    expect(legOf(warm).lastUpdateTick, 'the pair took the SILENCE branch — no fresh report reached it')
      .toBe(RECONCILE_TICK);
    // …and the sibling pair, which no report named, really did stay on the silence branch.
    // Without this the tick above could be a property of the advance rather than of the report.
    expect(silentLegOf(warm), 'the silence control pair vanished').toBeTruthy();
    expect(silentLegOf(warm).lastUpdateTick).toBe(SEED_TICK);
  });

  test('the two poles genuinely DIFFER on all three families (else the staircase is vacuous)', () => {
    const before = familiesOf(legOf(PRIOR));
    const after = familiesOf(legOf(FRESH_TRUTH));
    for (const field of ['scarcityBands', 'conditionsBands', 'devotionBand']) {
      expect(before[field], `${field} is absent from the seeded prior`).toBeDefined();
      expect(after[field], `${field} is absent from the fresh ground truth`).toBeDefined();
      expect(
        after[field],
        `${field} reads identically before and after the ruin of Aldenmoor — the fixture stopped`
        + ' moving that family, so every adopt/stale assertion about it below would be a'
        + ' comparison between two equal values and could not fail',
      ).not.toEqual(before[field]);
    }
  });

  test('THE FOLD ARRIVES: the reconciled record carries all three families, with real rungs', () => {
    // THIS IS THE ASSERTION THE TWO SEVERANCE MUTANTS DIE ON. `reconcileBelief` builds its
    // record from six base fields and then Object.assigns the fold's result onto it
    // (beliefMap.js:659-669), so a fold that returns only D-1's two fields leaves the three
    // subject families ABSENT here — however lit the flags are.
    const rec = legOf(warmAdvance({ world: AFTER, rules: ALL_LIT, prior: PRIOR, accuracy01: 0.9 }));
    const { scarcityBands, conditionsBands, devotionBand } = familiesOf(rec);

    expect(scarcityBands, 'the reconciled record carries no scarcityBands').toBeTruthy();
    expect(Object.keys(scarcityBands).length, 'scarcityBands arrived empty').toBeGreaterThan(0);
    expect(Object.values(scarcityBands).every((rung) => SCARCITY_BANDS.includes(rung)))
      .toBe(true);

    expect(conditionsBands, 'the reconciled record carries no conditionsBands').toBeTruthy();
    expect(Object.keys(conditionsBands).length, 'conditionsBands arrived empty').toBeGreaterThan(0);
    expect(Object.keys(conditionsBands).every((key) => CONDITIONS_KEYS.includes(key))).toBe(true);

    expect(typeof devotionBand, 'the reconciled record carries no devotionBand').toBe('string');
    expect(DEVOTION_BANDS.includes(devotionBand)).toBe(true);
  });

  test('the three per-family adoption bars are really THREE, and ordered', () => {
    // The staircase below reads the bars through behaviour; this reads them directly, so a
    // collapse of the three constants to one value reds here with a legible message rather
    // than as four confusing behavioural failures.
    const T = SUBJECT_AXIS_TUNING;
    expect(T.CONDITIONS_ADOPT).toBeLessThan(T.DEVOTION_ADOPT);
    expect(T.DEVOTION_ADOPT).toBeLessThan(T.SCARCITY_ADOPT);
    // …and the four probe fidelities really do straddle each bar, which is what makes the
    // staircase's four rungs four DIFFERENT partitions rather than four spellings of one.
    expect(0.3).toBeLessThan(T.CONDITIONS_ADOPT);
    expect(0.55).toBeGreaterThanOrEqual(T.CONDITIONS_ADOPT);
    expect(0.55).toBeLessThan(T.DEVOTION_ADOPT);
    expect(0.65).toBeGreaterThanOrEqual(T.DEVOTION_ADOPT);
    expect(0.65).toBeLessThan(T.SCARCITY_ADOPT);
    expect(0.9).toBeGreaterThanOrEqual(T.SCARCITY_ADOPT);
  });

  /**
   * Each rung: the fidelity of the one fresh telling, and which families that fidelity
   * clears the bar for. Registered as CASES rather than looped inside one `it()`, so a
   * failure at 0.55 does not hide the verdict at 0.65.
   */
  const STAIRCASE = [
    { accuracy01: 0.3, adopted: [], summary: 'below every bar — the whole picture stays stale' },
    { accuracy01: 0.55, adopted: ['conditionsBands'], summary: 'over CONDITIONS only' },
    { accuracy01: 0.65, adopted: ['conditionsBands', 'devotionBand'], summary: 'over CONDITIONS and DEVOTION' },
    { accuracy01: 0.9, adopted: ['conditionsBands', 'devotionBand', 'scarcityBands'], summary: 'over every bar' },
  ];

  test.each(STAIRCASE)('ADOPTION vs STALENESS at fidelity $accuracy01 — $summary', ({ accuracy01, adopted }) => {
    const rec = familiesOf(legOf(warmAdvance({ world: AFTER, rules: ALL_LIT, prior: PRIOR, accuracy01 })));
    const stalePole = familiesOf(legOf(PRIOR));
    const truthPole = familiesOf(legOf(FRESH_TRUTH));

    for (const field of ['scarcityBands', 'conditionsBands', 'devotionBand']) {
      if (adopted.includes(field)) {
        expect(
          rec[field],
          `${field} did NOT adopt at fidelity ${accuracy01}, which clears its bar — a telling`
          + ' faithful enough to be believed left the observer on its old picture',
        ).toEqual(truthPole[field]);
      } else {
        expect(
          rec[field],
          `${field} adopted at fidelity ${accuracy01}, which is BELOW its bar — the stale prior`
          + ' is the fog-of-war feature and a garbled telling must not overturn a settled view',
        ).toEqual(stalePole[field]);
      }
    }
  });

  test('DORMANT AT THE SAME SEAM: dark families reconcile with none of the three fields', () => {
    // The negative control for the presence test above: the identical two-step drive, on the
    // identical fixture, down the identical reconcile path — with only the three family flags
    // withheld. Absence here is therefore a property of the FLAGS and not of the drive.
    const darkPrior = coldStart(worldBefore(), AXES_ONLY);
    const rec = legOf(warmAdvance({ world: AFTER, rules: AXES_ONLY, prior: darkPrior, accuracy01: 0.9 }));
    expect(rec, 'the dark drive dropped the pair entirely — the comparison would be vacuous').toBeTruthy();
    expect(rec.lastUpdateTick, 'the dark drive did not reach the reconcile branch').toBe(RECONCILE_TICK);
    // anchored: the SAME pair on the SAME path is asserted three tests above to CARRY all
    // three of these keys when the families are lit, so this absence measures the flags.
    expect(Object.keys(rec).filter((k) => ['scarcityBands', 'conditionsBands', 'devotionBand'].includes(k)))
      .toEqual([]);
    // …and D-1's own two axis fields DO survive, so the host axis fold is untouched by the
    // family gates — a dark family is dark, not a dark axis.
    expect(rec.populationTrendBand, 'the host D-1 axis fold stopped running').toBeDefined();
  });
});
