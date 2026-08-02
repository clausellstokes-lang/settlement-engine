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
