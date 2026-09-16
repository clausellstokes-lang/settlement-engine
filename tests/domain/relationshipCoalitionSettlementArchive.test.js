import { describe, expect, test } from 'vitest';

import {
  applyRelationshipPatch,
  ensureRelationshipState,
  RELATIONSHIP_COALITION_SETTLEMENT_CAP,
} from '../../src/domain/worldPulse/relationshipEvolution.js';

const row = (closureId = 'closure.a', tick = 12, patch = {}) => ({
  actionId: `settlement.war.12.${closureId}.reimbursement`,
  coalitionSettlementId: 'settlement.war.12',
  closureId,
  relationshipKey: 'edge.a.b',
  fromId: 'a',
  toId: 'b',
  action: 'reimbursement',
  tick,
  status: 'paid',
  ...patch,
});

describe('WR-6 relationship coalition-settlement archive', () => {
  test('records a valid action once and makes a replay an exact no-op', () => {
    const worldState = {
      tick: 12,
      relationshipStates: {
        'edge.a.b': { relationshipType: 'allied', trust: 0.7 },
      },
    };
    const outcome = {
      relationshipKey: 'edge.a.b',
      relationshipPatch: { trust: 0.5 },
      metadata: { coalitionSettlement: row() },
    };

    const first = applyRelationshipPatch(worldState, outcome, '2026-08-02T00:00:00.000Z');
    expect(first.relationshipStates['edge.a.b'].trust).toBe(0.5);
    expect(first.relationshipStates['edge.a.b'].coalitionSettlements).toEqual([row()]);

    const replay = applyRelationshipPatch(first, {
      ...outcome,
      relationshipPatch: { trust: 0.1 },
    }, '2026-08-02T01:00:00.000Z');
    expect(replay).toBe(first);
  });

  test('fails the entire relationship write closed for a malformed or wrong-edge action', () => {
    const worldState = {
      tick: 12,
      relationshipStates: {
        'edge.a.b': { relationshipType: 'allied', trust: 0.7 },
      },
    };
    for (const receipt of [
      row('closure.a', 12, { relationshipKey: 'edge.other' }),
      row('closure.a', 12, { actionId: 'invented' }),
      row('closure.a', 12, { status: 'forgiven' }),
    ]) {
      const next = applyRelationshipPatch(worldState, {
        relationshipKey: 'edge.a.b',
        relationshipPatch: { trust: 0.1 },
        metadata: { coalitionSettlement: receipt },
      }, '2026-08-02T00:00:00.000Z');
      expect(next).toBe(worldState);
    }
  });

  test('normalization keeps the newest bounded, deterministic valid archive', () => {
    const rows = Array.from({ length: RELATIONSHIP_COALITION_SETTLEMENT_CAP + 3 }, (_, index) =>
      row(`closure.${String(index).padStart(2, '0')}`, index));
    const state = ensureRelationshipState({}, {
      relationshipType: 'allied',
      coalitionSettlements: [...rows].reverse(),
    });

    expect(state.coalitionSettlements).toHaveLength(RELATIONSHIP_COALITION_SETTLEMENT_CAP);
    expect(state.coalitionSettlements[0].closureId).toBe('closure.03');
    expect(state.coalitionSettlements.at(-1).closureId).toBe('closure.26');
  });
});
