import { describe, expect, test } from 'vitest';

import {
  activeDeployments,
  dispositionStandings,
  hasLiveWarState,
  liveSieges,
  liveTradeWars,
  occupiedSettlements,
  settlementWarStatus,
} from '../../src/domain/display/warStatus.js';

// A regional graph carrying a 2-attacker coalition siege of `c`.
const COALITION_GRAPH = {
  channels: [
    { id: 'wf1', type: 'war_front', status: 'confirmed', from: 'a', to: 'c', strength: 0.7, visibility: 'public' },
    { id: 'wf2', type: 'war_front', status: 'confirmed', from: 'b', to: 'c', strength: 0.6, visibility: 'public' },
  ],
};

describe('live war status (§S3)', () => {
  test('dormant campaign surfaces NO live war state', () => {
    const worldState = { deployments: {}, tradeWarState: {}, dispositionStats: {} };
    expect(hasLiveWarState({ worldState, regionalGraph: { channels: [] } })).toBe(false);
    expect(liveSieges({ worldState, regionalGraph: { channels: [] } })).toEqual([]);
    expect(activeDeployments(worldState)).toEqual([]);
    expect(liveTradeWars({ worldState })).toEqual([]);
    expect(dispositionStandings(worldState)).toEqual([]);
  });

  test('inert (no crash) when ledgers/graph are entirely absent', () => {
    expect(() => liveSieges({})).not.toThrow();
    expect(() => liveTradeWars({})).not.toThrow();
    expect(() => activeDeployments(undefined)).not.toThrow();
    expect(hasLiveWarState({})).toBe(false);
  });

  test('a coalition siege names its 2+ attackers (codepoint-sorted)', () => {
    const worldState = { deployments: { a: { targetId: 'c' }, b: { targetId: 'c' } } };
    const sieges = liveSieges({ worldState, regionalGraph: COALITION_GRAPH });
    expect(sieges).toHaveLength(1);
    expect(sieges[0].targetId).toBe('c');
    expect(sieges[0].coalition).toEqual(['a', 'b']);
    expect(sieges[0].frontCount).toBe(2);
  });

  test('a just-deployed army with no front yet still surfaces the siege', () => {
    const worldState = { deployments: { a: { targetId: 'c', sinceTick: 4 } } };
    const sieges = liveSieges({ worldState, regionalGraph: { channels: [] } });
    expect(sieges).toHaveLength(1);
    expect(sieges[0].coalition).toEqual(['a']);
    expect(activeDeployments(worldState)).toEqual([
      { homeId: 'a', targetId: 'c', sinceTick: 4, role: 'siege' },
    ]);
    expect(hasLiveWarState({ worldState })).toBe(true);
  });

  test('a flipped trade prize surfaces with its commodity; a never-flipped one does not', () => {
    const worldState = {
      tradeWarState: {
        'buyerx:iron': { winnerId: 'sup1', incumbentId: 'sup0', lastFlipTick: 7, updatedTick: 8 },
        'buyery:wool': { winnerId: 'sup2', incumbentId: null, lastFlipTick: null, updatedTick: 8 },
      },
    };
    const graph = {
      channels: [
        { type: 'trade_dependency', from: 'sup1', to: 'buyerx', goods: [{ id: 'iron', label: 'Iron' }] },
      ],
    };
    const wars = liveTradeWars({ worldState, regionalGraph: graph });
    expect(wars).toHaveLength(1);
    expect(wars[0].buyerId).toBe('buyerx');
    expect(wars[0].commodityLabel).toBe('Iron');
    expect(wars[0].winnerId).toBe('sup1');
  });

  test('disposition standings surface net win/loss records, not net-zero', () => {
    const worldState = {
      dispositionStats: {
        a: { wins: 3, losses: 1, score: 2 },
        b: { wins: 0, losses: 0, score: 0 },
        c: { wins: 1, losses: 2, score: -1 },
      },
    };
    const standings = dispositionStandings(worldState);
    expect(standings.map(s => s.id)).toEqual(['a', 'c']);
  });

  test('settlementWarStatus resolves a single settlement\'s besieger/besieged roles', () => {
    const worldState = { deployments: { a: { targetId: 'c' }, b: { targetId: 'c' } } };
    const attacker = settlementWarStatus({ settlementId: 'a', worldState, regionalGraph: COALITION_GRAPH });
    expect(attacker).toMatchObject({ besiegingTargets: ['c'], atWar: true });
    const victim = settlementWarStatus({ settlementId: 'c', worldState, regionalGraph: COALITION_GRAPH });
    expect(victim).toMatchObject({ besiegedBy: ['a', 'b'], atWar: true });
    const peaceful = settlementWarStatus({ settlementId: 'z', worldState, regionalGraph: COALITION_GRAPH });
    expect(peaceful).toBeNull();
  });
});

describe('occupiedSettlements (Phase 5 — occupation shading reader)', () => {
  test('returns the nodes whose most-recent transfer was a conquest', () => {
    const items = [
      { id: 'a', settlement: { powerStructure: { governingName: 'Iron Legion occupation authority', previousGovernments: [{ label: 'Old Council', cause: 'conquest', tick: 5 }] } } },
      { id: 'b', settlement: { powerStructure: { previousGovernments: [{ label: 'X', cause: 'coup', tick: 2 }] } } }, // a coup, not occupied
      { id: 'c', settlement: { powerStructure: {} } }, // never changed hands
    ];
    const occ = occupiedSettlements(items);
    expect(occ.map(o => o.id)).toEqual(['a']);
    expect(occ[0]).toMatchObject({ occupier: 'Iron Legion occupation authority', sinceTick: 5 });
  });

  test('an older conquest later overthrown by a coup is NOT a live occupation', () => {
    const items = [
      { id: 'a', settlement: { powerStructure: { previousGovernments: [
        { label: 'Old', cause: 'conquest', tick: 3 },
        { label: 'Occupier', cause: 'coup', tick: 8 }, // freed by a later coup
      ] } } },
    ];
    expect(occupiedSettlements(items)).toEqual([]);
  });

  test('empty (byte-identical off-state) for a no-war save set', () => {
    expect(occupiedSettlements([])).toEqual([]);
    expect(occupiedSettlements(undefined)).toEqual([]);
    expect(occupiedSettlements([{ id: 'a', settlement: {} }])).toEqual([]);
  });
});
