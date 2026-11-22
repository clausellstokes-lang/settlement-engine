/**
 * casusWeakTurnsCureP1.test.js — CURE LANE FP-P1, unit U4 (FPQ-30; FP EXPERIENCE READ 2, worst
 * sentence 2 and fault P5):
 *
 *   'Casus: The pull toward independence is near-total, and the overlord has looked weak 0 turns
 *    running.'
 *
 * The casus composer is relationshipRulesCore.js :: vassalRules: the vassal_rebellion
 * candidate's first reason, which the Herald files under its war desk's "Casus:" label. It
 * voiced the overlord's weakness streak as a bare digit, zero included. At zero the clause is
 * now suppressed (a streak that never began is no part of the case); above zero the count reads
 * in the estate's number idiom, display/numberWords.js :: numberWord (THE ONE SPELLING OF A
 * SMALL COUNT). The fixture is relationshipDynamics.test.js's weak-overlord case, renamed.
 */
import { describe, it, expect } from 'vitest';
import { evaluateRelationshipRules, pressureIndex } from '../../src/domain/worldPulse/index.js';

function item(id, name, tier, population) {
  return { id, name, settlement: { name, tier, population }, activeConditions: [], causal: { scores: {} } };
}

function pressureRows(ids, patch) {
  return ids.flatMap((id) => Object.entries({
    food: 0.1, disease: 0.1, conflict: 0.1, hostility: 0, trade: 0.1, legitimacy: 0.1, crime: 0.1, economy: 0.1, defense: 0.1,
    ...(patch[id] || {}),
  }).map(([kind, score]) => ({ settlementId: id, kind, score })));
}

/** The rebellion candidate's casus line for an overlord weak `streak` turns running. */
function casusAt(streak) {
  const edge = { id: 'edge.soak-b.soak-c', from: 'soak-b', to: 'soak-c', relationshipType: 'vassal' };
  const snapshot = {
    worldState: {
      tick: 8, stressors: [],
      relationshipStates: {
        'edge.soak-b.soak-c': {
          relationshipType: 'vassal', trust: 0.22, resentment: 0.56, dependency: 0.72, leverage: 0.64,
          overlordWeaknessStreak: streak,
        },
      },
    },
    regionalGraph: { edges: [edge], channels: [] },
    byId: new Map([
      ['soak-b', item('soak-b', 'Grünbach', 'town', 1200)],
      ['soak-c', item('soak-c', 'Glenwick', 'city', 9000)],
    ]),
  };
  const candidates = evaluateRelationshipRules(snapshot, pressureIndex(pressureRows(['soak-b', 'soak-c'], {
    'soak-b': { conflict: 0.85, legitimacy: 0.9, defense: 0.88, economy: 0.82 },
    'soak-c': { conflict: 0.18, legitimacy: 0.28, defense: 0.2, economy: 0.2 },
  })), { tick: 9 });
  const rebellion = candidates.find((candidate) => candidate.candidateType === 'vassal_rebellion');
  return rebellion ? String(rebellion.reasons[0]) : '';
}

describe('CURE-P1 U4 — the casus never voices a zero (FPQ-30)', () => {
  it('at a streak of zero the weak-turns clause is suppressed, and the case still stands', () => {
    const casus = casusAt(0);
    expect(casus, 'the independence case is voiced at zero').toMatch(/^The pull toward independence is [a-z-]+(?: [a-z-]+)*\.$/);
    // anchored: the whole casus line matched the independence clause on the line above.
    expect(casus, 'no weak-turns clause and no digit at zero').not.toMatch(/looked weak|\d/);
  });

  it('at a streak of three the count reads in words', () => {
    const casus = casusAt(3);
    expect(casus).toMatch(/^The pull toward independence is [a-z-]+(?: [a-z-]+)*, and the overlord has looked weak three turns running\.$/);
  });

  it('at a streak of one the count reads in the singular', () => {
    expect(casusAt(1)).toMatch(/, and the overlord has looked weak one turn running\.$/);
  });
});
