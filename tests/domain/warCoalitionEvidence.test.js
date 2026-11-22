import { describe, expect, test } from 'vitest';

import {
  normalizeWarCoalitionEvidence,
  warCoalitionEvidenceFromOutcome,
  warCoalitionEvidenceFromOutcomes,
} from '../../src/domain/worldPulse/warCoalitionEvidence.js';

function fact(patch = {}) {
  return {
    kind: 'coalition_joined',
    id: 'call.ashford.eastvale.greywatch',
    tick: 8,
    settlementId: 'ashford',
    counterpartId: 'eastvale',
    thirdPartyId: 'greywatch',
    callId: 'call.private',
    relationshipKey: 'rel.private',
    ...patch,
  };
}

describe('WR-6 coalition evidence boundary', () => {
  test('canonical evidence preserves typed identities and private provenance', () => {
    expect(normalizeWarCoalitionEvidence(fact())).toEqual(fact());
  });

  test('a joined deployment shape keeps caller and enemy in their proper roles', () => {
    expect(normalizeWarCoalitionEvidence({
      kind: 'casus_alliance_obligation',
      id: 'cause.joined',
      tick: 9,
      attackerId: 'ashford',
      callerId: 'eastvale',
      targetId: 'greywatch',
    })).toMatchObject({
      settlementId: 'ashford',
      counterpartId: 'eastvale',
      thirdPartyId: 'greywatch',
    });
  });

  test('a typed receipt remains canonical inside a generic wrapper', () => {
    expect(normalizeWarCoalitionEvidence({
      kind: 'world_pulse',
      receipt: fact({ kind: 'mirror_obligation_discharged', thirdPartyId: undefined }),
    })).toMatchObject({
      kind: 'mirror_obligation_discharged',
      settlementId: 'ashford',
      counterpartId: 'eastvale',
    });
  });

  test('outcome attachments inherit only source identity and tick, then fold retries', () => {
    const outcome = {
      id: 'strategy.call.answer',
      tick: 12,
      candidateType: 'strategy_deploy',
      metadata: {
        coalitionEvidence: [
          {
            kind: 'coalition_joined',
            settlementId: 'ashford',
            counterpartId: 'eastvale',
            thirdPartyId: 'greywatch',
          },
          {
            kind: 'coalition_joined',
            settlementId: 'ashford',
            counterpartId: 'eastvale',
            thirdPartyId: 'greywatch',
          },
          {
            kind: 'coalition_entry_priced',
            id: 'risk.read',
            settlementId: 'ashford',
            counterpartId: 'eastvale',
            thirdPartyId: 'greywatch',
          },
        ],
      },
    };
    expect(warCoalitionEvidenceFromOutcome(outcome)).toEqual([
      expect.objectContaining({ kind: 'coalition_entry_priced', id: 'risk.read', tick: 12 }),
      expect.objectContaining({ kind: 'coalition_joined', id: 'strategy.call.answer', tick: 12 }),
    ]);
    expect(warCoalitionEvidenceFromOutcomes([outcome, outcome])).toHaveLength(2);
  });

  test('a direct coalition candidate remains readable when its generic kind differs', () => {
    expect(warCoalitionEvidenceFromOutcome({
      id: 'refusal.outcome',
      tick: 4,
      kind: 'world_pulse',
      candidateType: 'coalition_refused',
      settlementId: 'ashford',
      counterpartId: 'eastvale',
      thirdPartyId: 'greywatch',
    })).toEqual([
      expect.objectContaining({ kind: 'coalition_refused', id: 'refusal.outcome' }),
    ]);
  });

  test('reader-facing bands preserve only the closed qualitative vocabulary', () => {
    expect(normalizeWarCoalitionEvidence(fact({ band: 'pressing' }))).toMatchObject({
      band: 'pressing',
    });

    const normalized = normalizeWarCoalitionEvidence(fact({
      band: '0.62',
      riskBand: 0.5,
      paymentBand: '62%',
    }));
    expect(normalized).not.toHaveProperty('band');
    expect(normalized).not.toHaveProperty('riskBand');
    expect(normalized).not.toHaveProperty('paymentBand');
    expect(normalized).toMatchObject({
      kind: 'coalition_joined',
      settlementId: 'ashford',
      counterpartId: 'eastvale',
      thirdPartyId: 'greywatch',
    });
  });

  test('unknown kinds, missing provenance, and incomplete address chains fail closed', () => {
    expect(normalizeWarCoalitionEvidence(fact({ kind: 'coalition_unknown' }))).toBeNull();
    expect(normalizeWarCoalitionEvidence(fact({ id: '' }))).toBeNull();
    expect(normalizeWarCoalitionEvidence(fact({ tick: undefined }))).toBeNull();
    expect(normalizeWarCoalitionEvidence(fact({ settlementId: '' }))).toBeNull();
    expect(normalizeWarCoalitionEvidence(fact({ counterpartId: 'ashford' }))).toBeNull();
    expect(normalizeWarCoalitionEvidence(fact({ thirdPartyId: '' }))).toBeNull();
    expect(normalizeWarCoalitionEvidence(fact({ thirdPartyId: 'eastvale' }))).toBeNull();
    expect(warCoalitionEvidenceFromOutcome({ id: 'ordinary', tick: 3 })).toEqual([]);
  });
});
