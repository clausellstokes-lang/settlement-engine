import { describe, expect, test } from 'vitest';

import { relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { applyWarPeaceRefusal } from '../../src/domain/worldPulse/warPeaceRefusal.js';
import { peaceDecisionRulingEvidence } from '../../src/domain/worldPulse/warRulingsEvidence.js';
import { warRulingNewsEntries } from '../../src/domain/worldPulse/warRulingsNews.js';

const NOW = '2026-08-02T00:00:00.000Z';

function relationshipState(relationshipType, trust, resentment) {
  return { relationshipType, trust, resentment };
}

function targetUpdate() {
  return [{
    saveId: 'target',
    settlement: {
      name: 'Vale',
      powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' } },
    },
  }];
}

function refusalFixture(edges) {
  const opponentEdge = {
    id: 'edge.offerer.target',
    from: 'offerer',
    to: 'target',
    relationshipType: 'hostile',
  };
  const lowAllyEdge = {
    id: 'edge.ally.a',
    from: 'target',
    to: 'ally',
    relationshipType: 'allied',
  };
  const highAllyEdge = {
    id: 'edge.ally.z',
    from: 'ally',
    to: 'target',
    relationshipType: 'allied',
  };
  const mainKey = relationshipKeyFromEdge(opponentEdge);
  return {
    opponentEdge,
    lowAllyEdge,
    highAllyEdge,
    mainKey,
    worldState: {
      tick: 12,
      relationshipStates: {
        [mainKey]: relationshipState('hostile', 0.5, 0.2),
        [lowAllyEdge.id]: relationshipState('allied', 0.7, 0.1),
        [highAllyEdge.id]: relationshipState('allied', 0.7, 0.1),
      },
      deployments: { ally: { targetId: 'offerer', sinceTick: 4, role: 'siege' } },
    },
    graph: { edges: [opponentEdge, ...edges(lowAllyEdge, highAllyEdge)] },
    outcome: { id: 'peace.offer.12', relationshipKey: mainKey },
    decision: {
      offererId: 'offerer',
      targetId: 'target',
      receipt: { tick: 12, interestServed: 'realm' },
      termination: { receipt: { rulerId: 'target:ruler', rulerName: 'Bera Moss' } },
    },
  };
}

function applyRefusal(fixture) {
  return applyWarPeaceRefusal({
    worldState: fixture.worldState,
    settlementUpdates: targetUpdate(),
    regionalGraph: fixture.graph,
    outcome: fixture.outcome,
    decision: fixture.decision,
    tick: 12,
    now: NOW,
  });
}

function rulingSnapshot() {
  const settlements = [
    {
      id: 'offerer',
      name: 'Ember',
      settlement: { name: 'Ember', npcs: [], powerStructure: { factions: [] } },
    },
    {
      id: 'target',
      name: 'Vale',
      settlement: {
        name: 'Vale',
        npcs: [{ id: 'bera', name: 'Bera Moss' }],
        powerStructure: {
          factions: [{ id: 'seat', faction: 'Vale Seat', isGoverning: true }],
        },
      },
    },
  ];
  return { settlements, byId: new Map(settlements.map((row) => [row.id, row])) };
}

describe('WR-5 reproduced regressions', () => {
  test('parallel allied edges charge one court once through a deterministic edge', () => {
    const forward = refusalFixture((low, high) => [high, low]);
    const reverse = refusalFixture((low, high) => [low, high]);
    const first = applyRefusal(forward);
    const second = applyRefusal(reverse);

    expect(first).toEqual(second);
    expect(first.allyIds).toEqual(['ally']);
    expect(first.worldState.relationshipStates[forward.lowAllyEdge.id]).toMatchObject({
      trust: 0.65,
      resentment: 0.16,
    });
    expect(first.worldState.relationshipStates[forward.highAllyEdge.id]).toMatchObject({
      trust: 0.7,
      resentment: 0.1,
    });
    const patience = first.evidence.filter((row) => row.kind === 'refusal_cost_ally_patience');
    expect(patience).toEqual([
      expect.objectContaining({ id: 'peace.offer.12:ally:ally', thirdPartyId: 'ally' }),
    ]);
    expect(new Set(patience.map((row) => row.id)).size).toBe(patience.length);
  });

  test('an accepting target seat earns its own rival-triumph ending without exposing a patron', () => {
    const targetRead = {
      id: 'termination.target.offerer.12',
      tick: 12,
      attackerId: 'target',
      targetId: 'offerer',
      rulerId: 'target:bera',
      rulerName: 'Bera Moss',
      factionId: 'target:seat',
      factionName: 'Vale Seat',
      booksInterest: 'seat',
      booksDirection: 'peace',
      rivalTriumphBand: 'pressing',
      // Deliberate poison: public projection may not carry either value.
      patronId: 'secret-patron',
      patronName: 'The Hidden Hand',
    };
    const facts = peaceDecisionRulingEvidence({
      outcome: { id: 'peace.offer.accepted' },
      decision: {
        offererId: 'offerer',
        targetId: 'target',
        accepted: true,
        offererRead: {
          id: 'termination.offerer.target.12',
          tick: 12,
          attackerId: 'offerer',
          targetId: 'target',
          booksInterest: 'realm',
          booksDirection: 'peace',
        },
        termination: { receipt: targetRead },
        receipt: {
          tick: 12,
          decision: 'accept',
          actualAction: 'peace',
          interestServed: 'seat',
        },
        inheritedDemand: null,
      },
      tick: 12,
    });

    const targetEnding = facts.filter((row) => (
      row.kind === 'war_ended_against_rival_triumph' && row.settlementId === 'target'
    ));
    expect(targetEnding).toEqual([
      expect.objectContaining({
        id: 'peace.offer.accepted:target',
        settlementId: 'target',
        counterpartId: 'offerer',
        rulerId: 'target:bera',
      }),
    ]);

    const news = warRulingNewsEntries({ evidence: facts, snapshot: rulingSnapshot(), now: NOW });
    const ending = news.find((row) => row.kind === 'war_ended_against_rival_triumph');
    expect(ending).toMatchObject({
      audience: 'public',
      headline: "Vale ends its war with Ember against Bera Moss's triumph",
      settlementIds: ['target', 'offerer'],
      npcIds: ['target:bera'],
    });
    expect(JSON.stringify(ending)).not.toMatch(/secret-patron|The Hidden Hand/);
  });
});
