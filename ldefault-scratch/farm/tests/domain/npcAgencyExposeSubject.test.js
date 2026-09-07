/**
 * npcAgencyExposeSubject.test.js — #6: NPC "move against a rival" actions.
 *
 * Live-app bug: during an advance, NPCs announced they "may expose" / "may
 * suppress" with NO subject — who or what was never stated — and the target
 * suffered no consequence. Now a move-against action (expose / suppress /
 * sabotage / undermine_rival) NAMES its subject in the headline AND sets that
 * subject back (lower momentum + leverage → their own next move lands weaker).
 */

import { describe, it, expect } from 'vitest';
import { deriveNpcCandidates, applyNpcPatch } from '../../src/domain/worldPulse/npcAgency.js';

// pressureIdx stub: only CRIME pressure is high in S1. For a dissident
// (mobilize/expose/sabotage/undermine_rival) that drives a move-against action
// (expose, on crime) while mobilize — which keys off conflict/legitimacy/food —
// scores zero, so the choice is deterministic.
const pressureIdx = {
  get: (sid, kind) => (sid === 'S1' && kind === 'crime' ? { score: 0.95 } : { score: 0 }),
};

function makeSnapshot() {
  const actor = {
    npcId: 'actor', name: 'Sister Mara', settlementId: 'S1', factionId: 'F1',
    roleArchetype: 'dissident', ambition: 0.9, dotRank: 2,
    momentum: 0.3, leverage: 0.3, ambitionHeat: 0.2,
    ideal: 'liberty', flaw: 'zeal', shortGoal: 'expose_corruption',
    goalProgress: { short: 0, long: 0 }, corruption: false,
  };
  const rival = {
    npcId: 'rival', name: 'Brother Aldric', settlementId: 'S1', factionId: 'F2',
    roleArchetype: 'civic', ambition: 0.3, dotRank: 1, // low ambition → does not act
    momentum: 0.6, leverage: 0.5, ambitionHeat: 0.45,
    ideal: 'order', flaw: 'greed', shortGoal: 'gain_office',
    goalProgress: { short: 0, long: 0 }, corruption: false,
  };
  return {
    worldState: { tick: 4, npcStates: { actor, rival } },
    settlements: [{ id: 'S1', settlement: { tier: 'town' }, activeConditions: [] }],
  };
}

describe('#6 move-against actions name the subject and set them back', () => {
  it('names the targeted rival in the headline and carries a rival consequence', () => {
    const cands = deriveNpcCandidates(makeSnapshot(), pressureIdx, { tick: 5 });
    const actorCand = cands.find(c => c.npcId === 'actor');
    expect(actorCand, 'actor should have produced an action candidate').toBeTruthy();
    expect(['npc_expose', 'npc_suppress', 'npc_sabotage', 'npc_undermine_rival'])
      .toContain(actorCand.candidateType);
    // SUBJECT stated — the rival's name appears, not a dangling verb.
    expect(actorCand.headline).toContain('Brother Aldric');
    expect(actorCand.headline).not.toMatch(/may (expose|suppress|sabotage|undermine)$/);
    // CONSEQUENCE attached to the subject.
    expect(actorCand.rivalNpcId).toBe('rival');
    expect(actorCand.rivalPatch).toBeTruthy();
    expect(actorCand.rivalPatch.momentum).toBeLessThan(0.6); // dampened from 0.6
    expect(actorCand.rivalPatch.leverage).toBeLessThan(0.5); // dampened from 0.5
    expect(actorCand.rivalPatch.lastTargetedBy).toBe('actor');
  });

  it('applies the consequence so the subject is measurably set back', () => {
    const snap = makeSnapshot();
    const actorCand = deriveNpcCandidates(snap, pressureIdx, { tick: 5 }).find(c => c.npcId === 'actor');
    const next = applyNpcPatch(snap.worldState, actorCand);
    expect(next.npcStates.rival.momentum).toBe(actorCand.rivalPatch.momentum);
    expect(next.npcStates.rival.leverage).toBe(actorCand.rivalPatch.leverage);
    expect(next.npcStates.rival.lastTargetedBy).toBe('actor');
    // The actor's own patch still applied — the consequence is additive, not a swap.
    expect(next.npcStates.actor.lastAction).toBe(actorCand.metadata.actionFamily);
  });

  it('leaves other NPCs untouched when an outcome carries no rival (guard)', () => {
    const ws = { tick: 5, npcStates: { actor: { npcId: 'actor', momentum: 0.2 }, bystander: { npcId: 'bystander', momentum: 0.6 } } };
    const next = applyNpcPatch(ws, { npcId: 'actor', npcPatch: { momentum: 0.3 } });
    expect(next.npcStates.bystander.momentum).toBe(0.6); // unchanged — no phantom setback
  });
});
