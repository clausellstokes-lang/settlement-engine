import { describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  BEHAVIORAL_CONTRACT_VERSION,
  BEHAVIORAL_MOVER_FAMILIES,
  BEHAVIORAL_OBSERVATION_VERSION,
  CERTIFICATION_HORIZONS,
  SOAK_RECEIPT_SCHEMA_VERSION,
  WAR_CONVERGENCE_OBSERVATION_VERSION,
  WAR_ENDING_KEYS,
  WAR_RULINGS_FLAG_KEYS,
  WAR_TERMINATION_DECIDING_TERM_KEYS,
  createEmptyWarConvergenceObservation,
  evaluateBehavioralCertification,
  validateHumanChronicleReview,
  validateWarConvergenceObservation,
} from '../../src/domain/certification/behavioralContract.js';
// Imported from the contract module directly rather than through
// behavioralContract's re-export block: that file sits at 795 effective lines
// against an 800 ceiling and is NOT in scripts/.size-baseline.json, so three
// convenience re-exports would make it a new offender the size walker demands be
// decomposed. The vocabulary's own module is its home anyway.
import {
  WAR_CONVERGENCE_TUNING,
  WAR_DURATION_BANDS,
  WAR_DURATION_LENGTH_BANDS,
  warDurationBandFor,
} from '../../src/domain/certification/warConvergenceContract.js';
import { WAR_CONVERGENCE_FORCE_IDS } from '../../src/domain/certification/warConvergenceForces.js';

/**
 * WR-9c: the one force with NO substrate anywhere in the tree. It is UNOBSERVED on
 * every corpus, so it is the certificate's permanent, disclosed failure until the
 * engine can pair a seat transition with a war duration. Named from the exported id
 * rather than copied, so a rename moves this with it.
 */
const STRUCTURALLY_UNOBSERVED = [WAR_CONVERGENCE_FORCE_IDS[2]];

const SOURCE_COMMIT = 'a'.repeat(40);
const CRITERIA = {
  causalLegibility: 'pass',
  temporalCoherence: 'pass',
  settlementAttribution: 'pass',
  arcReadability: 'pass',
};

function yearlyObservation(year, settlementIds) {
  const moverCounts = Object.fromEntries(
    BEHAVIORAL_MOVER_FAMILIES.map((family) => [family, 1]),
  );
  const eventTypeCounts = Object.fromEntries(
    Array.from({ length: 12 }, (_, index) => [`event_${index}`, 1]),
  );
  const attentionCounts = Object.fromEntries(
    settlementIds.map((id) => [id, 1]),
  );
  const stateVectors = Object.fromEntries(settlementIds.map((id, index) => [
    id,
    {
      population: 1_000 + year + index,
      prosperity: 3 + (year % 5 === 0 ? 1 : 0),
      topFaction: year % 20 < 10 ? 'Council' : 'Guild',
      powerEntropy: year % 2 ? 0.42 : 0.50,
    },
  ]));
  return {
    year,
    eventCount: 20,
    majorEventCount: 2,
    eventTypeCounts,
    moverCounts,
    arcCounts: { constructive: 1, destructive: 1 },
    motion: {
      populationTransitions: settlementIds.length,
      populationMoved: Math.max(1, Math.ceil(settlementIds.length * 0.1)),
      prosperityTransitions: settlementIds.length,
      prosperityMoved: Math.max(1, Math.ceil(settlementIds.length * 0.05)),
      powerTransitions: settlementIds.length,
      powerMoved: Math.max(1, Math.ceil(settlementIds.length * 0.04)),
    },
    attentionCounts,
    succession: {
      pendingProposals: 3,
      attempts: 2,
      completions: 1,
      integrityFailures: 0,
    },
    causal: {
      crossFamilyEdges: 1,
      familyPairs: [
        `economy->politics`,
        `war->population`,
        `faith->constructive`,
      ],
    },
    stateVectors,
  };
}

function behavioralReceipt(years, settlements, seed, { controls = false } = {}) {
  const caseId = `release-${years}y-${settlements}s-seed${seed}`;
  const settlementIds = Array.from(
    { length: settlements },
    (_, index) => `${caseId}-s${index}`,
  );
  return {
    schemaVersion: SOAK_RECEIPT_SCHEMA_VERSION,
    caseId,
    seed: `contract-${caseId}`,
    years,
    settlements,
    behavioral: {
      schemaVersion: BEHAVIORAL_OBSERVATION_VERSION,
      kind: 'whole_world_behavioral_observation',
      settlementIds,
      yearly: Array.from(
        { length: years },
        (_, index) => yearlyObservation(index + 1, settlementIds),
      ),
      controls: controls
        ? {
            neighbor: {
              executed: true,
              checkpoints: [
                { year: 1, targetDistance: 0.0005 },
                { year: 10, targetDistance: 0.0012 },
                { year: 30, targetDistance: 0.0020 },
              ],
            },
            dark: {
              executed: true,
              litBaselineActivityCount: 20,
              darkActivityCount: 0,
              conditionalStateLeaks: [],
            },
          }
        : {},
    },
    warConvergence: {
      schemaVersion: WAR_CONVERGENCE_OBSERVATION_VERSION,
      kind: 'war_convergence_observation',
      // A SHAPED mix rather than a flat one-each row (WR-9c). The flat mix made
      // every one of the eight endings equally common, which puts HALF the corpus
      // on a terminal road and cannot satisfy force 6's "rare but present" — a
      // fixture nobody could ever pass is not a passing fixture. These counts keep
      // every earlier assertion true (eight distinct keys, no dominant road, both
      // sack roads live at a 1:1 ratio) and put the terminal share under its
      // ceiling where a plausible world would put it.
      endingsMix: {
        terms: 8,
        exhaustion: 4,
        ruler_change: 3,
        fragmentation: 3,
        annihilation: 1,
        conquest: 1,
        punitive_sack_initiation: 1,
        punitive_sack_vengeance: 1,
      },
      // WR-9's duration envelope: a TAIL, no infinity, and nothing unread. Every
      // measured band is exercised (a flat one-each histogram would leave
      // `generational` unproven), the short share clears its floor at 8/12, the
      // generational share sits just under its 0.1 ceiling at 1/12, `unresolved` is
      // zero because a war still burning at the horizon is the no-infinity failure
      // rather than a long war, and `unmeasured` is zero because a duration nobody
      // could read is not a short war either (WR-9r).
      warDurationHistogram: {
        short: 8, long: 3, generational: 1, unresolved: 0, unmeasured: 0,
      },
      terminationDecidingTermHistogram: Object.fromEntries(
        WAR_TERMINATION_DECIDING_TERM_KEYS.map((key) => [key, 1]),
      ),
      flagCertificationRows: WAR_RULINGS_FLAG_KEYS.map((rule) => ({
        rule,
        ruleState: 'on',
        verdict: 'ALIVE',
      })),
      // WR-9c's force address, filled so the five FILLABLE force cells can be seen
      // passing. Force 3 has no address here because it has none anywhere: nothing
      // in the engine pairs a seat transition with a war duration, so no fixture
      // can make that cell pass and this one does not pretend to.
      forceEvidence: {
        // Means 0.20 / 0.40 / 0.70 — pressure rising as the war lengthens, which is
        // the whole of force 1's claim.
        homeFrontByDurationBand: {
          opening: { samples: 4, scoreTotal: 0.8 },
          sustained: { samples: 3, scoreTotal: 1.2 },
          protracted: { samples: 2, scoreTotal: 1.4 },
        },
        capabilityReadings: { readings: 20, atCollapse: 3 },
        compromiseWideningSequences: [[0.06, 0.13, 0.21], [0.06, 0.06, 0.18]],
        coalitionFragmentation: { fragmentations: 2, pairwisePeaces: 5 },
      },
    },
  };
}

function humanReview(caseIds) {
  return {
    schemaVersion: 1,
    kind: 'human_chronicle_review',
    reviewerKind: 'human',
    reviewer: 'reviewer-1',
    reviewedAt: '2026-07-28T12:00:00.000Z',
    sourceCommit: SOURCE_COMMIT,
    verdict: 'pass',
    entriesReviewed: 30,
    sampleCaseIds: caseIds,
    includedFinalDecade: true,
    criteria: CRITERIA,
    blockingNotes: [],
  };
}

function passingInput() {
  const receipts = [
    behavioralReceipt(30, 12, 1, { controls: true }),
    behavioralReceipt(30, 12, 2, { controls: true }),
    behavioralReceipt(100, 4, 1, { controls: true }),
    behavioralReceipt(100, 12, 2),
  ];
  const centuryCaseIds = receipts
    .filter((receipt) => receipt.years === 100)
    .map((receipt) => receipt.caseId);
  return {
    profile: 'release',
    complete: true,
    source: { commit: SOURCE_COMMIT },
    receipts,
    humanReview: humanReview(centuryCaseIds),
  };
}

function distributeReleaseWarFlagCoverage(receipts) {
  const releaseReceipts = receipts.filter(
    (receipt) => receipt.years === CERTIFICATION_HORIZONS.release.years,
  );
  for (const [caseIndex, receipt] of releaseReceipts.entries()) {
    for (const [flagIndex, row] of receipt.warConvergence.flagCertificationRows.entries()) {
      const aliveHere = caseIndex === flagIndex % releaseReceipts.length;
      row.ruleState = aliveHere ? 'on' : 'off';
      row.verdict = aliveHere ? 'ALIVE' : 'DORMANT_BY_CONFIG';
    }
  }
  return releaseReceipts;
}

describe('behavioral certification contract', () => {
  it('fixes the useful, release, and research horizon roles', () => {
    expect(BEHAVIORAL_CONTRACT_VERSION).toBe(5);
    expect(CERTIFICATION_HORIZONS.useful).toMatchObject({
      years: 30,
      productGate: false,
    });
    expect(CERTIFICATION_HORIZONS.release).toMatchObject({
      years: 100,
      productGate: true,
    });
    expect(CERTIFICATION_HORIZONS.research).toMatchObject({
      years: 300,
      productGate: false,
    });
  });

  /**
   * ⚠️⚠️ A DELIBERATE, DISCLOSED VERDICT SHIFT (WR-9c). Before the six force cells
   * landed, this fixture earned the whole certificate. It cannot any more, and the
   * reason is the finding rather than a regression: amendment L obliges SIX forces
   * to be audited, and force 3 ("ruler-change frequency rising with war duration")
   * has no substrate at all — a seat-transition row names no war and carries no war
   * age, so no corpus can fill it. Its cell answers UNOBSERVED, UNOBSERVED is
   * non-passing, and the acceptance harness therefore reports an unmet obligation
   * instead of certifying around its own blind spot.
   *
   * THE PIN KEEPS ITS TEETH by asserting the failure set EXACTLY: every other
   * automated group, including the five fillable force cells, must still pass, so
   * any new failure lands here as loudly as the old `toEqual([])` did.
   */
  it('reports exactly the one force that has no substrate, and passes everything else', () => {
    const result = evaluateBehavioralCertification(passingInput());
    expect(result.schemaVersion).toBe(BEHAVIORAL_CONTRACT_VERSION);
    expect(result.observationsComplete).toBe(true);
    expect(result.humanChronicleReview.passed).toBe(true);
    expect(result.failures).toEqual(STRUCTURALLY_UNOBSERVED);
    expect(result.automatedPassed).toBe(false);
    expect(result.passed).toBe(false);
    // The cell says UNOBSERVED with its reason, never a bare FAIL: "the world did
    // not do this" and "nothing could have measured this" are opposite repairs.
    const force3 = result.checks.find((check) => check.id === STRUCTURALLY_UNOBSERVED[0]);
    expect(force3).toMatchObject({
      passed: false,
      state: 'UNOBSERVED',
      unobservedReason: 'no_substrate_in_tree',
    });
    expect(result.propertiesEarned).toEqual(expect.arrayContaining([
      'mover_activity',
      'event_tempo_diversity',
      'constructive_and_destructive_arcs',
      'state_motion',
      'neighbor_perturbation',
      'succession_integrity',
      'attention_fairness',
      'dark_controls',
      'interaction_bounded',
      'stressor_rhythm',
      'no_stasis',
      'chronicle_human_reviewed',
    ]));
    expectAbsentWithAnchor(
      result.propertiesEarned,
      'war_convergence_instrumented',
      'event_tempo_diversity',
      'one unauditable force withholds the WR-9 property from an otherwise clean matrix',
    );
    // THE BOUNDARY SENTENCE MOVES WITH THE VERDICT, and that is the honest half of
    // the shift: a release-profile matrix with an unauditable force is not eligible,
    // and the claim boundary says so instead of offering a manifest entry.
    expect(result.claimBoundary).toMatch(/Not eligible for product certification/);
  });

  it('fails closed instead of reinterpreting a pre-v4 observation receipt', () => {
    const input = passingInput();
    for (const receipt of input.receipts) {
      receipt.behavioral.schemaVersion = BEHAVIORAL_OBSERVATION_VERSION - 1;
    }
    const result = evaluateBehavioralCertification(input);
    expect(result.releaseCasesMeasured).toBe(0);
    expect(result.observationsComplete).toBe(false);
    expect(result.automatedPassed).toBe(false);
    expect(result.passed).toBe(false);
  });

  it('keeps v4 receipts readable but ineligible for WR-9 certification', () => {
    const input = passingInput();
    for (const receipt of input.receipts) {
      receipt.schemaVersion = 4;
      delete receipt.warConvergence;
    }
    const result = evaluateBehavioralCertification(input);
    expect(result.observationsComplete).toBe(true);
    expect(result.automatedPassed).toBe(false);
    expect(result.failures).toContain('war_convergence.receipt_shape');
    expectAbsentWithAnchor(
      result.propertiesEarned,
      'war_convergence_instrumented',
      'event_tempo_diversity',
      'stale receipts cannot earn the WR-9 property',
    );
  });

  it('rejects vacuous WR-9 histograms and flag rows that never earned ALIVE', () => {
    const input = passingInput();
    for (const receipt of input.receipts) {
      receipt.warConvergence = createEmptyWarConvergenceObservation();
      for (const row of receipt.warConvergence.flagCertificationRows) {
        row.ruleState = 'on';
        row.verdict = 'SILENT';
      }
    }
    const result = evaluateBehavioralCertification(input);
    expect(result.failures).toEqual(expect.arrayContaining([
      'war_convergence.non_vacuous',
      'war_convergence.flag_coverage',
    ]));
  });

  it('accepts flag life distributed across release cases without requiring every flag on everywhere', () => {
    const input = passingInput();
    const releaseReceipts = distributeReleaseWarFlagCoverage(input.receipts);
    expect(releaseReceipts).toHaveLength(2);

    const result = evaluateBehavioralCertification(input);
    const coverage = result.checks.find((check) => check.id === 'war_convergence.flag_coverage');
    expect(coverage).toMatchObject({
      passed: true,
      threshold: { minAliveCasesPerFlag: 1, maxUnobservedCasesPerFlag: 0 },
    });
    expect(coverage.threshold).toEqual({ minAliveCasesPerFlag: 1, maxUnobservedCasesPerFlag: 0 });
    for (const rule of WAR_RULINGS_FLAG_KEYS) {
      expect(coverage.observed.flags[rule]).toEqual({
        on: 1,
        alive: 1,
        silent: 0,
        unobserved: 0,
      });
    }
    // Distributed coverage adds NO failure of its own: the only cell still down is
    // the force with no substrate. (Before WR-9c this line read
    // `propertiesEarned toContain war_convergence_instrumented`; that property is
    // now withheld by force 3 for every corpus, so the claim is made at the
    // failure-set level where it still has teeth.)
    expect(result.failures).toEqual(STRUCTURALLY_UNOBSERVED);
  });

  it('rejects one unobserved release case even when the same flag is alive elsewhere', () => {
    const input = passingInput();
    const releaseReceipts = distributeReleaseWarFlagCoverage(input.receipts);
    const rule = WAR_RULINGS_FLAG_KEYS[0];
    const unobserved = releaseReceipts[1].warConvergence.flagCertificationRows
      .find((row) => row.rule === rule);
    unobserved.ruleState = 'unknown';
    unobserved.verdict = 'UNOBSERVED';

    const result = evaluateBehavioralCertification(input);
    const nonVacuous = result.checks.find((check) => check.id === 'war_convergence.non_vacuous');
    const coverage = result.checks.find((check) => check.id === 'war_convergence.flag_coverage');
    expect(nonVacuous.passed).toBe(true);
    expect(coverage.passed).toBe(false);
    expect(coverage.observed.flags[rule]).toMatchObject({ alive: 1, unobserved: 1 });
    expectAbsentWithAnchor(
      result.propertiesEarned,
      'war_convergence_instrumented',
      'event_tempo_diversity',
      'an ALIVE sibling cannot conceal an UNOBSERVED release case',
    );
  });

  it('fails closed when a mover goes dark in the final decade', () => {
    const input = passingInput();
    for (const receipt of input.receipts) {
      for (const year of receipt.behavioral.yearly.slice(-10)) {
        year.moverCounts.faith = 0;
      }
    }
    const result = evaluateBehavioralCertification(input);
    expect(result.automatedPassed).toBe(false);
    expect(result.failures).toContain('mover.faith.tail');
    expectAbsentWithAnchor(
      result.propertiesEarned,
      'mover_activity',
      'event_tempo_diversity',
      'one dark mover removes only the mover-activity property',
    );
  });

  it('does not let pending succession proposals satisfy applied-attempt gates', () => {
    const input = passingInput();
    for (const receipt of input.receipts) {
      for (const year of receipt.behavioral.yearly) {
        year.succession.pendingProposals = 1_000;
        year.succession.attempts = 0;
        year.succession.completions = 0;
      }
    }
    const result = evaluateBehavioralCertification(input);
    const succession = result.checks.find(
      (check) => check.id === 'succession.integrity',
    );

    expect(succession?.passed).toBe(false);
    expect(succession?.observed).toMatchObject({
      pendingProposals: 200_000,
      attempts: 0,
      completions: 0,
    });
    expect(result.failures).toContain('succession.integrity');
  });

  it('fails closed on dark-control leakage or a missing human review', () => {
    const input = passingInput();
    input.receipts[0].behavioral.controls.dark.conditionalStateLeaks.push(
      'spatialLedgers',
    );
    input.humanReview = null;
    const result = evaluateBehavioralCertification(input);
    expect(result.failures).toContain('controls.dark');
    expect(result.humanChronicleReview.passed).toBe(false);
    expect(result.passed).toBe(false);
  });

  it('rejects malformed dark-control fields instead of treating absence as zero', () => {
    const input = passingInput();
    delete input.receipts[0].behavioral.controls.dark.darkActivityCount;
    delete input.receipts[1].behavioral.controls.dark.conditionalStateLeaks;
    const result = evaluateBehavioralCertification(input);
    expect(result.failures).toContain('controls.dark');
  });

  it('never turns a 30-year or 300-year profile into the product certificate', () => {
    for (const profile of ['weekly', 'research']) {
      const result = evaluateBehavioralCertification({
        ...passingInput(),
        profile,
      });
      expect(result.profileEligible).toBe(false);
      expect(result.automatedPassed).toBe(false);
      expect(result.passed).toBe(false);
      expect(result.claimBoundary).toMatch(/cannot earn/);
    }
  });
});

describe('WR-9 war-convergence receipt contract', () => {
  it('exports one closed vocabulary and a builder-safe empty observation', () => {
    expect(WAR_ENDING_KEYS).toEqual([
      'terms',
      'exhaustion',
      'ruler_change',
      'fragmentation',
      'annihilation',
      'conquest',
      'punitive_sack_initiation',
      'punitive_sack_vengeance',
    ]);
    expect(WAR_TERMINATION_DECIDING_TERM_KEYS).toEqual([
      'cause',
      'cost_to_continue',
      'cost_to_stop',
      'momentum',
    ]);
    expect(WAR_RULINGS_FLAG_KEYS).toEqual([
      'warTerminationEnabled',
      'dispositionChannelsEnabled',
      'lineageClaimEnabled',
      'coalitionLedgerEnabled',
      'envoyDiplomacyEnabled',
      'conquestDoctrineEnabled',
      'sovereigntyTradeEnabled',
    ]);

    const empty = createEmptyWarConvergenceObservation();
    expect(validateWarConvergenceObservation(empty)).toMatchObject({ ok: true, errors: [] });
    expect(Object.values(empty.endingsMix).every((count) => count === 0)).toBe(true);
    expect(empty.flagCertificationRows).toHaveLength(WAR_RULINGS_FLAG_KEYS.length);
    expect(empty.flagCertificationRows.every((row) => (
      row.ruleState === 'unknown' && row.verdict === 'UNOBSERVED'
    ))).toBe(true);
  });

  it('fails closed on missing, unknown, duplicate, or malformed evidence', () => {
    const malformed = createEmptyWarConvergenceObservation();
    delete malformed.endingsMix.terms;
    malformed.endingsMix.decorative_victory = 1;
    malformed.terminationDecidingTermHistogram.cause = -1;
    malformed.flagCertificationRows[1] = {
      ...malformed.flagCertificationRows[0],
      ruleState: 'off',
      verdict: 'ALIVE',
    };

    const result = validateWarConvergenceObservation(malformed);
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/missing terms/);
    expect(result.errors.join(' ')).toMatch(/unknown key decorative_victory/);
    expect(result.errors.join(' ')).toMatch(/cause must be a non-negative integer/);
    expect(result.errors.join(' ')).toMatch(/duplicates warTerminationEnabled/);
    expect(result.errors.join(' ')).toMatch(/off with DORMANT_BY_CONFIG/);
    expect(result.errors.join(' ')).toMatch(/missing dispositionChannelsEnabled/);

    const unknownAlive = createEmptyWarConvergenceObservation();
    unknownAlive.flagCertificationRows[0].verdict = 'ALIVE';
    expect(validateWarConvergenceObservation(unknownAlive).errors.join(' '))
      .toMatch(/cannot claim ALIVE from an unknown rule state/);
  });
});

describe('human Chronicle review evidence', () => {
  it('requires a real human, release cases, breadth, the final decade, and all criteria', () => {
    const input = passingInput();
    expect(validateHumanChronicleReview(input.humanReview, {
      sourceCommit: SOURCE_COMMIT,
      eligibleCaseIds: input.receipts.map((receipt) => receipt.caseId),
    }).ok).toBe(true);

    const invalid = {
      ...input.humanReview,
      reviewerKind: 'automated',
      includedFinalDecade: false,
      criteria: { ...CRITERIA, causalLegibility: 'fail' },
    };
    const result = validateHumanChronicleReview(invalid, {
      sourceCommit: SOURCE_COMMIT,
      eligibleCaseIds: input.receipts.map((receipt) => receipt.caseId),
    });
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/reviewerKind/);
    expect(result.errors.join(' ')).toMatch(/includedFinalDecade/);
    expect(result.errors.join(' ')).toMatch(/causalLegibility/);
  });

  it('requires an explicit empty blocking-notes array', () => {
    const input = passingInput();
    delete input.humanReview.blockingNotes;
    const result = validateHumanChronicleReview(input.humanReview, {
      sourceCommit: SOURCE_COMMIT,
      eligibleCaseIds: input.receipts
        .filter((receipt) => receipt.years === 100)
        .map((receipt) => receipt.caseId),
    });
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/blockingNotes/);
  });
});

/**
 * WR-9's two envelopes, each driven by MUTANT NEGATIVE CONTROLS (§10.5: "every
 * envelope carries a mutant negative control"). A band asserted only on a
 * passing fixture is a number nobody has ever seen fail; each case below moves
 * exactly ONE property out of its envelope and requires that specific check —
 * and no neighbouring check — to red.
 */
describe('WR-9 convergence envelopes', () => {
  /**
   * Set the same duration histogram on every receipt and return the WHOLE
   * evaluation, so a case can assert which checks red and — just as importantly
   * — which ones stayed green.
   */
  function gradeCorpusWithDurations(histogram) {
    const input = passingInput();
    for (const receipt of input.receipts) {
      receipt.warConvergence.warDurationHistogram = histogram;
    }
    return evaluateBehavioralCertification(input);
  }

  /** The WR-9 cells only, id -> passed, for a corpus carrying `histogram`. */
  function warConvergenceVerdicts(histogram) {
    return Object.fromEntries(
      gradeCorpusWithDurations(histogram).checks
        .filter((check) => check.id.startsWith('war_convergence.'))
        .map((check) => [check.id, check.passed]),
    );
  }

  /** Set the same duration histogram on every receipt and return the graded check. */
  function gradeDurations(histogram) {
    return gradeCorpusWithDurations(histogram).checks
      .find((check) => check.id === 'war_convergence.duration_envelope');
  }

  /** Set the same endings mix on every receipt and return the graded check. */
  function gradeEndings(mix) {
    const input = passingInput();
    for (const receipt of input.receipts) {
      receipt.warConvergence.endingsMix = {
        ...Object.fromEntries(WAR_ENDING_KEYS.map((key) => [key, 0])),
        ...mix,
      };
    }
    const result = evaluateBehavioralCertification(input);
    return result.checks.find((check) => check.id === 'war_convergence.endings_envelope');
  }

  it('keeps the duration vocabulary closed — three lengths, then two distinct diagnoses', () => {
    // P4 (ORDER). `unmeasured` is appended LAST so the WR-9r addition is purely
    // additive and every pre-existing cell keeps its position.
    expect([...WAR_DURATION_LENGTH_BANDS]).toEqual(['short', 'long', 'generational']);
    expect([...WAR_DURATION_BANDS]).toEqual([
      'short', 'long', 'generational', 'unresolved', 'unmeasured',
    ]);
    expect(Object.keys(createEmptyWarConvergenceObservation().warDurationHistogram).sort())
      .toEqual([...WAR_DURATION_BANDS].sort());
    // Each bump is the version arm of the repair that motivated it: a v2
    // observation has no address for a lost duration, a v3 one has no address for
    // any force reading, and this module refuses to grade a shape it cannot read
    // rather than reinterpreting it. v3 -> v4 is WR-9c's `forceEvidence`.
    expect(WAR_CONVERGENCE_OBSERVATION_VERSION).toBe(4);
  });

  it('P4 — the totality validator rejects a histogram with no `unmeasured` address', () => {
    const missing = createEmptyWarConvergenceObservation();
    delete missing.warDurationHistogram.unmeasured;
    const result = validateWarConvergenceObservation(missing);
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/warDurationHistogram is missing unmeasured/);
  });

  it('bands a duration at each boundary of the declared table', () => {
    const shortMax = WAR_CONVERGENCE_TUNING.DURATION_SHORT_MAX_YEARS;
    const genMin = WAR_CONVERGENCE_TUNING.DURATION_GENERATIONAL_MIN_YEARS;
    // P3 (MEASURED HALF), driven off the REAL boundary constants rather than
    // copies of them, so a retuned table moves the fixture with it.
    expect(warDurationBandFor(0)).toBe('short');
    expect(warDurationBandFor(shortMax - 0.01)).toBe('short');
    expect(warDurationBandFor(shortMax)).toBe('long');
    expect(warDurationBandFor(genMin - 0.01)).toBe('long');
    expect(warDurationBandFor(genMin)).toBe('generational');
    expect(warDurationBandFor(genMin * 1_000)).toBe('generational');
    // Every measured length lands in a LENGTH band and never in a diagnosis.
    for (const years of [0, shortMax - 0.01, shortMax, genMin - 0.01, genMin, 1e6]) {
      expect(WAR_DURATION_LENGTH_BANDS).toContain(warDurationBandFor(years));
    }
  });

  /**
   * P3 (UNMEASURABLE HALF) — THE ROUTING TABLE, REWRITTEN BECAUSE EXECUTION
   * REFUTED THE DESIGN IT USED TO PIN.
   *
   * This case previously asserted `warDurationBandFor(Number.NaN) === 'short'`
   * and `warDurationBandFor(undefined) === 'short'`, on the stated rationale that
   * the `war_convergence.non_vacuous` wall would refuse a corpus that measured
   * nothing. That rationale was executed and found FALSE: `short` counted as
   * RESOLVED, so forty wars with entirely lost durations passed all five WR-9
   * checks with a short share of 1.0 (see the LOST-CORPUS pin below). The old
   * expectations were pinning the defect, so they are replaced rather than
   * extended — CR-WR9-A, vetoable.
   */
  it('P3 — every unmeasurable input class lands in `unmeasured`, and Infinity does not', () => {
    for (const lost of [undefined, null, Number.NaN, '', '   ', 'x', -5, -0.5, Number.NEGATIVE_INFINITY, true, {}, []]) {
      expect(warDurationBandFor(lost)).toBe('unmeasured');
    }
    // ⚠ `Number(null)`, `Number('')` and `Number(false)` are all 0. A router that
    // coerced first would hand the SHORTEST possible war to the LEAST possible
    // evidence, which is the exact inversion this case exists to forbid.
    expect(Number(null)).toBe(0);
    expect(Number('')).toBe(0);
    expect(warDurationBandFor(null)).not.toBe('short');
    expect(warDurationBandFor('')).not.toBe('short');
    // A numeric STRING is a measurement, not a loss.
    expect(warDurationBandFor('1')).toBe('short');
    expect(warDurationBandFor('40')).toBe('generational');
  });

  it('P2 — Infinity is UNRESOLVED, and one endless war reds the no-infinity wall', () => {
    // An endless war is a HORIZON fact stated as a number, not a lost reading:
    // routing it to `unmeasured` would let it escape the criterion it defines.
    expect(warDurationBandFor(Number.POSITIVE_INFINITY)).toBe('unresolved');
    expect(warDurationBandFor(Infinity)).not.toBe('unmeasured');
    expect(warDurationBandFor(Infinity)).not.toBe('short');
    // N4 (WR-9c) — THE STRING ARM, WHICH IS THE ONE A RECEIPT ACTUALLY TRAVELS ON.
    // `JSON.stringify(Infinity)` is `null`, so a collector that wants to say "this
    // war never ended" through a JSON receipt has to write the WORD. The numeric
    // arm was pinned at WR-9r and the string arm was not, leaving the only spelling
    // that survives serialization unguarded.
    expect(warDurationBandFor('Infinity')).toBe('unresolved');
    // ...and its mirror stays a lost reading rather than an endless war: a negative
    // duration is nonsense, not a horizon fact.
    expect(warDurationBandFor('-Infinity')).toBe('unmeasured');

    // One Infinity war, banded by the real router, reds the no-infinity wall.
    const band = warDurationBandFor(Number.POSITIVE_INFINITY);
    const histogram = {
      short: 8, long: 3, generational: 1, unresolved: 0, unmeasured: 0,
    };
    histogram[band] += 1;
    const verdicts = warConvergenceVerdicts(histogram);
    expect(verdicts['war_convergence.duration_envelope']).toBe(false);
    // SPECIFIC: it is the horizon wall that caught it, not the measured wall.
    expect(verdicts['war_convergence.duration_measured']).toBe(true);
    expect(WAR_CONVERGENCE_TUNING.UNRESOLVED_AT_HORIZON_MAX).toBe(0);
  });

  /**
   * P1 — THE LOST-CORPUS REPRO, PROMOTED FROM A ONE-OFF PROBE TO A PERMANENT PIN.
   *
   * This is the executed repro that rejected WR-9a: forty closed wars whose
   * durations were entirely lost, a healthy endings mix, and all-ALIVE flag rows.
   * Before WR-9r every one of those forty banded to `short`, `short` counted as
   * RESOLVED, and the corpus passed ALL FIVE checks — `duration_envelope`
   * included — on a short share of 1.0.
   *
   * NON-VACUITY IS PROVEN IN THE PIN ITSELF: the control half shows the very same
   * corpus passing once those forty durations are readable, so the red below can
   * only be the lost measurements and never some unrelated defect in the fixture.
   */
  it('P1 — forty wars with lost durations red the measured wall instead of passing as short', () => {
    // Band the lost durations through the REAL router rather than asserting a
    // cell name, so a re-routing regression lands here and not just in P3.
    const LOST_INPUT_CLASSES = [undefined, null, Number.NaN, '', 'x', -5];
    const lostBands = LOST_INPUT_CLASSES.map((years) => warDurationBandFor(years));
    expect(new Set(lostBands)).toEqual(new Set(['unmeasured']));

    // Only the TWO 100-year cases are graded (the 30-year ones are not release
    // cases), so twenty lost durations per case is the verifier's forty wars.
    const LOST_PER_RELEASE_CASE = 20;

    // THE CONTROL: the same forty wars with durations that CAN be read. Every WR-9
    // cell passes EXCEPT the one force that has no substrate on any corpus, so the
    // red below is the lost measurements and nothing else about the fixture. The
    // exception is asserted as an exact set rather than skipped, so a second cell
    // going dark cannot hide inside it.
    const control = warConvergenceVerdicts({
      short: 16, long: 4, generational: 0, unresolved: 0, unmeasured: 0,
    });
    expect(Object.entries(control).filter(([, passed]) => !passed).map(([id]) => id))
      .toEqual(STRUCTURALLY_UNOBSERVED);

    // THE REPRO: the same forty wars, durations lost.
    const repro = warConvergenceVerdicts({
      short: 0, long: 0, generational: 0, unresolved: 0, unmeasured: LOST_PER_RELEASE_CASE,
    });
    expect(repro['war_convergence.duration_measured']).toBe(false);
    expect(repro['war_convergence.receipt_shape']).toBe(true);
    expect(repro['war_convergence.endings_envelope']).toBe(true);
    expect(repro['war_convergence.flag_coverage']).toBe(true);

    // The lost wars are NOT laundered into the resolved denominator, which is the
    // arithmetic the old default depended on.
    const result = gradeCorpusWithDurations({
      short: 0, long: 0, generational: 0, unresolved: 0, unmeasured: LOST_PER_RELEASE_CASE,
    });
    const measured = result.checks.find((c) => c.id === 'war_convergence.duration_measured');
    const envelope = result.checks.find((c) => c.id === 'war_convergence.duration_envelope');
    expect(measured.observed.durationUnmeasured).toBe(40);
    expect(measured.threshold.maxUnmeasuredDurations).toBe(0);
    expect(envelope.observed.durationResolved).toBe(0);
    expect(envelope.observed.shortShare).toBe(0);
    // The whole certificate falls, and the WR-9 property is not earned.
    expect(result.automatedPassed).toBe(false);
    expect(result.failures).toContain('war_convergence.duration_measured');
    expectAbsentWithAnchor(
      result.propertiesEarned,
      'war_convergence_instrumented',
      'event_tempo_diversity',
      'a corpus that measured no duration cannot earn the WR-9 property',
    );
  });

  it('passes the duration envelope on the tail-shaped fixture', () => {
    const check = gradeDurations({ short: 8, long: 3, generational: 1, unresolved: 0, unmeasured: 0 });
    expect(check.passed).toBe(true);
    expect(check.observed.durationResolved).toBe(24);
    expect(check.threshold.ratified).toBe(false);
  });

  it('MUTANT — a single war alive at the horizon reds the no-infinity criterion', () => {
    const check = gradeDurations({ short: 8, long: 3, generational: 1, unresolved: 1, unmeasured: 0 });
    expect(check.passed).toBe(false);
    expect(check.observed.unresolvedAtHorizon).toBe(2);
    expect(check.threshold.maxUnresolvedAtHorizon).toBe(0);
  });

  it('MUTANT — a body of long wars with no short tail reds the tail floor', () => {
    const check = gradeDurations({ short: 1, long: 11, generational: 0, unresolved: 0, unmeasured: 0 });
    expect(check.passed).toBe(false);
    expect(check.observed.shortShare).toBeLessThan(
      WAR_CONVERGENCE_TUNING.DURATION_SHORT_MIN_SHARE,
    );
  });

  it('MUTANT — generational wars as a body rather than a tail reds the ceiling', () => {
    const check = gradeDurations({ short: 8, long: 0, generational: 4, unresolved: 0, unmeasured: 0 });
    expect(check.passed).toBe(false);
    expect(check.observed.generationalShare).toBeGreaterThan(
      WAR_CONVERGENCE_TUNING.DURATION_GENERATIONAL_MAX_SHARE,
    );
  });

  it('MUTANT — a corpus that measured no duration at all reds instead of passing empty', () => {
    const check = gradeDurations({ short: 0, long: 0, generational: 0, unresolved: 0, unmeasured: 0 });
    expect(check.passed).toBe(false);
    expect(check.observed.durationResolved).toBe(0);
  });

  it('passes the endings envelope when every road is live and none dominates', () => {
    const check = gradeEndings(Object.fromEntries(WAR_ENDING_KEYS.map((key) => [key, 1])));
    expect(check.passed).toBe(true);
    expect(check.observed.distinctEndingKeys).toBe(8);
    expect(check.observed.vengeanceShareOfSacks).toBe(0.5);
  });

  it('MUTANT — one path carrying nearly all endings reds the dominance ceiling', () => {
    const check = gradeEndings({
      ...Object.fromEntries(WAR_ENDING_KEYS.map((key) => [key, 1])),
      terms: 20,
    });
    expect(check.passed).toBe(false);
    expect(check.observed.dominantShare).toBeGreaterThan(
      WAR_CONVERGENCE_TUNING.ENDING_DOMINANCE_MAX_SHARE,
    );
    // The mutant must be SPECIFIC: distinctness is still satisfied here, so this
    // red is the dominance ceiling and nothing else.
    expect(check.observed.distinctEndingKeys).toBe(8);
  });

  it('MUTANT — too few reachable endings reds even when no single path dominates', () => {
    const check = gradeEndings({ terms: 2, exhaustion: 2, conquest: 2 });
    expect(check.passed).toBe(false);
    expect(check.observed.distinctEndingKeys).toBe(3);
    expect(check.observed.dominantShare).toBeLessThanOrEqual(
      WAR_CONVERGENCE_TUNING.ENDING_DOMINANCE_MAX_SHARE,
    );
  });

  it('MUTANT — a licence economy collapsed onto one sack road reds, both directions', () => {
    const initiationOnly = gradeEndings({
      ...Object.fromEntries(WAR_ENDING_KEYS.map((key) => [key, 1])),
      punitive_sack_vengeance: 0,
    });
    expect(initiationOnly.passed).toBe(false);
    expect(initiationOnly.observed.vengeanceShareOfSacks).toBe(0);

    const vengeanceOnly = gradeEndings({
      ...Object.fromEntries(WAR_ENDING_KEYS.map((key) => [key, 1])),
      punitive_sack_initiation: 0,
    });
    expect(vengeanceOnly.passed).toBe(false);
    expect(vengeanceOnly.observed.vengeanceShareOfSacks).toBe(1);
  });

  it('does not read a vacuous sack ratio as a healthy one', () => {
    // No burnings at all: the ratio has nothing to grade, so the sack band must
    // abstain and let the other cells decide. Six keys keeps distinctness met.
    const check = gradeEndings({
      terms: 2, exhaustion: 2, conquest: 2, annihilation: 2, ruler_change: 2, fragmentation: 2,
    });
    expect(check.observed.sacksObserved).toBe(0);
    expect(check.passed).toBe(true);
  });

  it('polices the duration histogram address by address, exactly as the other two', () => {
    const missing = createEmptyWarConvergenceObservation();
    delete missing.warDurationHistogram.generational;
    expect(validateWarConvergenceObservation(missing).ok).toBe(false);
    expect(validateWarConvergenceObservation(missing).errors.join(' '))
      .toMatch(/warDurationHistogram is missing generational/);

    const unknown = createEmptyWarConvergenceObservation();
    unknown.warDurationHistogram.eternal = 1;
    expect(validateWarConvergenceObservation(unknown).errors.join(' '))
      .toMatch(/warDurationHistogram has unknown key eternal/);

    const negative = createEmptyWarConvergenceObservation();
    negative.warDurationHistogram.short = -1;
    expect(validateWarConvergenceObservation(negative).errors.join(' '))
      .toMatch(/warDurationHistogram\.short must be a non-negative integer/);

    const fractional = createEmptyWarConvergenceObservation();
    fractional.warDurationHistogram.long = 1.5;
    expect(validateWarConvergenceObservation(fractional).errors.join(' '))
      .toMatch(/warDurationHistogram\.long must be a non-negative integer/);
  });

  it('polices the WR-9c force address through the SAME wall as the histograms', () => {
    // THE WIRING IS THE CLAIM HERE, not the force validator (which has its own
    // suite): a malformed force address must travel the observation validator and
    // land in `war_convergence.receipt_shape`, so an unpoliced address cannot ride
    // in behind a well-formed histogram.
    const malformed = createEmptyWarConvergenceObservation();
    malformed.forceEvidence.capabilityReadings = { readings: 2, atCollapse: 9 };
    const validation = validateWarConvergenceObservation(malformed);
    expect(validation.ok).toBe(false);
    expect(validation.errors.join(' ')).toMatch(/forceEvidence\.capabilityReadings\.atCollapse cannot exceed readings/);

    const input = passingInput();
    for (const receipt of input.receipts) {
      delete receipt.warConvergence.forceEvidence;
    }
    const result = evaluateBehavioralCertification(input);
    expect(result.failures).toContain('war_convergence.receipt_shape');
    const shape = result.checks.find((check) => check.id === 'war_convergence.receipt_shape');
    expect(JSON.stringify(shape.observed)).toMatch(/forceEvidence must be an object/);
  });

  it('rejects a stale v1 observation rather than reinterpreting it', () => {
    const stale = createEmptyWarConvergenceObservation();
    stale.schemaVersion = 1;
    delete stale.warDurationHistogram;
    const validation = validateWarConvergenceObservation(stale);
    expect(validation.ok).toBe(false);
    expect(validation.errors.join(' ')).toMatch(/schemaVersion must be 4/);
    expect(validation.errors.join(' ')).toMatch(/warDurationHistogram must be an object/);
  });
});
