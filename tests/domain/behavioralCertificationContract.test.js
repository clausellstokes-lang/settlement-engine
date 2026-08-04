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
  warDurationBandFor,
} from '../../src/domain/certification/warConvergenceContract.js';

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
      endingsMix: Object.fromEntries(WAR_ENDING_KEYS.map((key) => [key, 1])),
      // WR-9's duration envelope: a TAIL and no infinity. Every resolved band is
      // exercised (a flat one-each histogram would leave `generational` unproven),
      // the short share clears its floor at 8/12, the generational share sits just
      // under its 0.1 ceiling at 1/12, and `unresolved` is zero because a war still
      // burning at the horizon is the no-infinity failure, not a long war.
      warDurationHistogram: { short: 8, long: 3, generational: 1, unresolved: 0 },
      terminationDecidingTermHistogram: Object.fromEntries(
        WAR_TERMINATION_DECIDING_TERM_KEYS.map((key) => [key, 1]),
      ),
      flagCertificationRows: WAR_RULINGS_FLAG_KEYS.map((rule) => ({
        rule,
        ruleState: 'on',
        verdict: 'ALIVE',
      })),
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

  it('passes only when every automated group and the human Chronicle sample pass', () => {
    const result = evaluateBehavioralCertification(passingInput());
    expect(result.schemaVersion).toBe(BEHAVIORAL_CONTRACT_VERSION);
    expect(result.observationsComplete).toBe(true);
    expect(result.automatedPassed).toBe(true);
    expect(result.humanChronicleReview.passed).toBe(true);
    expect(result.passed).toBe(true);
    expect(result.failures).toEqual([]);
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
      'war_convergence_instrumented',
      'stressor_rhythm',
      'no_stasis',
      'chronicle_human_reviewed',
    ]));
    expect(result.claimBoundary).toMatch(/does not write or publish/);
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
    expect(result.propertiesEarned).toContain('war_convergence_instrumented');
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
  /** Set the same duration histogram on every receipt and return the graded check. */
  function gradeDurations(histogram) {
    const input = passingInput();
    for (const receipt of input.receipts) {
      receipt.warConvergence.warDurationHistogram = histogram;
    }
    const result = evaluateBehavioralCertification(input);
    return result.checks.find((check) => check.id === 'war_convergence.duration_envelope');
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

  it('keeps the duration vocabulary closed, and unresolved is a cell not a length', () => {
    expect([...WAR_DURATION_BANDS]).toEqual(['short', 'long', 'generational', 'unresolved']);
    expect(Object.keys(createEmptyWarConvergenceObservation().warDurationHistogram).sort())
      .toEqual([...WAR_DURATION_BANDS].sort());
    expect(WAR_CONVERGENCE_OBSERVATION_VERSION).toBe(2);
  });

  it('bands a duration at each boundary of the declared table', () => {
    const shortMax = WAR_CONVERGENCE_TUNING.DURATION_SHORT_MAX_YEARS;
    const genMin = WAR_CONVERGENCE_TUNING.DURATION_GENERATIONAL_MIN_YEARS;
    expect(warDurationBandFor(0)).toBe('short');
    expect(warDurationBandFor(shortMax - 0.01)).toBe('short');
    expect(warDurationBandFor(shortMax)).toBe('long');
    expect(warDurationBandFor(genMin - 0.01)).toBe('long');
    expect(warDurationBandFor(genMin)).toBe('generational');
    // Total on garbage rather than throwing: a census that lost a tick must
    // still produce an addressable histogram; non-vacuity is a separate wall.
    expect(warDurationBandFor(Number.NaN)).toBe('short');
    expect(warDurationBandFor(undefined)).toBe('short');
    // `unresolved` is a horizon fact, never a length — the bander cannot mint it.
    const banded = [0, 1, 10, 100, 1e6].map((y) => warDurationBandFor(y));
    expect(banded.includes('unresolved')).toBe(false);
  });

  it('passes the duration envelope on the tail-shaped fixture', () => {
    const check = gradeDurations({ short: 8, long: 3, generational: 1, unresolved: 0 });
    expect(check.passed).toBe(true);
    expect(check.observed.durationResolved).toBe(24);
    expect(check.threshold.ratified).toBe(false);
  });

  it('MUTANT — a single war alive at the horizon reds the no-infinity criterion', () => {
    const check = gradeDurations({ short: 8, long: 3, generational: 1, unresolved: 1 });
    expect(check.passed).toBe(false);
    expect(check.observed.unresolvedAtHorizon).toBe(2);
    expect(check.threshold.maxUnresolvedAtHorizon).toBe(0);
  });

  it('MUTANT — a body of long wars with no short tail reds the tail floor', () => {
    const check = gradeDurations({ short: 1, long: 11, generational: 0, unresolved: 0 });
    expect(check.passed).toBe(false);
    expect(check.observed.shortShare).toBeLessThan(
      WAR_CONVERGENCE_TUNING.DURATION_SHORT_MIN_SHARE,
    );
  });

  it('MUTANT — generational wars as a body rather than a tail reds the ceiling', () => {
    const check = gradeDurations({ short: 8, long: 0, generational: 4, unresolved: 0 });
    expect(check.passed).toBe(false);
    expect(check.observed.generationalShare).toBeGreaterThan(
      WAR_CONVERGENCE_TUNING.DURATION_GENERATIONAL_MAX_SHARE,
    );
  });

  it('MUTANT — a corpus that measured no duration at all reds instead of passing empty', () => {
    const check = gradeDurations({ short: 0, long: 0, generational: 0, unresolved: 0 });
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

  it('rejects a stale v1 observation rather than reinterpreting it', () => {
    const stale = createEmptyWarConvergenceObservation();
    stale.schemaVersion = 1;
    delete stale.warDurationHistogram;
    const validation = validateWarConvergenceObservation(stale);
    expect(validation.ok).toBe(false);
    expect(validation.errors.join(' ')).toMatch(/schemaVersion must be 2/);
    expect(validation.errors.join(' ')).toMatch(/warDurationHistogram must be an object/);
  });
});
