import { describe, expect, test } from 'vitest';

import {
  applyVerdictWarDissolutions,
  governmentTransitionRulingEvidence,
  peaceDecisionRulingEvidence,
  verdictDissolutionRulingEvidence,
} from '../../src/domain/worldPulse/warRulingsEvidence.js';

function read(patch = {}) {
  return {
    id: 'termination.a.b.12', tick: 12, attackerId: 'a', targetId: 'b',
    booksInterest: 'realm', booksDirection: 'peace',
    rulerId: 'ruler.a', rulerName: 'Aldric Venn',
    factionId: 'fac.a', factionName: 'House Rowan',
    ...patch,
  };
}

function decision(patch = {}) {
  return {
    offererId: 'a', targetId: 'b', accepted: false,
    offererRead: read(),
    termination: { receipt: read({ attackerId: 'b', targetId: 'a', rulerId: 'ruler.b', rulerName: 'Bera Moss' }) },
    receipt: { tick: 12, decision: 'refuse', actualAction: 'continue' },
    inheritedDemand: null,
    ...patch,
  };
}

describe('WR-5 behavioral evidence composers', () => {
  test('an offer names seat books only when those books point toward peace', () => {
    const seat = peaceDecisionRulingEvidence({
      outcome: { id: 'offer.1' },
      decision: decision({ offererRead: read({ booksInterest: 'seat', booksDirection: 'peace' }) }),
      tick: 12,
    });
    expect(seat).toEqual([expect.objectContaining({
      kind: 'sued_for_peace_seat', settlementId: 'a', counterpartId: 'b', interestServed: 'seat',
    })]);

    const realmOvercameSeat = peaceDecisionRulingEvidence({
      outcome: { id: 'offer.2' },
      decision: decision({ offererRead: read({ booksInterest: 'seat', booksDirection: 'continue' }) }),
      tick: 12,
    });
    expect(realmOvercameSeat).toEqual([expect.objectContaining({
      kind: 'sued_for_peace_realm', interestServed: 'realm',
    })]);
  });

  test('two yeses earn rival-triumph and successor facts; a refusal earns neither here', () => {
    const offererRead = read({
      booksInterest: 'seat', booksDirection: 'peace', rivalTriumphBand: 'pressing', momentumBroken: true,
    });
    const accepted = peaceDecisionRulingEvidence({
      outcome: { id: 'offer.yes' },
      decision: decision({ accepted: true, offererRead, receipt: { tick: 12, decision: 'accept', actualAction: 'peace' } }),
      tick: 12,
    });
    expect(accepted.map((row) => row.kind)).toEqual(expect.arrayContaining([
      'sued_for_peace_seat', 'war_ended_against_rival_triumph', 'successor_repudiates_war',
    ]));

    const refused = peaceDecisionRulingEvidence({
      outcome: { id: 'offer.no' }, decision: decision({ offererRead }), tick: 12,
    });
    expect(refused.map((row) => row.kind)).toEqual(['sued_for_peace_seat']);
  });

  test('patron service earns the private fact while missing books fail closed', () => {
    const patron = peaceDecisionRulingEvidence({
      outcome: { id: 'offer.patron' },
      decision: decision({
        offererRead: read({
          booksInterest: 'patron', booksDirection: 'peace', patronId: 'court.c', patronName: 'Gloamhold',
        }),
      }),
      tick: 12,
    });
    expect(patron.map((row) => row.kind)).toEqual([
      'sued_for_peace_seat', 'ruler_books_compromised',
    ]);
    expect(peaceDecisionRulingEvidence({
      outcome: { id: 'offer.missing' },
      decision: decision({ offererRead: read({ booksInterest: '', booksDirection: '' }) }),
      tick: 12,
    })).toEqual([]);
  });

  test('an installing faction earns exactly one inherited-demand and one polarity fact', () => {
    const base = {
      id: 'seat.install', tick: 11, fromRulerId: 'old', toRulerId: 'new',
      installerFactionId: 'fac.peace', installerFactionName: 'Merchant League',
      warDemand: { actorId: 'a', targetId: 'b', decisionId: 'decision.no', desiredAction: 'peace' },
    };
    expect(governmentTransitionRulingEvidence({ transition: base }).map((row) => row.kind)).toEqual([
      'succession_demand_inherited', 'peace_party_overturns_warmonger',
    ]);
    expect(governmentTransitionRulingEvidence({
      transition: { ...base, warDemand: { ...base.warDemand, desiredAction: 'continue' } },
    }).map((row) => row.kind)).toEqual([
      'succession_demand_inherited', 'war_party_overturns_peacemaker',
    ]);
    expect(governmentTransitionRulingEvidence({ transition: { ...base, warDemand: null } })).toEqual([]);
  });

  test('only an authority-broken corruption cause earns verdict dissolution', () => {
    const exact = read({
      momentumBroken: true,
      authorityChangeKind: 'corruption_verdict',
      authorityVerdictId: 'npc-verdict.a.old.11',
      causeState: 'dissolved',
      dissolvedCauseTypes: ['corruption_exposed'],
    });
    expect(verdictDissolutionRulingEvidence(exact)).toEqual([
      expect.objectContaining({ kind: 'war_dissolved_by_verdict', settlementId: 'a', counterpartId: 'b' }),
    ]);
    expect(verdictDissolutionRulingEvidence({ ...exact, momentumBroken: false })).toEqual([]);
    expect(verdictDissolutionRulingEvidence({ ...exact, authorityVerdictId: '' })).toEqual([]);
    expect(verdictDissolutionRulingEvidence({ ...exact, authorityChangeKind: 'transfer' })).toEqual([]);
    expect(verdictDissolutionRulingEvidence({ ...exact, dissolvedCauseTypes: ['grievance'] })).toEqual([]);
  });

  test('a verdict dissolution speaks only after it recalls the exact live deployment', () => {
    const receipt = read({
      momentumBroken: true,
      authorityChangeKind: 'corruption_verdict',
      authorityVerdictId: 'npc-verdict.a.old.11',
      causeState: 'dissolved',
      dissolvedCauseTypes: ['corruption_exposed'],
    });
    const first = applyVerdictWarDissolutions({
      worldState: { deployments: { a: { targetId: 'b', sinceTick: 3 } } },
      receipts: [receipt],
      tick: 12,
    });
    expect(first.worldState.deployments.a.recalled).toEqual({
      cause: 'authority_verdict', tick: 12,
    });
    expect(first.evidence).toEqual([
      expect.objectContaining({ kind: 'war_dissolved_by_verdict' }),
    ]);

    const retry = applyVerdictWarDissolutions({
      worldState: first.worldState,
      receipts: [receipt],
      tick: 12,
    });
    expect(retry.worldState).toBe(first.worldState);
    expect(retry.evidence).toEqual([]);

    const wrongFront = applyVerdictWarDissolutions({
      worldState: { deployments: { a: { targetId: 'c' } } },
      receipts: [receipt],
      tick: 12,
    });
    expect(wrongFront.evidence).toEqual([]);
  });
});
