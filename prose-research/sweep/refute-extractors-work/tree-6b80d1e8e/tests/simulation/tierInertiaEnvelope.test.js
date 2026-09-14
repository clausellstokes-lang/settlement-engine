/**
 * tierInertiaEnvelope.test.js — TIER-INERTIA CONFIRMATION (realm directive 6 / J-D6,
 * wave W-A, 2026-07-31). A powered distribution-envelope property over the REAL
 * tier-drift path, plus the deterministic pins that name the mechanism.
 *
 * THE OWNER'S CLAIM (directive 6, verbatim intent): "higher-tier + successful
 * settlements must be proportionally harder to drift unless matched by acute
 * pressure/stressors." J-D6 rules that confirmation is a powered envelope on drift
 * probability as a function of tier x prosperity x pressure acuteness, and that a
 * FAILURE routes to the tuning band rather than to code.
 *
 * THE VERDICT: CONFIRMED. Under an identical held stressor load, a generated village
 * drifts within eight advances at 84.25% while a generated city drifts at 10.0% — the
 * city's rate is indistinguishable from its own UNSTRESSED baseline (10.75%). Raise the
 * same five stressors to full severity and the city rises to 95.5%: the gap closes, as
 * the directive requires. The three registered matched-pressure bounds prove the
 * ordering STRUCTURALLY rather than by corpus luck — the village FLOOR (87 of 120) sits
 * above the town CEILING (42) which sits above the city CEILING (24), so no corpus that
 * satisfies all three can violate village > town > city.
 *
 * ── THE INSTRUMENT ──────────────────────────────────────────────────────────────
 * TRIAL UNIT: one seeded settlement, carried through HORIZON consecutive pulse
 * advances under a HELD stressor load, with no outcome applied. The settlement is
 * therefore constant across the horizon and only the drift STREAK accumulates, so a
 * trial measures the drift hazard of a fixed configuration over a fixed span of world
 * time — exactly "drift probability per unit time" with the unit pinned. The trial is
 * Bernoulli by construction (drifted / did not), the denominator is fixed by the corpus
 * rather than by an outcome, and DENOMINATOR GUARDS below pin every quantity the
 * bounds are scaled against (the roadsMissions discipline).
 *
 * THE REAL PATH, not a re-implementation. Each advance runs
 *   generateSettlementPipeline -> buildWorldSnapshot -> deriveSettlementPressures
 *   -> pressureIndex -> evaluateTierResourceDynamics -> rollCandidates
 * which is the kernel's own tier-drift chain (pulseKernel.js lines ~1150-1157) with
 * the same seeded PRNG seam. Nothing about eligibility, streaks, severity, candidate
 * probability, or the roll is mirrored here.
 *
 * CONTROLLED PRESSURE INJECTION: the same five active-condition archetypes (famine,
 * war_pressure, trade_route_cut, plague, corruption_exposed) at the same severity are
 * attached to every settlement in a cell. The INJECTION is equal across tiers; the
 * REALIZED pressure is not, and that difference is the phenomenon — a city's derived
 * causal state absorbs the identical shock. "Equal pressure" in the directive means
 * equal stressors, and the calm control below is what proves the measured gap is caused
 * by them.
 *
 * THE CALM CONTROL: with zero stressors the three tiers drift at 10.5% / 11.0% / 10.75%
 * — statistically indistinguishable, and every one of those events is a PROMOTION. So
 * the matched-pressure ceilings measure RESISTANCE TO STRESSORS, not a dead instrument
 * and not a pre-existing tier gradient. Each calm arm carries its own registered FLOOR
 * so the ceiling can never go vacuous by the corpus quietly ceasing to drift at all.
 *
 * ── WHERE THE INERTIA ACTUALLY LIVES (the recorded boundary of this confirmation) ──
 * The end-to-end property holds, and the mechanism is worth naming exactly, because it
 * is NOT where a reader would assume.
 *
 *   1. EVERY demotion in this corpus fires the STRUCTURAL-FAILURE branch (support
 *      <= 0.25). Pinned below two ways: no corpus settlement sits below its own tier's
 *      population floor (so the two population-driven demotion branches are
 *      unreachable), and every demotion eligibility carries support <= 0.25.
 *   2. That branch is SCALE-FREE. Driven with a matched support and matched relative
 *      headroom, village, town, and city return the IDENTICAL verdict — same direction,
 *      same severity 0.48, same minimum streak 2, same candidate probability 0.9452.
 *      Tier confers ZERO structural demotion resistance.
 *   3. So all of the measured inertia is EMERGENT, from the causal derivation: the same
 *      five stressors leave a city's support above 0.25 far more often than a village's.
 *   4. The one STRUCTURAL tier term is on the PROMOTION side — the required streak is
 *      graded 4 / 5 / 6 for village->town / town->city / city->metropolis, while the
 *      demotion requirement is FLAT at 2 across village, town, and city.
 *
 * TUNING-BAND ITEM (J-D6 routing, recorded not fixed — this wave ships NO engine edit).
 * The confirmation rests entirely on the derivation. Two consequences the owner may
 * want priced: (a) a tuning change that lifts small-settlement derived support, or one
 * that lowers a city's, moves the whole inertia curve with no change to any tier rule —
 * this instrument is what would catch it; (b) the graded promotion ladder does not show
 * up as a tier gradient in realized promotion probability over this horizon (10.5% /
 * 11.0% / 10.75%), so "harder to RISE at higher tier" is presently a streak-cost claim
 * the realized rates do not express. Neither is a defect against directive 6, which is
 * about resisting decline under stressors; both are tuning-band questions.
 *
 * ── SOAK RECEIPT ────────────────────────────────────────────────────────────────
 * The 2026-07-31 realm-scale soak evidence this envelope was built to formalize: a CITY
 * fell 8132 -> 2000 across 100 years, while a VILLAGE fell 629 -> 0 in 4 years. This
 * instrument reproduces that asymmetry as a measured rate under controlled stressors
 * (84.25% vs 10.0% within eight advances) rather than as a two-world anecdote.
 *
 * ── PROVENANCE ──────────────────────────────────────────────────────────────────
 * All nine base rates measured 2026-07-31 at N=400 on the `tier-inertia-<tier>-<i>`
 * seed family; the test's own first-120 corpus lands within 1.81 sigma of the family on
 * every cell (per-cell z recorded in the manifest notes), so there is no corpus/family
 * divergence of the kind that blocked tests/simulation/distributionEnvelopes.test.js.
 * Every bound is EXACTLY its alpha-1e-3 derivation: nothing here is loosenPending and
 * nothing is a ratified stricter override.
 *
 * ────────────────────────────────────────────────────────────────────────────────
 * SUBSYSTEM-CERTIFICATION ROW (liftable — the certification build reads the tagged
 * lines below verbatim; keep the tags and keep them in this order).
 *
 * @certification-subsystem   tierDriftEnabled
 * @certification-status      CONFIRMED
 * @certification-date        2026-07-31
 * @certification-wave        W-A (realm directive 6, judgment J-D6)
 * @certification-instrument  tests/simulation/tierInertiaEnvelope.test.js
 * @certification-envelopes   tierInertia.calmBaseline.{village,town,city}.promotionFloor;
 *                            tierInertia.matchedPressure.village.demotionFloor;
 *                            tierInertia.matchedPressure.{town,city}.demotionCeiling;
 *                            tierInertia.acutePressure.{village,town,city}.demotionFloor
 * @certification-invariant   TIER INERTIA IS REAL AND PRESSURE-CONDITIONAL. Under an
 *   equal held stressor load, a settlement of a higher tier drifts strictly less often
 *   per unit of world time than a lower-tier one, and acute matched pressure closes the
 *   gap. Formally, over a corpus of 120 seeded settlements advanced 8 pulse ticks under
 *   an identical five-archetype stressor load: at MATCHED severity the village arm is
 *   floored at 87/120 while the town arm is capped at 42/120 and the city arm at 24/120
 *   (so village > town > city holds structurally, not by corpus luck); at ACUTE severity
 *   all three arms are floored at 110/120 or above (village 115, town 110, city 105), so
 *   the ordering collapses to near-totality. With NO stressors all three arms are floored
 *   at 3/120 and every drift event is a PROMOTION, which is what makes the matched-pressure
 *   ceilings a measurement of resistance rather than of silence.
 * @certification-mechanism   The inertia is EMERGENT, not structural. Every demotion in
 *   the certified corpus fires the population-independent structural-failure branch
 *   (support <= 0.25); that branch is scale-free (matched support + matched relative
 *   headroom yields an identical verdict at village, town, and city — severity 0.48,
 *   minimum streak 2, probability 0.9452). The gradient comes entirely from the causal
 *   derivation absorbing the identical shock differently by tier. The only structural
 *   tier term is the PROMOTION streak ladder (4 / 5 / 6); the demotion streak requirement
 *   is flat at 2 across village, town, and city.
 * @certification-falsifier   Any tuning change that moves derived support for small or
 *   large settlements moves this curve with no change to any tier rule. A red on the
 *   matched-pressure city ceiling means high-tier resistance eroded; a red on the
 *   matched-pressure village floor means low-tier settlements stopped responding to
 *   stressors; a red on an acute floor means acute pressure no longer closes the gap.
 * @certification-engine-edits  none (measurement + pins only, by J-D6)
 * ────────────────────────────────────────────────────────────────────────────────
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { deriveSettlementPressures, pressureIndex } from '../../src/domain/worldPulse/pressureModel.js';
import { evaluateTierResourceDynamics } from '../../src/domain/worldPulse/tierResourceDynamics.js';
import { rollCandidates } from '../../src/domain/worldPulse/candidateEvents.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { POPULATION_RANGES, TIER_ORDER } from '../../src/data/constants.js';
import { readEnvelope } from '../helpers/distributionEnvelope.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** The corpus every registered bound is scaled against. Pinned by a denominator guard. */
const CORPUS_N = 120;

/** Consecutive pulse advances per trial — the "per unit time" unit. Pinned below. */
const HORIZON = 8;

/** The seed family. The N=400 base-rate measurement extends exactly this family. */
const SEED_FAMILY = 'tier-inertia';

/** The three rungs under test. Metropolis is out of scope: its demotion streak
 *  requirement is 3 rather than 2, a different structural regime. */
const TIERS = ['village', 'town', 'city'];

/** The controlled injection: one archetype per pressure kind the support vector reads
 *  (food, conflict, trade, legitimacy, disease). Identical across every tier. */
const STRESSOR_ARCHETYPES = ['famine', 'war_pressure', 'trade_route_cut', 'plague', 'corruption_exposed'];

/** The three pressure acuteness levels. `calm` is the control arm. */
const LOADS = Object.freeze({ calm: 0, matched: 0.7, acute: 1 });

/** The structural-failure threshold in tierEligibility. Read here only to PIN that the
 *  corpus's demotions actually cross it — never to re-derive the engine's decision. */
const STRUCTURAL_FAILURE_SUPPORT = 0.25;

/** The one canonical home for this file's derived distribution bounds. */
const ENVELOPES = JSON.parse(readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '../fixtures/distribution-envelopes.manifest.json'),
  'utf8',
));

/**
 * Read a registered envelope and prove it was measured against THIS corpus size. An
 * entry whose `n` drifted from the sweep it governs is a bound about a different
 * experiment (the captureBirthScale guard idiom).
 * @param {string} id
 */
function envelope(id) {
  const entry = readEnvelope(ENVELOPES, id);
  expect(entry.n, `${id}: registered for n=${entry.n} but this sweep runs N=${CORPUS_N}`).toBe(CORPUS_N);
  return entry;
}

/** The held stressor load at a given severity. Severity 0 means no conditions at all. */
function stressorLoad(severity) {
  if (severity <= 0) return [];
  return STRESSOR_ARCHETYPES.map((archetype) => ({
    id: `condition.tier-inertia.${archetype}`,
    archetype,
    severity,
    status: 'worsening',
    triggeredAt: { tick: 0 },
    duration: { elapsedTicks: 0, expiresAtTicks: null },
  }));
}

/**
 * Generation is the expensive half and is IDENTICAL across the three load arms (the
 * load is attached afterwards), so each (tier, index) is generated once and shared.
 * Byte-neutral: generateSettlementPipeline is a pure seeded derivation, so a cached
 * settlement equals a freshly generated one for the same seed.
 * @type {Map<string, { seed: string, generated: any }>}
 */
const generatedCache = new Map();

function generatedFor(tier, index) {
  const key = `${tier}:${index}`;
  const cached = generatedCache.get(key);
  if (cached) return cached;
  const seed = `${SEED_FAMILY}-${tier}-${index}`;
  const generated = generateSettlementPipeline({ settType: tier, culture: 'germanic' }, null, { seed, customContent: {} });
  const record = { seed, generated };
  generatedCache.set(key, record);
  return record;
}

/**
 * ONE TRIAL. Runs the real tier-drift chain for HORIZON consecutive advances against a
 * single-settlement realm carrying a held stressor load, and reports whether a tier
 * drift outcome passed its seeded roll inside that span.
 *
 * @param {{ tier: string, index: number, severity: number }} spec
 */
function driftTrial({ tier, index, severity }) {
  const { seed, generated } = generatedFor(tier, index);
  const settlement = { ...generated, activeConditions: stressorLoad(severity) };
  const id = 'probe';
  const saves = [{
    id,
    name: settlement.name || id,
    phase: 'canon',
    settlement,
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }];
  const campaign = {
    id: 'tier-inertia-envelope',
    name: 'Tier Inertia Envelope',
    settlementIds: [id],
    regionalGraph: ensureRegionalGraph({}),
    wizardNews: { currentTick: 0, entries: [] },
  };
  let worldState = { rngSeed: seed, tick: 0, simulationRules: {}, stressors: [] };
  /** @type {{ direction: string, support: number }[]} */
  const eligibilities = [];
  let outcome = null;
  for (let advance = 1; advance <= HORIZON; advance += 1) {
    const snapshot = buildWorldSnapshot({ campaign, saves, worldState });
    const pIdx = pressureIndex(deriveSettlementPressures(snapshot));
    const evaluated = evaluateTierResourceDynamics(worldState, snapshot, pIdx, {
      tick: advance,
      simulationRules: worldState.simulationRules,
    });
    worldState = evaluated.worldState;
    const drift = evaluated.driftBySettlement[id];
    if (drift) eligibilities.push({ direction: drift.direction, support: drift.support });
    const tierCandidates = evaluated.candidates.filter((candidate) => candidate.type === 'tier');
    if (!tierCandidates.length || outcome) continue;
    const rolled = rollCandidates(tierCandidates, createPRNG(`${seed}:pulse:${advance}`), {});
    const passed = rolled.selected[0];
    if (passed) {
      outcome = {
        advance,
        direction: passed.tierChange.direction,
        minimumStreak: passed.metadata.minimumStreak,
      };
    }
  }
  return {
    seed,
    tier: settlement.tier,
    population: settlement.population,
    eligibilities,
    outcome,
  };
}

/** Run one matrix cell: CORPUS_N trials at one tier and one load. */
function cell(tier, loadName) {
  const trials = [];
  for (let index = 0; index < CORPUS_N; index += 1) {
    trials.push(driftTrial({ tier, index, severity: LOADS[loadName] }));
  }
  return {
    tier,
    loadName,
    trials,
    drifted: trials.filter((trial) => trial.outcome).length,
  };
}

// The full 3 x 3 matrix, built once at collection (the captureBirthScale sweep idiom).
/** @type {Record<string, Record<string, ReturnType<typeof cell>>>} */
const MATRIX = {};
for (const loadName of Object.keys(LOADS)) {
  MATRIX[loadName] = {};
  for (const tier of TIERS) MATRIX[loadName][tier] = cell(tier, loadName);
}

const countAt = (loadName, tier) => MATRIX[loadName][tier].drifted;
const trialsAt = (loadName, tier) => MATRIX[loadName][tier].trials;
const allTrials = Object.keys(LOADS).flatMap((load) => TIERS.flatMap((tier) => trialsAt(load, tier)));

describe('directive 6 / J-D6 — TIER INERTIA under an equal held stressor load', () => {
  it('the low rung responds to matched stressors: the village arm clears its derived floor', () => {
    const floor = envelope('tierInertia.matchedPressure.village.demotionFloor');
    expect(
      countAt('matched', 'village'),
      `village drift under matched stressors: floor ${floor.bound} derived from a measured `
      + `${floor.baseRate} at N=${floor.baseMeasurementN} (${floor.margin} sigma). A red here means `
      + `low-tier settlements STOPPED responding to stressors, which would make every ceiling below `
      + `vacuous — this is the arm that keeps the comparison alive.`,
    ).toBeGreaterThanOrEqual(floor.bound);
  });

  it('the high rung RESISTS the identical stressors: the city arm stays under its derived ceiling', () => {
    const ceiling = envelope('tierInertia.matchedPressure.city.demotionCeiling');
    expect(
      countAt('matched', 'city'),
      `city drift under matched stressors: ceiling ${ceiling.bound} derived from a measured `
      + `${ceiling.baseRate} at N=${ceiling.baseMeasurementN} (${ceiling.margin} sigma). THIS IS THE `
      + `DIRECTIVE-6 BOUND: a red means high-tier inertia eroded.`,
    ).toBeLessThanOrEqual(ceiling.bound);
  });

  it('the middle rung sits between them: the town arm stays under its derived ceiling', () => {
    const ceiling = envelope('tierInertia.matchedPressure.town.demotionCeiling');
    expect(
      countAt('matched', 'town'),
      `town drift under matched stressors: ceiling ${ceiling.bound} derived from a measured `
      + `${ceiling.baseRate} at N=${ceiling.baseMeasurementN} (${ceiling.margin} sigma).`,
    ).toBeLessThanOrEqual(ceiling.bound);
  });

  it('THE ORDERING IS STRUCTURAL: the registered bounds themselves forbid village <= town <= city', () => {
    // A corpus comparison alone would be one draw's luck. The three registered bounds
    // are separated with room to spare, so ANY corpus that satisfies all three
    // satisfies the ordering too — the claim survives a corpus re-draw.
    const villageFloor = envelope('tierInertia.matchedPressure.village.demotionFloor').bound;
    const townCeiling = envelope('tierInertia.matchedPressure.town.demotionCeiling').bound;
    const cityCeiling = envelope('tierInertia.matchedPressure.city.demotionCeiling').bound;
    expect(villageFloor, 'village floor must clear the town ceiling').toBeGreaterThan(townCeiling);
    expect(townCeiling, 'town ceiling must clear the city ceiling').toBeGreaterThan(cityCeiling);
    // ...and the corpus agrees, which is the anti-vacuity half: bounds that no corpus
    // reaches would satisfy the inequality above while measuring nothing.
    expect(countAt('matched', 'village')).toBeGreaterThan(countAt('matched', 'town'));
    expect(countAt('matched', 'village')).toBeGreaterThan(countAt('matched', 'city'));
  });
});

describe('directive 6 / J-D6 — ACUTE matched pressure CLOSES the gap', () => {
  it('every rung clears its acute floor — the high rung reaches near-totality', () => {
    for (const tier of TIERS) {
      const floor = envelope(`tierInertia.acutePressure.${tier}.demotionFloor`);
      expect(
        countAt('acute', tier),
        `${tier} drift under acute stressors: floor ${floor.bound} derived from a measured `
        + `${floor.baseRate} at N=${floor.baseMeasurementN} (${floor.margin} sigma). A red means acute `
        + `pressure no longer overwhelms inertia — the "unless matched by acute pressure" half of `
        + `directive 6.`,
      ).toBeGreaterThanOrEqual(floor.bound);
    }
  });

  it('THE CLOSURE IS STRUCTURAL: the city acute floor sits far above the city matched ceiling', () => {
    // The SAME 120 settlements, the SAME five archetypes — only the severity moves.
    // Comparing the two registered bounds proves the lift survives a corpus re-draw.
    const matchedCeiling = envelope('tierInertia.matchedPressure.city.demotionCeiling').bound;
    const acuteFloor = envelope('tierInertia.acutePressure.city.demotionFloor').bound;
    expect(acuteFloor, 'acute floor must clear the matched ceiling').toBeGreaterThan(matchedCeiling);
    expect(countAt('acute', 'city')).toBeGreaterThan(countAt('matched', 'city'));
    // The ordering that held under matched pressure has collapsed: the three acute arms
    // land within a few counts of each other rather than an order of magnitude apart.
    const acuteCounts = TIERS.map((tier) => countAt('acute', tier));
    expect(Math.max(...acuteCounts) - Math.min(...acuteCounts), 'acute spread across tiers')
      .toBeLessThanOrEqual(10);
  });
});

describe('directive 6 / J-D6 — the CALM control (what makes the ceilings mean resistance)', () => {
  it('every rung still drifts with NO stressors: each calm arm clears its derived floor', () => {
    for (const tier of TIERS) {
      const floor = envelope(`tierInertia.calmBaseline.${tier}.promotionFloor`);
      expect(
        countAt('calm', tier),
        `${tier} drift with no stressors: floor ${floor.bound} derived from a measured `
        + `${floor.baseRate} at N=${floor.baseMeasurementN} (${floor.margin} sigma). THE ANTI-VACUITY `
        + `ANCHOR: without this, a corpus that had simply stopped drifting would satisfy every `
        + `matched-pressure ceiling above.`,
      ).toBeGreaterThanOrEqual(floor.bound);
    }
  });

  it('the calm baseline is TIER-FLAT — the measured gap is caused by the stressors, not by tier', () => {
    const calmCounts = TIERS.map((tier) => countAt('calm', tier));
    // Deliberately NOT an ordering claim: the three calm rates are statistically
    // indistinguishable (10.5% / 11.0% / 10.75% at N=400), so any strict inequality here
    // would be over-fitting one corpus. A spread bound is the honest statement, and it is
    // what licenses reading the matched-pressure spread as a stressor effect.
    expect(Math.max(...calmCounts) - Math.min(...calmCounts), 'calm spread across tiers')
      .toBeLessThanOrEqual(10);
    // ...against a matched-pressure spread an order of magnitude larger.
    const matchedCounts = TIERS.map((tier) => countAt('matched', tier));
    expect(Math.max(...matchedCounts) - Math.min(...matchedCounts))
      .toBeGreaterThan(Math.max(...calmCounts) - Math.min(...calmCounts));
  });

  it('DIRECTION TOTALITY: calm drift is always upward, stressed drift is always downward', () => {
    const calmFailures = collectSeedFailures(
      TIERS.flatMap((tier) => trialsAt('calm', tier).filter((trial) => trial.outcome)),
      (trial) => {
        expect(trial.outcome.direction, `${trial.seed} drifted under NO stressors`).toBe('promotion');
      },
    );
    expectNoSeedFailures(calmFailures, 'every unstressed drift event is a promotion');

    const stressedFailures = collectSeedFailures(
      ['matched', 'acute'].flatMap((load) => TIERS.flatMap(
        (tier) => trialsAt(load, tier).filter((trial) => trial.outcome),
      )),
      (trial) => {
        expect(trial.outcome.direction, `${trial.seed} drifted under stressors`).toBe('demotion');
      },
    );
    expectNoSeedFailures(stressedFailures, 'every stressed drift event is a demotion');
  });
});

describe('directive 6 / J-D6 — WHERE THE INERTIA LIVES (the mechanism, pinned)', () => {
  it('BRANCH ATTRIBUTION: no corpus settlement sits below its own tier floor', () => {
    // tierEligibility has three demotion branches. Two of them read population against
    // the tier floor (pop < min * 0.82, and pop < min with support < 0.45). This pin
    // establishes that neither is REACHABLE anywhere in the corpus, which is half of
    // proving that every demotion measured above came through the third.
    const failures = collectSeedFailures(allTrials, (trial) => {
      const floor = POPULATION_RANGES[trial.tier].min;
      expect(
        trial.population,
        `${trial.seed}: ${trial.tier} population ${trial.population} is below the tier floor ${floor}`,
      ).toBeGreaterThanOrEqual(floor);
    });
    expectNoSeedFailures(failures, 'every corpus settlement sits at or above its tier population floor');
  });

  it('BRANCH ATTRIBUTION: every demotion eligibility crosses the structural-failure line', () => {
    // The other half. Combined with the pin above, this makes "the inertia is a SUPPORT
    // differential" CONFIRMED rather than inferred from reading the source.
    const demotions = allTrials.flatMap(
      (trial) => trial.eligibilities
        .filter((eligibility) => eligibility.direction === 'demotion')
        .map((eligibility) => ({ ...eligibility, seed: trial.seed })),
    );
    expect(demotions.length, 'anti-vacuity: the corpus must contain demotion eligibilities').toBeGreaterThan(0);
    const failures = collectSeedFailures(demotions, (eligibility) => {
      expect(
        eligibility.support,
        `${eligibility.seed}: demotion eligible at support ${eligibility.support}, above the `
        + `structural-failure line — a population-driven branch fired and the attribution above is stale`,
      ).toBeLessThanOrEqual(STRUCTURAL_FAILURE_SUPPORT);
    });
    expectNoSeedFailures(failures, 'every demotion in the corpus is a structural (support) failure');
  });

  it('THE PREDICATE IS SCALE-FREE: matched support + matched headroom drifts identically at every tier', () => {
    // The recorded boundary of the confirmation. Driven through the same
    // evaluateTierResourceDynamics entry point with a flat synthetic pressure index, so
    // support is EQUAL by construction rather than by derivation, and population is held
    // at the same multiple of each tier's own floor.
    const flatPressure = (score) => ({ get: () => ({ score }) });
    const verdicts = TIERS.map((tier) => {
      const id = `scalefree-${tier}`;
      const population = Math.round(POPULATION_RANGES[tier].min * 1.56);
      const lowerTier = TIER_ORDER[TIER_ORDER.indexOf(tier) - 1];
      const evaluated = evaluateTierResourceDynamics(
        {
          settlementTickStates: { [id]: { tierDrift: { direction: 'demotion', toTier: lowerTier, streak: 5 } } },
          proposals: [],
        },
        {
          settlements: [{
            id,
            name: id,
            settlement: {
              name: id, tier, population,
              config: { nearbyResources: [] }, institutions: [], activeConditions: [], npcs: [],
            },
            causal: { scores: {} },
            system: {},
          }],
        },
        flatPressure(0.8),
        { tick: 9, simulationRules: {} },
      );
      const candidate = evaluated.candidates.find((entry) => entry.type === 'tier');
      const drift = evaluated.driftBySettlement[id];
      // ANTI-VACUITY on the probe itself: if the synthetic inputs stop reaching the
      // predicate at all (a shape change, a renamed field, a moved threshold), the reads
      // below would throw a bare TypeError that hides WHY. Name it here instead.
      expect(
        Boolean(drift && candidate),
        `${tier}: the scale-free probe produced no tier drift at all — the synthetic pressure `
        + `index or settlement shape no longer reaches tierEligibility, so this pin is asserting `
        + `nothing. Fix the probe, never the assertion.`,
      ).toBe(true);
      return {
        tier,
        direction: drift.direction,
        severity: drift.severity,
        minimumStreak: candidate.metadata.minimumStreak,
        probability: candidate.probability,
      };
    });
    for (const verdict of verdicts) {
      expect(verdict.direction, `${verdict.tier} direction`).toBe('demotion');
      expect(verdict.severity, `${verdict.tier} severity`).toBeCloseTo(0.48, 10);
      expect(verdict.minimumStreak, `${verdict.tier} minimum streak`).toBe(2);
      expect(verdict.probability, `${verdict.tier} candidate probability`).toBeCloseTo(0.9452, 10);
    }
  });

  it('THE LADDER: demotion streaks are FLAT across the three rungs, promotion streaks are GRADED', () => {
    // Read off the LIVE corpus, not a synthetic probe: whatever the engine actually
    // demanded of the settlements that drifted.
    const streaksFor = (loadName, direction) => new Set(
      TIERS.flatMap((tier) => trialsAt(loadName, tier)
        .filter((trial) => trial.outcome && trial.outcome.direction === direction)
        .map((trial) => trial.outcome.minimumStreak)),
    );
    expect([...streaksFor('matched', 'demotion')].sort(), 'demotion minimum streaks, matched load').toEqual([2]);
    expect([...streaksFor('acute', 'demotion')].sort(), 'demotion minimum streaks, acute load').toEqual([2]);
    // Promotion is the one place tier buys a structural cost: the required streak is the
    // TARGET tier's rank + 1, so it rises rung by rung.
    const promotionByTier = Object.fromEntries(TIERS.map((tier) => [
      tier,
      [...new Set(trialsAt('calm', tier)
        .filter((trial) => trial.outcome && trial.outcome.direction === 'promotion')
        .map((trial) => trial.outcome.minimumStreak))],
    ]));
    expect(promotionByTier.village, 'village -> town promotion streak').toEqual([4]);
    expect(promotionByTier.town, 'town -> city promotion streak').toEqual([5]);
    expect(promotionByTier.city, 'city -> metropolis promotion streak').toEqual([6]);
  });
});

describe('directive 6 / J-D6 — denominator guards (what every bound is scaled against)', () => {
  it('the corpus size, the horizon, and the injected load are exactly what the bounds assume', () => {
    // A bound is a statement about a specific experiment. If the corpus, the horizon, or
    // the stressor set moves, every registered rate is about a different world — so those
    // quantities red here rather than silently re-scaling what the bounds mean (the
    // roadsMissions denominator-guard discipline).
    expect(CORPUS_N, 'corpus size').toBe(120);
    expect(HORIZON, 'pulse advances per trial').toBe(8);
    expect(STRESSOR_ARCHETYPES.length, 'injected stressor archetypes').toBe(5);
    expect(LOADS.calm, 'calm severity').toBe(0);
    expect(LOADS.matched, 'matched severity').toBe(0.7);
    expect(LOADS.acute, 'acute severity').toBe(1);
    expect(TIERS, 'rungs under test').toEqual(['village', 'town', 'city']);
    for (const load of Object.keys(LOADS)) {
      for (const tier of TIERS) {
        expect(trialsAt(load, tier).length, `${load}/${tier} trial count`).toBe(CORPUS_N);
      }
    }
  });

  it('every settlement generated at its requested tier (the corpus is what it claims to be)', () => {
    const failures = collectSeedFailures(allTrials, (trial) => {
      const requested = trial.seed.split('-').at(-2);
      expect(trial.tier, `${trial.seed} generated at the wrong tier`).toBe(requested);
    });
    expectNoSeedFailures(failures, 'every corpus settlement carries the tier its seed requested');
  });

  it('all nine registered bounds name this file and this corpus size', () => {
    const ids = [
      ...TIERS.map((tier) => `tierInertia.calmBaseline.${tier}.promotionFloor`),
      'tierInertia.matchedPressure.village.demotionFloor',
      'tierInertia.matchedPressure.town.demotionCeiling',
      'tierInertia.matchedPressure.city.demotionCeiling',
      ...TIERS.map((tier) => `tierInertia.acutePressure.${tier}.demotionFloor`),
    ];
    expect(ids.length, 'registered bound count').toBe(9);
    for (const id of ids) {
      const entry = envelope(id);
      expect(entry.file, `${id} file`).toBe('tests/simulation/tierInertiaEnvelope.test.js');
      expect(entry.baseMeasurementN, `${id} measurement N`).toBe(400);
      expect(entry.loosenPending, `${id} loosenPending`).toBe(false);
    }
  });
});
