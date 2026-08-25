/**
 * tests/domain/decisionTier.test.js — Advance-scaling Stage 2.
 *
 * Pins the MAJOR classifier + the recommended-outcome resolver:
 *   • deriveDecisionTier classifies on STRUCTURAL markers, never severity or
 *     applyMode. A UNIT TABLE asserts every applyMode:'auto' campaign-altering
 *     outcome (conquest power_transfer, occupation_vassalized, coup power_transfer,
 *     war_mobilization, government_change) is 'major', and a high-severity
 *     famine/economic outcome is 'minor'.
 *   • resolveProposalToOutcome stamps applyMode:'auto' with NO fresh RNG draw,
 *     byte-identical to the manual applyWorldPulseProposal resolve.
 */

import { describe, expect, test } from 'vitest';

import {
  deriveDecisionTier,
  isMajorOutcome,
  resolveProposalToOutcome,
} from '../../src/domain/worldPulse/decisionTier.js';

// Each row is the STRUCTURAL shape the live generators emit (severity + applyMode
// included to prove they are NOT the signal). Sourced from:
//   conquest               — warDeployment.js  (type power_transfer, cause conquest, applyMode auto)
//   occupation_vassalized  — occupation.js     (candidateType occupation_vassalized, applyMode auto)
//   coup_succeeded         — coup.js           (type power_transfer, cause coup, applyMode auto)
//   war_mobilization       — mobilizationEffects.js (candidateType war_mobilization, applyMode auto)
//   government_change      — factionCompetition.js  (proposalPayload.kind government_change)
const MAJOR_TABLE = [
  {
    label: 'conquest power_transfer (auto, sev 0.62)',
    outcome: {
      candidateType: 'conquest',
      type: 'power_transfer',
      applyMode: 'auto',
      severity: 0.62,
      powerTransfer: { cause: 'conquest', toPowerName: 'X occupation authority' },
    },
  },
  {
    label: 'occupation_vassalized (auto, sev 0.5)',
    outcome: {
      candidateType: 'occupation_vassalized',
      type: 'relationship',
      applyMode: 'auto',
      severity: 0.5,
    },
  },
  {
    label: 'coup power_transfer (auto, sev 0.7)',
    outcome: {
      candidateType: 'coup_succeeded',
      type: 'power_transfer',
      applyMode: 'auto',
      severity: 0.7,
      powerTransfer: { cause: 'coup', toPowerName: 'The Conspiracy' },
    },
  },
  {
    label: 'war_mobilization (auto, sev 0.4)',
    outcome: {
      candidateType: 'war_mobilization',
      type: 'condition',
      applyMode: 'auto',
      severity: 0.4,
    },
  },
  {
    label: 'government_change (proposal payload)',
    outcome: {
      candidateType: 'faction_government_challenge',
      applyMode: 'proposal',
      severity: 0.55,
      proposalPayload: { kind: 'government_change', factionId: 'f1' },
    },
  },
  {
    label: 'strategy_deploy (war start, auto)',
    outcome: {
      candidateType: 'strategy_deploy',
      applyMode: 'auto',
      severity: 0.45,
    },
  },
];

// Severe-but-MINOR rows: a famine and an economic shock both above the conquest
// severity band. Severity is deliberately NOT the signal.
const MINOR_TABLE = [
  {
    label: 'high-severity famine flow_migration (sev 0.95)',
    outcome: { candidateType: 'flow_migration', type: 'stressor', applyMode: 'auto', severity: 0.95 },
  },
  {
    label: 'high-severity resource depletion (sev 0.88, proposal)',
    outcome: { candidateType: 'tier_change', type: 'tier', applyMode: 'proposal', severity: 0.88 },
  },
  {
    label: 'occupation_resistance transition (does NOT flip authority)',
    outcome: { candidateType: 'occupation_resistance', type: 'condition', applyMode: 'auto', severity: 0.7 },
  },
  {
    label: 'occupation_burden transition (does NOT flip authority)',
    outcome: { candidateType: 'occupation_burden', type: 'condition', applyMode: 'auto', severity: 0.6 },
  },
  {
    label: 'a bare power_transfer with no conquest/coup cause',
    outcome: { type: 'power_transfer', applyMode: 'auto', severity: 0.5, powerTransfer: { cause: 'inheritance' } },
  },
  {
    label: 'pressure_event (severity-gated, sev 0.8)',
    outcome: { candidateType: 'pressure_event', type: 'condition', applyMode: 'proposal', severity: 0.8 },
  },
];

describe('deriveDecisionTier — structural MAJOR classifier (not severity, not applyMode)', () => {
  for (const { label, outcome } of MAJOR_TABLE) {
    test(`MAJOR: ${label}`, () => {
      expect(deriveDecisionTier(outcome)).toBe('major');
      expect(isMajorOutcome(outcome)).toBe(true);
    });
  }

  for (const { label, outcome } of MINOR_TABLE) {
    test(`MINOR: ${label}`, () => {
      expect(deriveDecisionTier(outcome)).toBe('minor');
      expect(isMajorOutcome(outcome)).toBe(false);
    });
  }

  test('a null/undefined outcome is minor (defensive)', () => {
    expect(deriveDecisionTier(null)).toBe('minor');
    expect(deriveDecisionTier(undefined)).toBe('minor');
    expect(deriveDecisionTier({})).toBe('minor');
  });

  test('applyMode does NOT change the classification (conquest auto == coup auto == major)', () => {
    const autoConquest = { candidateType: 'conquest', type: 'power_transfer', applyMode: 'auto', powerTransfer: { cause: 'conquest' } };
    const proposalConquest = { ...autoConquest, applyMode: 'proposal' };
    expect(deriveDecisionTier(autoConquest)).toBe('major');
    expect(deriveDecisionTier(proposalConquest)).toBe('major');
  });

  test('severity does NOT change the classification (a sev-0.95 famine stays minor; a sev-0.3 mobilization stays major)', () => {
    const severeFamine = { candidateType: 'flow_migration', severity: 0.95 };
    const mildMobilization = { candidateType: 'war_mobilization', severity: 0.3 };
    expect(deriveDecisionTier(severeFamine)).toBe('minor');
    expect(deriveDecisionTier(mildMobilization)).toBe('major');
  });
});

describe('resolveProposalToOutcome — deterministic recommended-outcome resolver', () => {
  test('stamps applyMode:auto and is byte-identical to the manual applyWorldPulseProposal resolve', () => {
    // The manual path in applyWorldPulse.js does exactly: { ...proposal.outcome, applyMode: 'auto' }.
    const storedOutcome = {
      id: 'world_outcome.conquest.x.5',
      candidateType: 'conquest',
      type: 'power_transfer',
      applyMode: 'proposal',
      severity: 0.62,
      powerTransfer: { cause: 'conquest', toPowerName: 'X occupation authority' },
      reasons: ['Coalition out-classed the defender.'],
    };
    const manual = { ...storedOutcome, applyMode: 'auto' };
    const resolved = resolveProposalToOutcome(storedOutcome);
    expect(resolved).toEqual(manual);
    expect(resolved.applyMode).toBe('auto');
  });

  test('does NOT mutate the input outcome (pure)', () => {
    const input = { id: 'o1', applyMode: 'proposal', severity: 0.5 };
    const snapshot = JSON.parse(JSON.stringify(input));
    resolveProposalToOutcome(input);
    expect(input).toEqual(snapshot);
  });

  test('draws no RNG — the same input twice yields deep-equal results', () => {
    const input = { id: 'o2', candidateType: 'coup_succeeded', type: 'power_transfer', applyMode: 'proposal', powerTransfer: { cause: 'coup' } };
    expect(resolveProposalToOutcome(input)).toEqual(resolveProposalToOutcome(input));
  });

  test('a null/undefined proposal outcome resolves to a bare auto outcome', () => {
    expect(resolveProposalToOutcome(null)).toEqual({ applyMode: 'auto' });
    expect(resolveProposalToOutcome(undefined)).toEqual({ applyMode: 'auto' });
  });
});
