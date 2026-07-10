import { describe, expect, test } from 'vitest';

import {
  evaluateRelationshipRules,
  pressureIndex,
} from '../../src/domain/worldPulse/index.js';

// B03 findings #2 & #3: the relationship rule pass precomputes a per-tick
// adjacency / relationship-state / hostile-set index ONCE and the candidate
// helpers (protectorBackingScore, relationshipThirdParties, sharedHostileThird,
// relationshipTypeBetween) read from it instead of rescanning every edge. The
// refactor must be behaviour-identical. These tests pin the observable outputs
// of the helpers that consume the index, plus the cheap precheck (#2) and the
// stable common-enemy tiebreak (#6 stability).

const PRESSURE_KINDS = ['food', 'disease', 'conflict', 'hostility', 'trade', 'legitimacy', 'crime', 'economy', 'defense'];

function item(id, { tier = 'town', population = 4000 } = {}) {
  return { id, name: id, settlement: { name: id, tier, population }, activeConditions: [], causal: { scores: {} } };
}

function pressuresFor(ids, score = 0.2) {
  return pressureIndex(ids.flatMap(id => PRESSURE_KINDS.map(kind => ({ settlementId: id, kind, score }))));
}

function snapshotFor({ edges, states, ids, tick = 5, pressureScore = 0.2 }) {
  return {
    snapshot: {
      worldState: { tick, relationshipStates: states, stressors: [] },
      regionalGraph: { edges, channels: [] },
      byId: new Map(ids.map(id => [id, item(id)])),
    },
    pressures: pressuresFor(ids, pressureScore),
    tick,
  };
}

describe('relationship rule pass is deterministic and index-backed', () => {
  test('two evaluations of the same snapshot produce identical candidate sets', () => {
    const ids = ['aa', 'bb', 'cc'];
    const edges = [
      { id: 'edge.aa.bb', from: 'aa', to: 'bb', relationshipType: 'neutral' },
      { id: 'edge.cc.aa', from: 'cc', to: 'aa', relationshipType: 'hostile' },
      { id: 'edge.cc.bb', from: 'cc', to: 'bb', relationshipType: 'hostile' },
    ];
    const states = {
      'edge.aa.bb': { relationshipType: 'neutral', trust: 0.6, resentment: 0.05, pactStrength: 0.3 },
      'edge.cc.aa': { relationshipType: 'hostile' },
      'edge.cc.bb': { relationshipType: 'hostile' },
    };
    const { snapshot, pressures, tick } = snapshotFor({ edges, states, ids });
    const first = evaluateRelationshipRules(snapshot, pressures, { tick });
    const second = evaluateRelationshipRules(snapshot, pressures, { tick });
    expect(second).toEqual(first);
  });

  test('shared_enemy_alliance fires when BOTH parties share a hostile third party', () => {
    const ids = ['aa', 'bb', 'cc'];
    const edges = [
      { id: 'edge.aa.bb', from: 'aa', to: 'bb', relationshipType: 'neutral' },
      { id: 'edge.cc.aa', from: 'cc', to: 'aa', relationshipType: 'hostile' },
      { id: 'edge.cc.bb', from: 'cc', to: 'bb', relationshipType: 'hostile' },
    ];
    const states = {
      'edge.aa.bb': { relationshipType: 'neutral', trust: 0.6, resentment: 0.02, pactStrength: 0.3 },
      'edge.cc.aa': { relationshipType: 'hostile' },
      'edge.cc.bb': { relationshipType: 'hostile' },
    };
    const { snapshot, pressures, tick } = snapshotFor({ edges, states, ids });
    const candidates = evaluateRelationshipRules(snapshot, pressures, { tick });
    const alliance = candidates.find(c => c.candidateType === 'shared_enemy_alliance');
    expect(alliance).toBeTruthy();
    expect(alliance.metadata.commonEnemySaveId).toBe('cc');
  });

  test('the precheck suppresses shared_enemy_alliance when only ONE party has a hostile edge', () => {
    const ids = ['aa', 'bb', 'cc'];
    const edges = [
      { id: 'edge.aa.bb', from: 'aa', to: 'bb', relationshipType: 'neutral' },
      // cc is hostile to aa only — bb has no hostile edge, so no shared enemy.
      { id: 'edge.cc.aa', from: 'cc', to: 'aa', relationshipType: 'hostile' },
    ];
    const states = {
      'edge.aa.bb': { relationshipType: 'neutral', trust: 0.6, resentment: 0.02, pactStrength: 0.3 },
      'edge.cc.aa': { relationshipType: 'hostile' },
    };
    const { snapshot, pressures, tick } = snapshotFor({ edges, states, ids });
    const candidates = evaluateRelationshipRules(snapshot, pressures, { tick });
    expect(candidates.find(c => c.candidateType === 'shared_enemy_alliance')).toBeFalsy();
  });

  test('the common enemy is the stable lowest-sorted id when several are shared, regardless of edge order', () => {
    const ids = ['aa', 'bb', 'mm', 'zz'];
    // Both aa and bb are hostile to mm AND zz; the reported enemy must be 'mm'
    // (lowest-sorted) no matter how the cc-edges are authored/ordered.
    const baseEdges = [
      { id: 'edge.aa.bb', from: 'aa', to: 'bb', relationshipType: 'neutral' },
      { id: 'edge.zz.aa', from: 'zz', to: 'aa', relationshipType: 'hostile' },
      { id: 'edge.zz.bb', from: 'zz', to: 'bb', relationshipType: 'hostile' },
      { id: 'edge.mm.aa', from: 'mm', to: 'aa', relationshipType: 'hostile' },
      { id: 'edge.mm.bb', from: 'mm', to: 'bb', relationshipType: 'hostile' },
    ];
    const states = {
      'edge.aa.bb': { relationshipType: 'neutral', trust: 0.6, resentment: 0.02, pactStrength: 0.3 },
      'edge.zz.aa': { relationshipType: 'hostile' },
      'edge.zz.bb': { relationshipType: 'hostile' },
      'edge.mm.aa': { relationshipType: 'hostile' },
      'edge.mm.bb': { relationshipType: 'hostile' },
    };
    const enemyFor = (edges) => {
      const { snapshot, pressures, tick } = snapshotFor({ edges, states, ids });
      const candidates = evaluateRelationshipRules(snapshot, pressures, { tick });
      return candidates.find(c => c.candidateType === 'shared_enemy_alliance')?.metadata.commonEnemySaveId;
    };
    expect(enemyFor(baseEdges)).toBe('mm');
    // Reverse the hostile-edge ordering: the result must not change.
    const reordered = [baseEdges[0], baseEdges[4], baseEdges[3], baseEdges[2], baseEdges[1]];
    expect(enemyFor(reordered)).toBe('mm');
  });
});
