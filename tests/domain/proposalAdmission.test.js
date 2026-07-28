import { describe, expect, test } from 'vitest';

import { rollCandidates } from '../../src/domain/worldPulse/candidateEvents.js';
import {
  admitGuaranteedProposalOutcomes,
  buildProposalDocket,
  PROPOSAL_DOCKET_POLICY,
} from '../../src/domain/worldPulse/proposalAdmission.js';
import { upsertProposal } from '../../src/domain/worldPulse/worldState.js';
import { createPRNG } from '../../src/kernel/prng.js';

const passRng = { random: () => 0 };

function minorCandidate(id, targetSaveId) {
  return {
    id,
    candidateType: 'npc_reform',
    ruleFamily: 'npc',
    targetSaveId,
    npcId: `${targetSaveId}:${id}`,
    probability: 1,
    applyMode: 'proposal',
    severity: 0.5,
    proposalPayload: {
      kind: 'npc_action',
      npcId: `${targetSaveId}:${id}`,
      actionFamily: 'reform',
    },
  };
}

function majorCandidate(id, targetSaveId) {
  return {
    id,
    candidateType: 'faction_government_challenge',
    ruleFamily: 'faction',
    targetSaveId,
    factionId: `${targetSaveId}:${id}`,
    probability: 1,
    applyMode: 'proposal',
    severity: 0.8,
    proposalPayload: {
      kind: 'government_change',
      settlementId: targetSaveId,
      factionId: `${targetSaveId}:${id}`,
    },
  };
}

function proposal(outcome, status = 'pending') {
  return {
    id: `proposal.${outcome.id}`,
    status,
    recordModeVersion: 4,
    outcome,
  };
}

function docketFor(proposals, realmSize = 4) {
  return buildProposalDocket({ proposals }, realmSize);
}

function roll(candidates, docket, rng = passRng) {
  return rollCandidates(candidates, rng, {
    maxAuto: 5,
    maxProposals: 5,
    proposalDocket: docket,
  });
}

describe('proposal docket admission', () => {
  test('the explicit ordinary-realm policy reserves four major slots', () => {
    const docket = docketFor([]);
    expect(docket.caps).toEqual({
      minor: PROPOSAL_DOCKET_POLICY.baseMinorPending,
      major: PROPOSAL_DOCKET_POLICY.baseMajorPending,
      perSettlementMinor: PROPOSAL_DOCKET_POLICY.perSettlementMinorPending,
      perSettlementMajor: PROPOSAL_DOCKET_POLICY.perSettlementMajorPending,
    });
    expect(docket.caps).toEqual({
      minor: 12,
      major: 4,
      perSettlementMinor: 3,
      perSettlementMajor: 1,
    });
  });

  test('a full minor lane cannot starve a major question', () => {
    const pending = Array.from({ length: 12 }, (_, index) => (
      proposal(minorCandidate(`held-${index}`, `s${index % 4}`))
    ));
    const minor = minorCandidate('new-minor', 'fresh-minor-home');
    const major = majorCandidate('new-major', 'fresh-major-home');
    const result = roll([minor, major], docketFor(pending));

    expect(result.selected.map(candidate => candidate.id)).toEqual(['new-major']);
  });

  test('same-tick minor throughput cannot consume the reserved major slot', () => {
    const minors = Array.from({ length: 5 }, (_, index) => (
      minorCandidate(`minor-${index}`, `minor-home-${index}`)
    ));
    const major = majorCandidate('major-after-minors', 'major-home');
    const result = roll([...minors, major], docketFor([]));

    expect(result.selected.map(candidate => candidate.id)).toEqual([
      'major-after-minors',
      'minor-0',
      'minor-1',
      'minor-2',
      'minor-3',
    ]);
    expect(result.selected.some(candidate => candidate.id === 'minor-4')).toBe(false);
  });

  test('without an admissible major, all five same-tick proposal slots remain usable', () => {
    const minors = Array.from({ length: 5 }, (_, index) => (
      minorCandidate(`minor-${index}`, `minor-home-${index}`)
    ));

    expect(roll(minors, docketFor([])).selected).toHaveLength(5);
  });

  test('saturated-lane winners are invariant under candidate permutation', () => {
    const pending = Array.from({ length: 11 }, (_, index) => (
      proposal(minorCandidate(`held-${index}`, `held-home-${index}`))
    ));
    const contenders = [
      minorCandidate('candidate.zeta', 'zeta-home'),
      minorCandidate('candidate.alpha', 'alpha-home'),
      minorCandidate('candidate.mu', 'mu-home'),
    ];
    const forward = roll(contenders, docketFor(pending), createPRNG('admission-order'));
    const reversed = roll([...contenders].reverse(), docketFor(pending), createPRNG('admission-order'));

    expect(forward.selected.map(candidate => candidate.id)).toEqual(['candidate.alpha']);
    expect(reversed.selected.map(candidate => candidate.id)).toEqual(['candidate.alpha']);
    const rolls = result => new Map(
      result.rollExplanations.map(explanation => [explanation.candidateId, explanation.roll]),
    );
    expect(rolls(reversed)).toEqual(rolls(forward));
  });

  test('proposal contention lookahead is parent-stream neutral and reuses its identity roll', () => {
    const seed = 'proposal-prefetch-purity';
    const rng = createPRNG(seed);
    const untouchedControl = createPRNG(seed);
    const candidates = [
      { ...minorCandidate('candidate.alpha', 'alpha-home'), probability: 0.35 },
      { ...minorCandidate('candidate.mu', 'mu-home'), probability: 0.65 },
      { ...minorCandidate('candidate.zeta', 'zeta-home'), probability: 0.9 },
    ];
    const result = roll(candidates, docketFor([]), rng);

    for (const explanation of result.rollExplanations) {
      const expected = createPRNG(seed)
        .fork(`roll:${explanation.candidateId}`)
        .random();
      expect(explanation.roll).toBe(expected);
    }
    expect(rng.random()).toBe(untouchedControl.random());
  });

  test('guaranteed structural proposals share the docket before stochastic admission', () => {
    const pending = Array.from({ length: 10 }, (_, index) => (
      proposal(minorCandidate(`held-${index}`, `held-home-${index}`))
    ));
    const candidates = [
      minorCandidate('population.zeta', 'zeta-home'),
      minorCandidate('population.alpha', 'alpha-home'),
      minorCandidate('population.mu', 'mu-home'),
    ];
    const forward = admitGuaranteedProposalOutcomes(docketFor(pending), candidates);
    const reversed = admitGuaranteedProposalOutcomes(
      docketFor(pending),
      [...candidates].reverse(),
    );

    expect(forward.outcomes.map(candidate => candidate.id).sort()).toEqual([
      'population.alpha',
      'population.mu',
    ]);
    expect(reversed.outcomes.map(candidate => candidate.id).sort()).toEqual([
      'population.alpha',
      'population.mu',
    ]);
    expect(forward.docket.counts.minor).toBe(12);
  });

  test('per-settlement lane caps keep one settlement from monopolizing the docket', () => {
    const pending = [
      proposal(minorCandidate('held-a-1', 'a')),
      proposal(minorCandidate('held-a-2', 'a')),
      proposal(minorCandidate('held-a-3', 'a')),
    ];
    const result = roll(
      [
        minorCandidate('new-a', 'a'),
        minorCandidate('new-b', 'b'),
      ],
      docketFor(pending),
    );

    expect(result.selected.map(candidate => candidate.id)).toEqual(['new-b']);
  });

  test('one pending major holds only its own settlement major slot', () => {
    const pending = [proposal(majorCandidate('held-major-a', 'a'))];
    const result = roll(
      [
        majorCandidate('new-major-a', 'a'),
        majorCandidate('new-major-b', 'b'),
      ],
      docketFor(pending),
    );

    expect(result.selected.map(candidate => candidate.id)).toEqual(['new-major-b']);
  });

  test('resolved rows consume no capacity', () => {
    const resolved = ['applied', 'dismissed', 'expired', 'superseded']
      .flatMap(status => Array.from({ length: 20 }, (_, index) => (
        proposal(minorCandidate(`${status}-${index}`, 'a'), status)
      )));
    const docket = docketFor(resolved);

    expect(docket.counts).toEqual({ minor: 0, major: 0 });
    expect(roll([minorCandidate('new-a', 'a')], docket).selected).toHaveLength(1);
  });

  test('a completely full major and minor docket admits no new proposal', () => {
    const worldState = {
      proposals: [
        ...Array.from({ length: 12 }, (_, index) => (
          proposal(minorCandidate(`minor-${index}`, `minor-home-${index}`))
        )),
        ...Array.from({ length: 4 }, (_, index) => (
          proposal(majorCandidate(`major-${index}`, `major-home-${index}`))
        )),
      ],
    };
    const before = structuredClone(worldState);
    const result = roll(
      [
        minorCandidate('new-minor', 'new-minor-home'),
        majorCandidate('new-major', 'new-major-home'),
      ],
      buildProposalDocket(worldState, 4),
    );

    expect(result.selected).toEqual([]);
    expect(worldState).toEqual(before);
  });

  test('resolving one pending row reopens exactly one slot in that lane', () => {
    const rows = Array.from({ length: 12 }, (_, index) => (
      proposal(minorCandidate(`held-${index}`, `held-home-${index}`))
    ));
    rows[0] = { ...rows[0], status: 'applied' };
    const result = roll(
      [
        minorCandidate('candidate.zeta', 'zeta-home'),
        minorCandidate('candidate.alpha', 'alpha-home'),
      ],
      docketFor(rows),
    );

    expect(result.selected.map(candidate => candidate.id)).toEqual(['candidate.alpha']);
  });

  test('an over-cap legacy minor lane is preserved and its major reserve still works', () => {
    const pending = Array.from({ length: 13 }, (_, index) => (
      proposal(minorCandidate(`legacy-${index}`, `s${index}`))
    ));
    const worldState = { proposals: pending };
    const before = JSON.stringify(worldState);
    const docket = buildProposalDocket(worldState, 4);
    const result = roll(
      [
        minorCandidate('another-minor', 'new-minor-home'),
        majorCandidate('reserved-major', 'major-home'),
      ],
      docket,
    );

    expect(result.selected.map(candidate => candidate.id)).toEqual(['reserved-major']);
    expect(JSON.stringify(worldState)).toBe(before);
    expect(worldState.proposals).toHaveLength(13);
  });

  test('explicit DM orders and authored-resolution aftermaths bypass the organic cap', () => {
    const pending = [
      ...Array.from({ length: 12 }, (_, index) => (
        proposal(minorCandidate(`minor-${index}`, `minor-home-${index}`))
      )),
      ...Array.from({ length: 4 }, (_, index) => (
        proposal(majorCandidate(`major-${index}`, `major-home-${index}`))
      )),
    ];
    const worldState = { proposals: pending };
    const dmOutcome = minorCandidate('dm-authored-realm-order', 'minor-home-0');
    const aftermathOutcome = minorCandidate('authored-resolution-aftermath', 'minor-home-0');
    const withDmOrder = upsertProposal(worldState, proposal(dmOutcome));
    const withAftermath = upsertProposal(withDmOrder, proposal(aftermathOutcome));

    expect(withAftermath.proposals).toHaveLength(18);
    expect(withAftermath.proposals.map(row => row.outcome?.id)).toContain(dmOutcome.id);
    expect(withAftermath.proposals.map(row => row.outcome?.id)).toContain(aftermathOutcome.id);
    expect(worldState.proposals).toEqual(pending);
  });

  test('a failed proposal roll consumes no admission slot', () => {
    const pending = Array.from({ length: 11 }, (_, index) => (
      proposal(minorCandidate(`held-${index}`, `s${index}`))
    ));
    const rolls = [1, 0];
    const result = roll(
      [
        { ...minorCandidate('failed', 'x'), probability: 0.5 },
        { ...minorCandidate('passed', 'y'), probability: 0.5 },
      ],
      docketFor(pending),
      { random: () => rolls.shift() ?? 1 },
    );

    expect(result.selected.map(candidate => candidate.id)).toEqual(['passed']);
  });

  test('state-only and non-proposal work bypass a saturated docket', () => {
    const pending = Array.from({ length: 12 }, (_, index) => (
      proposal(minorCandidate(`held-${index}`, `s${index % 4}`))
    ));
    const stateOnly = {
      ...minorCandidate('mechanical', 'a'),
      recordMode: 'state_only',
    };
    const automatic = {
      id: 'automatic',
      candidateType: 'resource_drift',
      targetSaveId: 'a',
      probability: 1,
      applyMode: 'auto',
      severity: 0.2,
    };
    const result = roll([stateOnly, automatic], docketFor(pending));

    expect(result.selected).toEqual([
      expect.objectContaining({
        id: 'mechanical',
        applyMode: 'auto',
        recordMode: 'state_only',
      }),
      expect.objectContaining({
        id: 'automatic',
        applyMode: 'auto',
      }),
    ]);
  });

  test('global lanes grow only sqrt-sublinearly above the 24-settlement base', () => {
    const ordinary = docketFor([], 24);
    const large = docketFor([], 30);

    expect(ordinary.caps.minor).toBe(12);
    expect(ordinary.caps.major).toBe(4);
    expect(large.caps.minor).toBe(14);
    expect(large.caps.major).toBe(6);
    expect(large.caps.perSettlementMinor).toBe(3);
    expect(large.caps.perSettlementMajor).toBe(1);
  });
});
