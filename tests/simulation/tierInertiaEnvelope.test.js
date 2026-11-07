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
 * THE CALM CONTROL: with zero stressors every drift event is a PROMOTION, so the
 * matched-pressure ceilings measure RESISTANCE TO STRESSORS, not a dead instrument and not
 * a pre-existing tier gradient. Each calm arm carries its own registered FLOOR so the
 * ceiling can never go vacuous by the corpus quietly ceasing to drift at all. Since
 * LANDING-7 R-B2 (below) a calm promotion is one of two things, counted apart: CONVERGENCE
 * (the place was born already stamping the next tier, in the overlap of the owner's roll
 * bands, and its tier record catches up to its stamp) or DRIFT (born in the promotion
 * lead-in, 0.92 x the next tier's cut up to the cut). Convergence is asserted to be exactly
 * the overlap-born places that clear the promotion support line; drift is asserted per tier
 * against the count the band geometry predicts. (2026-07-31: the three tiers drifted at
 * 10.5% / 11.0% / 10.75% under the old disjoint bands, a spread of at most 10 of 120.)
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
 * RE-MEASURED 2026-11-04 (REGISTERS-4, after FOOD-1/2): eight of the nine base rates moved and were
 * re-derived at N=400 on the same family (city calm held at 43/400); the first-120 corpus lands
 * within 1.37 sigma of the family on every cell (per-cell z in the manifest notes).
 * RE-MEASURED 2026-11-06 (LANDING-7 lane B, at the rung-1 landing tip 3d8a74e4b, bisected by stage):
 * X-46 car 3's density factor (47829c070) thinned the optional fabric the structural-failure branch
 * reads, and the matched/acute arms moved: matched village 219 -> 353, town 23 -> 90, city 6 -> 8;
 * acute village 395 -> 399, town 288 -> 388, city 153 -> 153 (of 400). The four that moved materially
 * were re-derived (matched village floor 48 -> 93, matched town ceiling 17 -> 43 — a loosening the
 * chair rules — acute village 113 -> 116, acute town 70 -> 108); matched city (would loosen 8 -> 9)
 * and acute city (unmoved) were left. THE CALM ARMS WERE NOT RE-KEYED: X-46 car 1's overlapping
 * bands (433289899) moved calm village 53 -> 134 and town 43 -> 127 while city held 43 -> 41,
 * because promotion needs pop >= 0.92 x the next tier's min (tierResourceDynamics.js ::
 * tierEligibility) and that window now covers ~38% / ~30% / ~9% of the village / town / city roll
 * bands where the disjoint bands gave each about a tenth. At the tip calm is 110 / 126 / 41 of 400
 * (first 120: 34 / 42 / 11), so the TIER-FLAT control below is red by a design consequence of the
 * bands, left for the chair's ruling (docs/LANDING7_L7B_2026-11-06.md).
 * CURED IN PART 2026-11-06 (LANDING-7 lane B, seat 2, the chair's ruling R-B1): the promotion window
 * now reads the next tier's STAMP CUT (TIER_STAMP_CUTS) instead of its roll-band minimum. Calm at
 * N=400 110 / 126 / 41 -> 71 / 80 / 41 (first 120: 34 / 42 / 11 -> 23 / 26 / 11, spread 31 -> 15);
 * the matched and acute arms did not move by one trial. The TIER-FLAT control is STILL RED at 15: of
 * the calm promotions, 48 of 71 villages and 54 of 80 towns were GENERATED at or above the next
 * tier's cut (the overlap of the owner's roll bands: village 350-400, town 2,250-2,500; the city band
 * has none), and they promote with no stressor because their population already stamps the next
 * tier. The lead-in-only promotions are 23 / 26 / 41. Left red, named, for the chair.
 * RE-STATED 2026-11-06 (LANDING-7 lane B, seat 3), the chair's ruling R-B2, quoted: "the calm control
 * is RE-STATED: a place born inside the owner's band overlap converges, it does not drift. Under X-46
 * car 1 the roll bands overlap (a village rolls 75–400, a town 300–2,500, a city 2,000–15,000) while
 * the tier stamp is disjoint (88 / 350 / 2,250 / 15,000; TIER_STAMP_CUTS), so a village rolled at
 * 350–400 already STAMPS a town at birth; its tier record catching up under calm is the record
 * converging to the stamp — legitimate under the owner's bands, and not the mechanism [the] calm
 * control exists to measure. [...] the lead-in's share of each roll band differs by construction
 * [...], so TIER-FLAT within 10 was a pin on the old bands' geometry." So the spread pin is gone and
 * two pins take its place, keeping its purpose (the stressor arms' gap is caused by stressors, not by
 * tier): CONVERGENCE (the overlap-born promotions, exactly the support-eligible overlap-born places,
 * no promotion born below the lead-in) and DRIFT per tier (the lead-in promotions, inside the
 * two-sided binomial band at N=120, alpha 1e-3, z = 3.29, around N x the lead-in window's share of the
 * tier's integer roll band). At 1f2a8504e, first 120: convergence 18 / 16 / 0, drift 5 / 10 / 11
 * against expected 10.3 / 9.8 / 11.1. The matched and acute bounds are unchanged (town ceiling 43).
 * One measured qualification of the ruling's "every one of them": 6 of the 24 overlap-born villages
 * never reach the promotion support line (0.62) inside the horizon, so convergence is exactly the
 * overlap-born places that ever read promotion-eligible, every one of which promotes.
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
 *   ⚠ RE-STATED 2026-11-04 (REGISTERS-4, the chair's ruling C4 on the J22 precedent; the figures
 *   above are the 2026-07-31 record, kept). FOOD-1/FOOD-2 lifted small-settlement derived support by
 *   the owner's word, and the curve moved with no tier rule changed. Re-measured at N=400: matched
 *   54.75% / 5.75% / 1.5% (village / town / city), so the village floor is 48/120, the town ceiling
 *   17/120 and the city ceiling 8/120 (village > town > city still holds structurally); acute
 *   98.75% / 72.0% / 38.25%, floored at 113 / 70 / 29 of 120, so acute pressure still CLOSES the gap
 *   (worst ratio 120/29 = 4.14 against the matched separation 48/8 = 6) but no longer to
 *   near-totality; calm floors 5 / 3 / 3. The loosened bounds are owner decision point O-FOOD-INERTIA.
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
 *   ⚠ 2026-11-04: this falsifier fired as written. FOOD-1/FOOD-2 moved derived support (traced by
 *   stage: FOOD-1 the town and city arms, FOOD-2 every moved arm, FOOD-3 the village matched arm by
 *   two of 400), and the matched village floor (87), the town acute floor (93) and the acute ratio
 *   red with no tier rule touched. Re-measured and re-derived, never loosened silently (above).
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
import { POPULATION_RANGES, TIER_ORDER, TIER_STAMP_CUTS } from '../../src/data/constants.js';
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

/** The dark promotion lead-in in tierEligibility (pop >= 0.92 x the next tier's stamp cut). Read
 *  here only to DERIVE the calm drift geometry (R-B2); the CONVERGENCE pin below reds if no calm
 *  promotion is born in [0.92 x cut, cut) while one is born below it. */
const PROMOTION_LEAD_IN = 0.92;

/** The two-sided binomial band the calm drift pin is asserted in: alpha 1e-3, the alpha this
 *  file's envelopes are derived at. */
const DRIFT_BAND_Z = 3.29;

/**
 * The calm geometry of one tier under the owner's bands: the next tier's stamp cut, the lowest
 * integer population in the promotion lead-in, and the lead-in's share of the tier's integer roll
 * band (`resolveConfig` rolls `randInt(min, max)`, inclusive).
 * @param {string} tier
 */
function calmGeometry(tier) {
  const next = TIER_ORDER[TIER_ORDER.indexOf(tier) + 1];
  const cut = TIER_STAMP_CUTS[next];
  const leadIn = Math.ceil(cut * PROMOTION_LEAD_IN);
  const band = POPULATION_RANGES[tier];
  const share = (Math.min(cut, band.max + 1) - Math.max(leadIn, band.min)) / (band.max - band.min + 1);
  return { cut, leadIn, share };
}

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
    // The ordering that held under matched pressure has collapsed: the acute arms land within
    // a ratio of each other that the MATCHED arms cannot. Proved on the registered bounds, so
    // it survives a corpus re-draw: under acute load no rung can sit further below the corpus
    // than the city floor allows (CORPUS_N / acuteFloor), while under matched load the
    // village floor stands at least (villageFloor / cityCeiling) above the city.
    // ⚠ RE-STATED 2026-09-30 (judgment J22, ODQ §934.86). The old form asserted a spread of at
    // most 10 counts. The urban band's complete city blocks lifted city resistance under the
    // acute load (95.5% -> 72.0% demoting at N=400), and the acute arms now land 120 / 104 / 91.
    // The gap still CLOSES (a ratio of 1.3 against matched's 13); it no longer closes to within
    // ten. Whether it should is J-D6's tuning-band question, owner decision point O11.
    // ⚠ RE-STATED 2026-11-04 (REGISTERS-4, the chair's ruling C4, the same door). FOOD-1/FOOD-2 lifted
    // derived support and every acute arm resists more: at N=400 village 99.5% -> 98.75%, town 88.5% ->
    // 72.0%, city 72.0% -> 38.25%; the test's corpus lands 118 / 89 / 49 (was 120 / 104 / 91), a ratio
    // of 2.41 against the old 1.71 bound. The floors re-derive to 113 / 70 / 29, so the worst ratio the
    // city floor allows is 120/29 = 4.14, still under the matched separation 48/8 = 6: the gap still
    // CLOSES, now to within a ratio of about 2.4 rather than 1.3. Owner decision point O-FOOD-INERTIA.
    const villageFloor = envelope('tierInertia.matchedPressure.village.demotionFloor').bound;
    const cityCeiling = envelope('tierInertia.matchedPressure.city.demotionCeiling').bound;
    const acuteWorstRatio = CORPUS_N / acuteFloor;
    expect(acuteWorstRatio, 'the acute floor no longer bounds the tiers closer than matched pressure separates them')
      .toBeLessThan(villageFloor / cityCeiling);
    const acuteCounts = TIERS.map((tier) => countAt('acute', tier));
    expect(Math.max(...acuteCounts) / Math.min(...acuteCounts), 'acute ratio across tiers')
      .toBeLessThanOrEqual(acuteWorstRatio);
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

  // R-B2 (LANDING-7, the chair): a place born inside the owner's band overlap CONVERGES to the stamp it
  // already carries; it does not drift. The two are counted apart and pinned through their own doors.
  const calmClassified = (tier) => {
    const { cut, leadIn } = calmGeometry(tier);
    return trialsAt('calm', tier).map((trial) => ({
      seed: trial.seed,
      born: trial.population >= cut ? 'overlap' : trial.population >= leadIn ? 'leadIn' : 'below',
      promoted: Boolean(trial.outcome),
      eligible: trial.eligibilities.some((eligibility) => eligibility.direction === 'promotion'),
    }));
  };

  it('CONVERGENCE: the overlap-born calm promotions are exactly the overlap-born places that can promote', () => {
    for (const tier of TIERS) {
      const rows = calmClassified(tier);
      const convergence = rows.filter((row) => row.promoted && row.born === 'overlap').map((row) => row.seed);
      const overlapEligible = rows.filter((row) => row.born === 'overlap' && row.eligible).map((row) => row.seed);
      expect(convergence, `${tier}: every overlap-born place that reads promotion-eligible converges, none other`)
        .toEqual(overlapEligible);
      expect(
        rows.filter((row) => row.promoted && row.born === 'below').map((row) => row.seed),
        `${tier}: a calm promotion born below the lead-in is neither convergence nor drift`,
      ).toEqual([]);
    }
    // Anti-vacuity: the two overlapping bands converge, the city band (no overlap with metropolis) cannot.
    expect(calmClassified('village').filter((row) => row.promoted && row.born === 'overlap').length).toBeGreaterThan(0);
    expect(calmClassified('town').filter((row) => row.promoted && row.born === 'overlap').length).toBeGreaterThan(0);
    expect(calmClassified('city').filter((row) => row.born === 'overlap').length).toBe(0);
  });

  it('DRIFT: each tier\'s lead-in promotions sit in the binomial band its own roll geometry predicts', () => {
    const driftCounts = [];
    for (const tier of TIERS) {
      const { share } = calmGeometry(tier);
      const expected = CORPUS_N * share;
      const tolerance = DRIFT_BAND_Z * Math.sqrt(CORPUS_N * share * (1 - share));
      const drift = calmClassified(tier).filter((row) => row.promoted && row.born === 'leadIn').length;
      driftCounts.push(drift);
      expect(
        Math.abs(drift - expected),
        `${tier}: ${drift} lead-in promotions of ${CORPUS_N} against ${expected.toFixed(1)} expected (`
        + `${(share * 100).toFixed(2)}% of the roll band), band +/- ${tolerance.toFixed(1)} (two-sided alpha 1e-3)`,
      ).toBeLessThanOrEqual(tolerance);
    }
    // ...and the matched-pressure spread still exceeds the calm DRIFT spread: the gap is the stressors'.
    const matchedCounts = TIERS.map((tier) => countAt('matched', tier));
    expect(Math.max(...matchedCounts) - Math.min(...matchedCounts))
      .toBeGreaterThan(Math.max(...driftCounts) - Math.min(...driftCounts));
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
