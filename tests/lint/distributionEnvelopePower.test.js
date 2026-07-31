/**
 * distributionEnvelopePower.test.js — the registry gate for derived distribution
 * bounds (epistemic prevention, wave EP-1).
 *
 * THE CLASS: hand-picked integer bounds on a sampled rate can pass with EXACTLY ZERO
 * margin. The criminal-capture instrument asserted `capture <= 4` over a corpus of
 * N=40 whose expected count was 2 with a standard error of 1.4; the measured value
 * landed on 4, the gate was green, and it carried no power at all. A bound the current
 * behaviour touches is not a guardrail.
 *
 * THIS GATE enforces three things over
 * tests/fixtures/distribution-envelopes.manifest.json:
 *   (a) DERIVATION — every registered bound is re-derived here from its measured base
 *       rate and corpus size. A registered bound that does not match its own derivation
 *       reds. When `loosenPending` is set, the derivation is LOOSER than the live bound;
 *       the live bound stays in force (program law: never loosen a bound silently) and
 *       the entry must then be strictly tighter than the derivation. Once the owner
 *       resolves that choice by retaining the stricter bound, `ratifiedStricterBound`
 *       records the durable exception instead of pretending the decision is pending.
 *   (b) POWER — margin >= 2 sigma, and never zero. An instrument whose bound sits
 *       inside two standard errors of its own mean cannot tell tuning drift from
 *       ordinary corpus variation.
 *   (c) PROVENANCE — baseMeasuredAt, baseMeasurementN >= 400, measurementContext. A
 *       base rate with no recorded measurement is a guess wearing a decimal point, and
 *       the capture instrument proved a 40-sample base rate carries a +/-4% standard
 *       error — wider than the margin it was being asked to judge.
 *
 * TOTALITY: a frozen roster of the estate's distribution-shaped instruments. Each row
 * must either read its bound from the helper or carry a registered rationale. Rows
 * start `pendingMigration` (a placeholder rationale, counted against an exact baseline)
 * and retire as wave EP-2D measures each base rate. The baseline is SHRINK-ONLY and
 * asserted by exact equality, so a migration that forgets to bank its win reds just as
 * loudly as a regression — the uncoveredBaseline idiom from the E-A manifest.
 *
 * ROSTER PROVENANCE (read before editing the roster): docs/EPISTEMIC_PREVENTION_PLAN.md
 * names "the 11 candidate files" for wave EP-2D but does not enumerate them, so this
 * roster was derived here on 2026-07-27 by scanning tests/{property,simulation,
 * generators,joins,domain,kernel} for the instrument shape — a corpus loop of N >= 20
 * whose assertion bounds a COUNT or RATE with a non-trivial literal (existence checks
 * like `> 0` and `>= 1` excluded). That scan returns 21 files, of which 10 were taken
 * onto the roster; captureBirthScale.test.js was added by hand as the trigger (its
 * bounds are written as `Math.round(N * 0.1)`, so no bare literal for the scan to see).
 *
 * WAVE EP-2D then READ all twelve. The scan is a shape heuristic, and shape lied about
 * more than half of them: seven rows turned out to hold no stochastic bound at all —
 * their big loops are DETERMINISTIC reachability sweeps (hash-selected variant pools),
 * constant-rng soaks, or per-draw invariants. Those rows are retired with a
 * classification, not a migration: there is nothing to derive. The remaining five are
 * real, and their state is recorded row by row below.
 *
 * THE 11 DEFERRED SCAN HITS (enumerated here because the plan never recorded them, and
 * an unrecorded deferral is a dropped thread). Classified 2026-07-27 by reading each:
 *   NOT rate instruments — no follow-up owed:
 *     tests/generators/dossierContent.test.js       catalog-size ratchet (entries >= 301)
 *     tests/joins/cascade.test.js                   static catalog predicate count (>= 20)
 *     tests/domain/advanceNpcCorruption.test.js     single-value rank check
 *     tests/domain/generosityKernel.twoClaimants…   one-tick existence count
 *     tests/domain/migrationWithMortality.test.js   continuous scalars + hard caps
 *     tests/domain/pietyReceipts.test.js            structural lengths + a severity scalar
 *     tests/domain/settlementLifecycleKernel…       scalar thresholds, single run
 *     tests/domain/spatialSubstrate.test.js         structural lengths
 *   RATE INSTRUMENTS — follow-up warranted. All three of the .test.js candidates were
 *   taken by wave EP-5 (2026-07-27) and are now ROSTERED AND MIGRATED above:
 *     tests/domain/ancientRuinsGeneration.test.js   0 < minted < 20 over a 40-seed sweep;
 *       a two-sided generation-rate envelope, and at N=40 it is the same small-corpus
 *       shape as the trigger. Strongest remaining candidate. CLOSED by EP-5 — and it
 *       proved N=40 cannot carry a two-sided instrument at all, so the corpus doubled.
 *     tests/domain/roadsMissions.test.js            0.05 < perNpcYear < 0.9 soak band;
 *       genuine two-sided rate, variable denominator (needs the fixed-n treatment).
 *       CLOSED by EP-5 — the denominator turned out FIXED (NPC-years), not
 *       outcome-divided, so no fixed-n workaround was needed; it is guarded instead.
 *       The src finding EP-5 filed from that closure ("5 cadence violations") was
 *       WITHDRAWN under EP-6 (finding EP-l, 2026-07-28) — see the roadsMissions
 *       roster row below for the record.
 *     tests/joins/ordering.test.js (EP-2D marked NOT MINE — another agent's partition —
 *       and classified only: `unwalledSieges >= 10`, `walledSieges <= 0.7 * unwalled` ARE
 *       a two-sided rate comparison over a corpus). CLOSED by EP-5.
 *   CLOSED AS TOTALITY, deliberately not an envelope:
 *     tests/generators/historyNoUndefinedProse.test.js   `generated > 80` of 192 configs is an
 *       anti-vacuity floor on a THROW rate; the honest tightening is totality
 *       (`=== 192`), not an envelope — any throw is a defect. Owner delegation on
 *       2026-07-28 ratified the exact totality claim. Not roster-eligible because
 *       this is a throw contract rather than a distribution-rate instrument.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  binomialTailAtLeast,
  binomialTailAtMost,
  envelopeBound,
  logChoose,
  readEnvelope,
} from '../helpers/distributionEnvelope.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MANIFEST_PATH = join(ROOT, 'tests/fixtures/distribution-envelopes.manifest.json');

/** @type {{ entries: import('../helpers/distributionEnvelope.js').EnvelopeEntry[] }} */
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
const entries = manifest.entries || [];

/** Program law: a base rate must rest on at least this many samples. */
const MIN_MEASUREMENT_N = 400;

/** Program law: a bound closer than this to its own mean is not an instrument. */
const MIN_MARGIN_SIGMAS = 2;

/**
 * FROZEN 2026-07-27 (composite-r4 d0fdcf7c). The estate's distribution-shaped
 * instruments. SHRINK-ONLY in the pendingMigration column: retire a row by measuring
 * its base rate at N >= 400, registering the entry in the manifest, switching the file
 * to readEnvelope, then setting pendingMigration false AND lowering
 * PENDING_MIGRATION_BASELINE by one. Never add a pendingMigration row; a NEW
 * distribution instrument is registered properly on the day it is written.
 */
const DISTRIBUTION_TOTALITY = Object.freeze([
  // ── MIGRATED: reads its bounds from the manifest ────────────────────────────
  { file: 'tests/generators/captureBirthScale.test.js', pendingMigration: false,
    rationale: 'EP-2D MIGRATED 2026-07-27; owner-ratified ordinary-town migration '
      + '2026-07-28. Five bounds derived and registered '
      + '(ordinaryTown.corrupted 20, ordinaryCity.corrupted 7, criminalTown.capture 40 '
      + 'ratified stricter, criminalCity.capture 29, criminalCity.equilibrium 388). THREE bounds '
      + 'remain deliberately NOT registered, each labelled at its assertion: all rest on a '
      + 'measured rate of '
      + 'exactly 0 or 1 (ordinary-village corrupted 0/400, ordinary-village none 400/400, '
      + 'criminal-town equilibrium 400/400) where a binomial envelope is degenerate and '
      + 'would assert certainty the sample cannot buy. The ordinary-town ceiling moved '
      + 'from the powerless 10 (0.34 sigma) to the derived 20 (3.709 sigma).' },
  { file: 'tests/generators/narrativeQualityCorpus.test.js', pendingMigration: false,
    rationale: 'EP-2D MIGRATED 2026-07-27. One real bound: the relationship-rumor emission '
      + 'floor, was a hand-picked `> 40` sitting 8.1 sigma BELOW the mean of a 160-draw '
      + 'corpus; now the derived 71 (measured 57.25% at 400 draws, 3.29 sigma). The file\'s '
      + 'other big loops are deterministic sweeps, not rate instruments.' },
  { file: 'tests/joins/ordering.test.js', pendingMigration: false,
    rationale: 'EP-5 MIGRATED 2026-07-27 (roster EXTENSION — a tightening; EP-2D classified '
      + 'this file as a real two-sided instrument but it belonged to another partition, so it '
      + 'was never rostered). The walls-suppress-sieges paired comparison over 120 `siege-${i}` '
      + 'seeds. Two entries: unwalledFloor (lower, live 10 ratified stricter — the alpha-1e-3 '
      + 'derivation of 6 is looser) and walledCeiling (upper 17, NEW). The pre-existing RELATIVE '
      + 'assertion (walled <= floor(unwalled * 0.7)) is KEPT alongside the absolute envelope: '
      + 'the ratio is blind to both arms inflating together and the envelope is blind to a '
      + 'suppression collapse scaling both. Measured 62/400 and 23/400; the test\'s own corpus '
      + 'reads 21/120 and 6/120, 0.61 sigma apart from the family — no divergence.' },
  { file: 'tests/domain/ancientRuinsGeneration.test.js', pendingMigration: false,
    rationale: 'EP-5 MIGRATED 2026-07-27 (roster EXTENSION — EP-2D named it the strongest '
      + 'remaining candidate but left it off the roster). Two-sided mint-rate envelope, '
      + 'measured 43/400 on the `anc-${i}` family. THE CORPUS WAS DOUBLED 40 -> 80: at the '
      + 'authored N=40 the anti-vacuity floor of 1 carries 1.685 sigma and NO non-vacuous bound '
      + 'can reach the 2-sigma bar (the achievable ceiling there is 2.195, at the vacuous 0). '
      + 'At 80 the floor carries 2.743 and the ceiling of 19 is a 2x tightening in rate terms '
      + '(23.75% vs the authored 47.5%). Runtime cost ~135 ms. The floor is loosenPending: its '
      + 'derivation is the vacuous 0.' },
  { file: 'tests/domain/roadsMissions.test.js', pendingMigration: false,
    rationale: 'EP-5 MIGRATED 2026-07-27 (roster EXTENSION); RE-DERIVED and finding WITHDRAWN '
      + 'under EP-6 (finding EP-l) 2026-07-28. EP-2D flagged the variable denominator as '
      + 'needing the fixed-n '
      + 'treatment; it turned out FIXED, not outcome-divided — the trial unit is the NPC-year '
      + '(12 NPCs x 3 years = 36) and the same test asserts at most one GENESIS departure per '
      + 'NPC-year, so the Bernoulli unit is exact. A denominator guard in the test pins 36. '
      + 'Base rate is the GENESIS rate 201/576 over 16 runs of the identical fixture: the '
      + '2026-07-27 reading of 207/576 counted every mission id, and 6 of those ids were '
      + 'release-return legs (releasedFromRansom) — the RESOLUTION of a captivity, not a '
      + 'fresh dispatch, and the cadence law governs genesis dispatch only. The ceiling '
      + 'tightened 32 -> 23 and holds unchanged at the genesis rate (margin 3.495 -> 3.650); '
      + 'the floor tightened 2 -> 4 and is ratified stricter — at the genesis rate its own '
      + 'alpha-1e-3 derivation is the LOOSER 3, so the live 4 stays in force (2.994 sigma) '
      + 'and the loosening is filed for the owner, not taken here. THE 2026-07-27 FINDING IS '
      + 'WITHDRAWN: the "cadence law VIOLATED on 5 of 16 seeds" was an artefact of this '
      + 'instrument, not a producer defect. The release path (roadsKernel.js PASS 4) mints a '
      + 'NEW mission id whose startedYear is the RELEASE year, and the old counting summed '
      + 'every mission id per npcKey|startedYear, so one interrupted journey counted twice; '
      + 'each of the five flagged keys holds exactly one releasedFromRansom leg. Realigned '
      + 'with the charter counting (tests/property/roadsCharter.test.js), GENESIS violations '
      + 'measure 0 across all 17 seeds — the law is real and correctly enforced at the '
      + 'genesis cadence stamps (roadsKernel.js PASS 5). The same investigation surfaced a '
      + 'DIFFERENT, REAL producer defect, fixed under EP-6 (finding EP-l): SELF-CAPTURE (a '
      + 'court taking its '
      + 'own envoy hostage), which accounted for 4 of the 7 ransoms in that corpus.' },
  { file: 'tests/simulation/tierInertiaEnvelope.test.js', pendingMigration: false,
    rationale: 'WAVE W-A ROSTER EXTENSION 2026-07-31 (a tightening — a NEW instrument, born '
      + 'derived, which is the only way a row may join this file). Realm directive 6 / J-D6: '
      + 'TIER-INERTIA CONFIRMATION. NINE bounds over a 3 x 3 matrix (village/town/city x '
      + 'calm/matched/acute stressor load), each arm a 120-seed corpus of generated settlements '
      + 'advanced 8 pulse ticks through the REAL tier-drift chain '
      + '(generateSettlementPipeline -> buildWorldSnapshot -> deriveSettlementPressures -> '
      + 'pressureIndex -> evaluateTierResourceDynamics -> rollCandidates). Trial unit is one '
      + 'seeded settlement under a HELD stressor load, so the Bernoulli unit is exact and the '
      + 'denominator is fixed by the corpus rather than by an outcome; denominator guards in the '
      + 'test pin the corpus size, the horizon, the injected archetype count, and all three '
      + 'severities. VERDICT CONFIRMED: at matched severity the village arm is floored at 87/120 '
      + 'while the town arm is capped at 42 and the city arm at 24, so village > town > city holds '
      + 'STRUCTURALLY (any corpus satisfying the three bounds satisfies the ordering); at acute '
      + 'severity all three arms are floored at 105 or above, so the gap closes. The calm arm is '
      + 'the control: three statistically indistinguishable rates (10.5 / 11.0 / 10.75 percent), '
      + 'every event a PROMOTION, each floored so the matched-pressure ceilings can never go '
      + 'vacuous. Base rates measured at N=400 on the same seed family; the worst corpus/family '
      + 'divergence across the nine cells is 1.81 sigma. No bound here is loosenPending or a '
      + 'ratified stricter override — every one is exactly its alpha-1e-3 derivation. THE RECORDED '
      + 'BOUNDARY (J-D6 tuning-band routing, no engine edit): the inertia is EMERGENT, not '
      + 'structural. Every demotion in the corpus fires the population-independent '
      + 'structural-failure branch (support <= 0.25) — pinned two ways — and that branch is '
      + 'SCALE-FREE: matched support plus matched relative headroom returns an identical verdict '
      + 'at all three rungs (severity 0.48, minimum streak 2, probability 0.9452). The one '
      + 'structural tier term is the PROMOTION streak ladder (4 / 5 / 6); the demotion requirement '
      + 'is flat at 2 across village, town, and city.' },

  // ── STILL OWED: a real instrument, blocked for a stated reason ──────────────
  { file: 'tests/simulation/distributionEnvelopes.test.js', pendingMigration: true,
    rationale: 'EP-2D MEASURED, NOT MIGRATED. Seven real bounds across four envelopes, and '
      + 'two blockers. (1) SEED-SPACE NON-UNIFORMITY: the corpus is `envelope-${i}` for '
      + 'i<50, and that prefix is a statistically unusual corner. Thorp "Struggling" '
      + 'measures 4/50 over the corpus but 89/400 over the extended family (22.25%); index '
      + 'blocks 50-99 .. 350-399 measure 13,12,8,12,15,10,15 and a length-matched control '
      + '(`envelope-000`..`envelope-049`) measures 14. A bound derived from the 400-seed '
      + 'rate would centre on 11.1 while the corpus reliably lands on 4 — a misspecified '
      + 'envelope that reds on day one. The valid fix is corpus == measurement (raise N to '
      + '400), which takes the file from ~22 s to ~150 s and blows the per-commit budget. '
      + '(2) Three of the bounds (hook repeat rate, stress-type share) divide by an OUTCOME '
      + '(total hooks / total stress entries), so they need a fixed-n treatment plus a '
      + 'denominator guard before an integer bound means anything. Full measurement table '
      + 'is in the EP-2D report; nothing here is guesswork any more.' },
  { file: 'tests/domain/calamity.test.js', pendingMigration: false,
    rationale: 'EP-2D MEASURED 2026-07-27; owner-ratified and MIGRATED 2026-07-28. The '
      + '50-year multi-seed realm soak asserts a realized strike interval in [10, 20] years, '
      + 'i.e. totalStrikes in [100, 200] over 15,053 eligible settlement-year rolls. '
      + 'Measured 2026-07-27: 147 strikes at the test\'s own 40 seeds; 1317/151,372 = '
      + '0.87% per eligible roll at 400 seeds (the analytic hazard is 1/(15*8) = 0.833%). '
      + 'The repaired lower-tail helper now completes at this scale. The upper bound tightens '
      + '200 -> 169; the derived lower 96 would be looser, so the owner-ratified live 100 '
      + 'stays registered as a stricter override. The test pins the exact eligible-roll denominator.' },
  { file: 'tests/domain/distribution.test.js', pendingMigration: false,
    rationale: 'EP-2D ROSTER EXTENSION 2026-07-27 (a tightening: this file is the "generous '
      + 'thresholds at N=40" precedent the program was named for, and it was missing). '
      + 'Owner-ratified as TOTALITY and MIGRATED 2026-07-28. SIX former rate thresholds '
      + 'bound events that never happen. At N=400: towns with '
      + 'enforcement 400/400, cities with enforcement 400/400, cities with multiple factions '
      + '400/400, towns with formal authority 400/400, cities with any hook 400/400, '
      + 'isolated trade-gate violations 0/400. They now assert exact totality instead of '
      + 'manufacturing a degenerate binomial envelope. The three non-degenerate bounds '
      + '(cities definingCrisis 399/400; city stable-chain share 0.548; town history-beat '
      + 'fill 0.950) all divide by an outcome or span correlated slots within one '
      + 'settlement, so they need the fixed-n treatment too.' },

  // ── NOT DISTRIBUTION INSTRUMENTS: classified EP-2D, nothing to derive ───────
  { file: 'tests/domain/guidanceNotes.test.js', pendingMigration: false,
    rationale: 'EP-2D CLASSIFIED: not a rate instrument. The 200-iteration loop sweeps '
      + 'SYNTHETIC IDS through noteKeyFor and asserts every authored variant is reached '
      + '(`reached.size === cell.length`) — a deterministic hash-coverage proof with no '
      + 'stochastic count. Its other numeric bounds are authored-content floors '
      + '(>= 2 variants per cell). Nothing here has a base rate.' },
  { file: 'tests/domain/pestilence.test.js', pendingMigration: false,
    rationale: 'EP-2D CLASSIFIED: not a rate instrument. The one count bound '
      + '(`totalMaterializations < 60` over a 5-year 16-node soak) runs under a CONSTANT '
      + 'rng (`rng: ALWAYS`, random() === 0) so every roll fires by construction — the '
      + 'count is a fixed number, not a sample. The 20-year soak asserts arrival ORDERING '
      + 'and drain-to-empty, not incidence.' },
  { file: 'tests/domain/newsBody.test.js', pendingMigration: false,
    rationale: 'EP-2D CLASSIFIED: not a rate instrument. The 400-id loop asserts full pool '
      + 'reachability (`seen[cell].size === pool.length`) over deterministic id-hashed '
      + 'picks. No sampled count anywhere in the file.' },
  { file: 'tests/domain/marketPrices.test.js', pendingMigration: false,
    rationale: 'EP-2D CLASSIFIED: not a rate instrument. The 300-iteration loop is crier-'
      + 'frame reachability over deterministic good-id hashing; the price band '
      + '(38 <= coppers <= 48) pins ONE deterministic quote, not a distribution. The module '
      + 'is source-scanned for the absence of Math.random in the same file.' },
  { file: 'tests/domain/rumorNetwork.test.js', pendingMigration: false,
    rationale: 'EP-2D CLASSIFIED: not a rate instrument. The 200-fork degradeTelling loop '
      + 'asserts PER-DRAW invariants (party ids stay in-world, magnitude stays in 0..3, '
      + 'fidelity stays > 0) — a totality claim over every draw, which is strictly stronger '
      + 'than any envelope and has no count to bound.' },
  { file: 'tests/domain/settlementRumors.test.js', pendingMigration: false,
    rationale: 'EP-2D CLASSIFIED: not a rate instrument. The 300-ref and 40-ref loops are '
      + 'headline-frame reachability over deterministic event-ref hashing; the `rumors.length` '
      + 'assertions are exact (=== 1) on hand-built ledgers. No sampled rate.' },
  { file: 'tests/domain/traditionGenesis.test.js', pendingMigration: false,
    rationale: 'EP-2D CLASSIFIED: not a rate instrument. The tier bands assert that EVERY '
      + 'seed lands inside [lo, hi] — a hard per-draw invariant, not a count over a corpus '
      + '(an envelope would be strictly weaker). The 220-config loop counts determinism '
      + 'mismatches and asserts exactly 0.' },
]);

/**
 * Exact, shrink-only. Lower by one per retired row; never raise.
 * 11 -> 3 at wave EP-2D (2026-07-27): two rows MIGRATED (captureBirthScale,
 * narrativeQualityCorpus), seven CLASSIFIED as non-instruments, one row ADDED
 * (tests/domain/distribution.test.js — a roster extension, which is a tightening).
 * UNCHANGED at 3 by wave EP-5 (2026-07-27): three rows ADDED (ordering,
 * ancientRuinsGeneration, roadsMissions — EP-2D's recorded follow-up candidates), all
 * three arriving MIGRATED rather than pending, so the roster grew 12 -> 15 while the
 * pending column did not move. A row may only ever join this file already derived.
 * 3 -> 1 on 2026-07-28 after owner delegation: calamity migrated to a two-sided
 * strike-count envelope, and distribution.test's six degenerate 0/400 or 400/400
 * rates became explicit totality invariants. The seed-family mismatch instrument
 * remains the sole pending row.
 * UNCHANGED at 1 by wave W-A (2026-07-31): one row ADDED
 * (tests/simulation/tierInertiaEnvelope.test.js, the realm-directive-6 tier-inertia
 * confirmation), arriving MIGRATED with nine derived bounds, so the roster grew
 * 15 -> 16 while the pending column did not move.
 */
const PENDING_MIGRATION_BASELINE = 1;

/** A file counts as migrated when it reads its bound from the canonical helper. */
function readsFromHelper(relPath) {
  const abs = join(ROOT, relPath);
  if (!existsSync(abs)) return false;
  const source = readFileSync(abs, 'utf8');
  return /distributionEnvelope\.js|readEnvelope\s*\(/.test(source);
}

/**
 * Validate one manifest entry, returning a list of problems (empty = sound). Kept as a
 * pure function so the guard-the-guard block below can run it over synthetic entries —
 * with an empty manifest the real loop asserts nothing, and a validator proven only by
 * a zero-length loop is exactly the vacuous green this program exists to kill.
 * Deliberately NOT exported: importing a symbol out of a .test.js file re-evaluates the
 * module and re-registers its suites in every importer (tests/helpers/dormancyOracle.js
 * records the incident). The synthetic-entry describe below is its only caller.
 *
 * @param {any} entry
 * @returns {string[]}
 */
function validateEnvelopeEntry(entry) {
  const problems = [];
  const id = entry && entry.id ? entry.id : '(unnamed entry)';
  const check = (cond, message) => { if (!cond) problems.push(`${id}: ${message}`); };

  check(typeof entry?.id === 'string' && entry.id.length > 0, 'missing id');
  check(typeof entry?.file === 'string' && entry.file.length > 0, 'missing file');
  check(Number.isInteger(entry?.n) && entry.n > 0, `n must be a positive integer, got ${entry?.n}`);
  check(typeof entry?.baseRate === 'number' && entry.baseRate >= 0 && entry.baseRate <= 1,
    `baseRate must be in [0, 1], got ${entry?.baseRate}`);
  check(entry?.direction === 'upper' || entry?.direction === 'lower',
    `direction must be 'upper' or 'lower', got ${entry?.direction}`);
  check(typeof entry?.alpha === 'number' && entry.alpha > 0 && entry.alpha < 1,
    `alpha must be in (0, 1), got ${entry?.alpha}`);
  check(Number.isInteger(entry?.bound), `bound must be an integer, got ${entry?.bound}`);

  // (c) PROVENANCE — a base rate with no recorded measurement is a guess.
  check(/^\d{4}-\d{2}-\d{2}$/.test(String(entry?.baseMeasuredAt)),
    `baseMeasuredAt must be an ISO date (YYYY-MM-DD), got ${entry?.baseMeasuredAt}`);
  check(Number.isInteger(entry?.baseMeasurementN) && entry.baseMeasurementN >= MIN_MEASUREMENT_N,
    `baseMeasurementN must be >= ${MIN_MEASUREMENT_N} (a 40-sample base rate carries a +/-4% `
    + `standard error — wider than the margin it would be judging), got ${entry?.baseMeasurementN}`);
  check(typeof entry?.measurementContext === 'string' && entry.measurementContext.length > 0,
    'measurementContext must name the tree/commit the measurement was taken in');
  check(typeof entry?.loosenPending === 'boolean', 'loosenPending must be an explicit boolean');
  check(entry?.ratifiedStricterBound === undefined
    || typeof entry.ratifiedStricterBound === 'boolean',
    'ratifiedStricterBound, when present, must be a boolean');
  check(!(entry?.loosenPending && entry?.ratifiedStricterBound),
    'a stricter live bound cannot be both pending and ratified');
  if (entry?.ratifiedStricterBound) {
    check(
      typeof entry?.notes === 'string' && /ratif/i.test(entry.notes),
      'ratifiedStricterBound requires a note that records the ratification',
    );
  }

  if (problems.length) return problems;

  const derived = envelopeBound({
    n: entry.n, baseRate: entry.baseRate, direction: entry.direction, alpha: entry.alpha,
  });

  // (a) DERIVATION.
  if (entry.loosenPending || entry.ratifiedStricterBound) {
    const tighter = entry.direction === 'upper'
      ? entry.bound < derived.bound
      : entry.bound > derived.bound;
    const disposition = entry.ratifiedStricterBound
      ? 'ratifiedStricterBound'
      : 'loosenPending';
    check(tighter,
      `${disposition} is set but the registered bound ${entry.bound} is not TIGHTER than the `
      + `derivation ${derived.bound}. This disposition exists only to keep a tighter live bound `
      + `in force; if the derivation is tighter, adopt it and clear the flag.`);
  } else {
    check(entry.bound === derived.bound,
      `registered bound ${entry.bound} does not match the derivation ${derived.bound} `
      + `(n=${entry.n}, baseRate=${entry.baseRate}, ${entry.direction}, alpha=${entry.alpha}). `
      + `Either re-derive the bound, or — if the derivation is LOOSER and you are keeping the `
      + `current bound — set loosenPending while the choice is open, or ratifiedStricterBound `
      + `after the owner retains it.`);
  }

  // (b) POWER, measured on the REGISTERED bound (the one the test actually asserts).
  const expected = entry.n * entry.baseRate;
  const sigma = Math.sqrt(entry.n * entry.baseRate * (1 - entry.baseRate));
  const liveMargin = sigma > 0 ? Math.abs(entry.bound - expected) / sigma : Infinity;
  check(liveMargin > 0,
    `the registered bound sits exactly ON the expected count (${expected}) — zero margin. This `
    + `is the capture-bound defect verbatim: the gate is a coin flip that has not yet come up `
    + `tails.`);
  check(liveMargin >= MIN_MARGIN_SIGMAS,
    `margin ${liveMargin.toFixed(3)} sigma is under the ${MIN_MARGIN_SIGMAS} sigma floor. An `
    + `instrument whose bound sits this close to its own mean cannot tell tuning drift from `
    + `ordinary corpus variation — raise n, or accept a looser bound and say so.`);
  if (typeof entry.margin === 'number') {
    check(Math.abs(entry.margin - liveMargin) < 0.05,
      `recorded margin ${entry.margin} disagrees with the recomputed ${liveMargin.toFixed(3)} — `
      + `the entry's fields have drifted apart`);
  }
  return problems;
}

describe('distribution-envelope registry: derivation, power, provenance', () => {
  test('every registered entry re-derives, carries >= 2 sigma of power, and names its provenance', () => {
    const problems = entries.flatMap((entry) => validateEnvelopeEntry(entry));
    expect(problems).toEqual([]);
  });

  test('entry ids are unique (one canonical home per bound)', () => {
    const ids = entries.map((entry) => entry.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
  });

  test('every registered entry names a file that still exists', () => {
    const missing = entries
      .filter((entry) => entry.file && !existsSync(join(ROOT, entry.file)))
      .map((entry) => `${entry.id}: ${entry.file} no longer exists`);
    expect(missing).toEqual([]);
  });

  // ── TOTALITY ───────────────────────────────────────────────────────────────
  test('every roster instrument still exists', () => {
    const missing = DISTRIBUTION_TOTALITY
      .filter((row) => !existsSync(join(ROOT, row.file)))
      .map((row) => `${row.file}: deleted or moved — remove its DISTRIBUTION_TOTALITY row`);
    expect(missing).toEqual([]);
  });

  test('every roster instrument either reads the helper or carries a rationale', () => {
    const unaccounted = [];
    for (const row of DISTRIBUTION_TOTALITY) {
      if (readsFromHelper(row.file)) continue;
      if (typeof row.rationale === 'string' && row.rationale.trim().length > 0) continue;
      unaccounted.push(
        `${row.file}: neither reads its bound from tests/helpers/distributionEnvelope.js nor `
        + `carries a rationale. A distribution-shaped instrument with a hardcoded bound and no `
        + `stated reason is the hand-picked-bound defect. Migrate it, or write down why not.`,
      );
    }
    expect(unaccounted).toEqual([]);
  });

  test('a migrated file is not still marked pendingMigration (the roster cannot lie)', () => {
    const contradictions = DISTRIBUTION_TOTALITY
      .filter((row) => row.pendingMigration && readsFromHelper(row.file))
      .map((row) => `${row.file}: reads the envelope helper but is still flagged pendingMigration `
        + `— clear the flag and lower PENDING_MIGRATION_BASELINE by one to bank the win`);
    expect(contradictions).toEqual([]);
  });

  test('pendingMigration count matches the baseline exactly (shrink-only)', () => {
    const pending = DISTRIBUTION_TOTALITY.filter((row) => row.pendingMigration).length;
    expect(
      pending,
      `${pending} roster rows are pendingMigration against a baseline of `
      + `${PENDING_MIGRATION_BASELINE}. ABOVE the baseline: a new un-derived distribution bound `
      + `was added — register it properly instead. BELOW: a row was migrated; lower `
      + `PENDING_MIGRATION_BASELINE to ${pending} to bank the win. Exact equality, never <=.`,
    ).toBe(PENDING_MIGRATION_BASELINE);
  });

  test('the roster is frozen and non-vacuous', () => {
    expect(DISTRIBUTION_TOTALITY.length, 'roster size').toBe(16);
    const files = DISTRIBUTION_TOTALITY.map((row) => row.file);
    expect(files.filter((f, i) => files.indexOf(f) !== i), 'duplicate roster rows').toEqual([]);
  });
});

// ── GUARD-THE-GUARD: the mathematics, on known values ────────────────────────
// The manifest STARTED empty — on day one the validation loop above asserted nothing,
// and a validator proven only by a zero-length loop is the vacuous green this whole
// program exists to kill. The manifest has since filled with live entries, but those
// all pass in a green run, so the validator's failure branches are still proven only
// here — the tails, the bound search, and the validator are each exercised directly
// on known values, and stay exercised no matter how the manifest fills.
describe('binomial envelope mathematics (self-test)', () => {
  test('exact tails match hand-computable values', () => {
    // Bin(10, 0.5): P(X<=4) = (1+10+45+120+210)/1024 = 386/1024.
    expect(binomialTailAtMost(10, 0.5, 4)).toBeCloseTo(386 / 1024, 12);
    expect(binomialTailAtLeast(10, 0.5, 5)).toBeCloseTo(1 - 386 / 1024, 12);
    // Symmetry of a fair binomial about its mean.
    expect(binomialTailAtLeast(10, 0.5, 6)).toBeCloseTo(binomialTailAtMost(10, 0.5, 4), 12);
    // The plan's worked example — the small-N regime where a normal approximation is worst.
    expect(binomialTailAtLeast(40, 0.05, 4)).toBeCloseTo(0.138150, 6);
    expect(logChoose(10, 5)).toBeCloseTo(Math.log(252), 10);
  });

  test('tails are complementary and bounded', () => {
    for (const k of [1, 7, 27, 60]) {
      expect(binomialTailAtLeast(400, 0.0675, k) + binomialTailAtMost(400, 0.0675, k - 1))
        .toBeCloseTo(1, 12);
    }
    expect(binomialTailAtLeast(40, 0.05, 0)).toBe(1);
    expect(binomialTailAtLeast(40, 0.05, 41)).toBe(0);
    expect(binomialTailAtMost(40, 0.05, -1)).toBe(0);
    expect(binomialTailAtMost(40, 0.05, 40)).toBe(1);
  });

  test('envelopeBound reproduces the capture instrument', () => {
    // The trigger case: n=400, measured capture rate 6.75%.
    const at1pct = envelopeBound({ n: 400, baseRate: 0.0675, direction: 'upper', alpha: 1e-2 });
    expect(at1pct.expected).toBe(27);
    expect(at1pct.sigma).toBeCloseTo(5.0177, 4);
    // The live bound in captureBirthScale.test.js is Math.round(400 * 0.1) = 40 — which the
    // derivation reproduces exactly at a 1% false-failure budget.
    expect(at1pct.bound).toBe(40);
    expect(at1pct.margin).toBeCloseTo(2.591, 3);
    const atDefault = envelopeBound({ n: 400, baseRate: 0.0675, direction: 'upper' });
    expect(atDefault.bound).toBe(48);
    expect(atDefault.tail).toBeLessThanOrEqual(1e-4);
    const lower = envelopeBound({ n: 400, baseRate: 0.0675, direction: 'lower' });
    expect(lower.bound).toBe(9);
    expect(lower.tail).toBeLessThanOrEqual(1e-4);
  });

  test('the bound is the SMALLEST/LARGEST value meeting the budget (no slack)', () => {
    const upper = envelopeBound({ n: 400, baseRate: 0.0675, direction: 'upper', alpha: 1e-4 });
    expect(binomialTailAtLeast(400, 0.0675, upper.bound)).toBeLessThanOrEqual(1e-4);
    expect(binomialTailAtLeast(400, 0.0675, upper.bound - 1)).toBeGreaterThan(1e-4);
    const lower = envelopeBound({ n: 400, baseRate: 0.0675, direction: 'lower', alpha: 1e-4 });
    expect(binomialTailAtMost(400, 0.0675, lower.bound)).toBeLessThanOrEqual(1e-4);
    expect(binomialTailAtMost(400, 0.0675, lower.bound + 1)).toBeGreaterThan(1e-4);
  });

  test('the lower-direction search completes at calamity scale and stays canonical (EP-2D finding 5)', () => {
    // The original search walked DOWN from n - 1, re-summing the CDF at every probe —
    // O(answer * n), unfinishable at n ~ 15,000 (the calamity instrument's corpus).
    // The cure is an ascending incremental pass settled against the canonical tail;
    // this case pins BOTH properties: it finishes fast, and the answer is still the
    // exact largest-qualifying bound by the canonical function's own arithmetic.
    const started = Date.now();
    const lower = envelopeBound({ n: 15_053, baseRate: 0.0087, direction: 'lower', alpha: 1e-4 });
    expect(Date.now() - started).toBeLessThan(5_000);
    expect(binomialTailAtMost(15_053, 0.0087, lower.bound)).toBeLessThanOrEqual(1e-4);
    expect(binomialTailAtMost(15_053, 0.0087, lower.bound + 1)).toBeGreaterThan(1e-4);
    expect(lower.bound).toBeGreaterThan(0);
    expect(lower.bound).toBeLessThan(15_053 * 0.0087);
  });

  test('margins move monotonically as alpha tightens', () => {
    const alphas = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6];
    const upper = alphas.map((alpha) => envelopeBound({ n: 400, baseRate: 0.0675, direction: 'upper', alpha }));
    for (let i = 1; i < upper.length; i += 1) {
      expect(upper[i].bound, `upper bound at alpha=${alphas[i]}`).toBeGreaterThan(upper[i - 1].bound);
      expect(upper[i].margin, `upper margin at alpha=${alphas[i]}`).toBeGreaterThan(upper[i - 1].margin);
    }
    const lower = alphas.map((alpha) => envelopeBound({ n: 400, baseRate: 0.0675, direction: 'lower', alpha }));
    for (let i = 1; i < lower.length; i += 1) {
      expect(lower[i].bound, `lower bound at alpha=${alphas[i]}`).toBeLessThan(lower[i - 1].bound);
      expect(lower[i].margin, `lower margin at alpha=${alphas[i]}`).toBeGreaterThan(lower[i - 1].margin);
    }
  });

  test('readEnvelope refuses a missing id and a placeholder row', () => {
    expect(() => readEnvelope({ entries: [] }, 'capture.town.rate')).toThrow(/no entry 'capture.town.rate'/);
    expect(() => readEnvelope(
      { entries: [{ id: 'x', pendingMigration: true }] }, 'x',
    )).toThrow(/pendingMigration/);
  });
});

describe('envelope-entry validator (self-test on synthetic entries)', () => {
  /** A sound entry: the live capture bound, kept in force with its loosening pending. */
  const sound = Object.freeze({
    id: 'self-test.capture.town.rate',
    file: 'tests/generators/captureBirthScale.test.js',
    n: 400,
    baseRate: 0.0675,
    baseMeasuredAt: '2026-07-26',
    baseMeasurementN: 400,
    direction: 'upper',
    alpha: 1e-4,
    bound: 40,
    margin: 2.591,
    measurementContext: 'self-test fixture, not a registration',
    loosenPending: true,
    notes: 'exists only to prove the validator; never read as a live bound',
  });

  test('a sound entry passes', () => {
    expect(validateEnvelopeEntry(sound)).toEqual([]);
  });

  test('an owner-ratified stricter bound passes without remaining pending', () => {
    expect(validateEnvelopeEntry({
      ...sound,
      loosenPending: false,
      ratifiedStricterBound: true,
      notes: 'Owner-ratified stricter bound retained.',
    })).toEqual([]);
  });

  /** Every rule, each proven by the entry that breaks exactly it. */
  const caught = (overrides) => validateEnvelopeEntry({ ...sound, ...overrides }).join(` | `);

  test('power failures are caught', () => {
    // n=40, p=0.05: mean 2, sigma 1.378. Bound 2 IS the mean — zero margin.
    expect(caught({ n: 40, baseRate: 0.05, bound: 2, margin: 0, alpha: 1e-2 })).toMatch(/zero margin/);
    // Bound 4 sits 1.45 sigma out: the original capture instrument, green and powerless.
    expect(caught({ n: 40, baseRate: 0.05, bound: 4, margin: 1.451, alpha: 1e-2 }))
      .toMatch(/under the 2 sigma floor/);
  });

  test('provenance failures are caught', () => {
    expect(caught({ baseMeasurementN: 40 })).toMatch(/baseMeasurementN must be >= 400/);
    expect(caught({ baseMeasuredAt: 'last week' })).toMatch(/ISO date/);
    expect(caught({ measurementContext: '' })).toMatch(/measurementContext/);
    expect(caught({ loosenPending: undefined })).toMatch(/loosenPending must be an explicit boolean/);
    expect(caught({ ratifiedStricterBound: 'yes' })).toMatch(/must be a boolean/);
    expect(caught({ ratifiedStricterBound: true })).toMatch(/both pending and ratified/);
  });

  test('derivation failures are caught', () => {
    // loosenPending false demands exact agreement; 40 != the alpha=1e-4 derivation of 48.
    expect(caught({ loosenPending: false, ratifiedStricterBound: false }))
      .toMatch(/does not match the derivation 48/);
    // The flag keeps a TIGHTER live bound in force; it must not launder a looser one.
    expect(caught({ bound: 52, margin: 4.982 })).toMatch(/is not TIGHTER than the derivation/);
    expect(caught({ margin: 9.9 })).toMatch(/recorded margin 9.9 disagrees/);
  });
});
