/**
 * contextReasonCureP1.test.js — CURE LANE FP-P1, unit U3 (FPQ-23; FP EXPERIENCE READ 1 worst
 * sentence 3, READ 2 worst sentence 3 and fault P7):
 *
 *   'The settlement context moved from town, local, corruption exposed, corruption exposed,
 *    faction challenge to town, local, corruption exposed, corruption exposed, famine.'
 *
 * WHO VOICES IT, MEASURED: npcAgency.js :: npcGoalRebranch puts the line in the rebranch
 * candidate's reasons[0], picked from eventProse.js :: NPC_GOAL_NEWS.rebranch.contextReason,
 * and the Herald prints reasons[0] as the events desk's "Origin:" (heraldGrammar.js ::
 * reasonOf, HEADLINE_TEMPLATES.events.reasonLabel). WHAT IT VOICED: npcAgency.js ::
 * contextForNpc's `signature`, `tier|relationship|conditions`, where the conditions are
 * archetype ids SORTED and CAPPED AT THREE with duplicates kept — the goal-branch classifier's
 * key, an instrument's register. Its diff is lossy: a second copy of one archetype pushes a
 * live condition out of the three-slot window (read 2's worst sentence is that shape), so even
 * a token-by-token voicing of the change would say "the famine passed" of a famine that is
 * still there. THE MEASUREMENT DECIDED: the register leaves the DM-facing surface. The
 * rebranch keeps an Origin line that states the true cause (the settlement's circumstances
 * changed) in words, and the two signatures stay where the instruments read them
 * (metadata.previousContext / nextContext, npcPatch.contextSignature).
 */
import { describe, it, expect } from 'vitest';
import { NPC_GOAL_NEWS } from '../../src/domain/worldPulse/eventProse.js';
import { evaluateNpcRules, pressureIndex } from '../../src/domain/worldPulse/index.js';

const READ_1 = Object.freeze({
  previous: 'town|local|corruption_exposed,corruption_exposed,faction_challenge',
  next: 'town|local|corruption_exposed,corruption_exposed,famine',
});
/** Every word the register can put on the page for this fixture (humanized or raw). */
const REGISTER = /corruption[ _]exposed|faction[ _]challenge|famine|\blocal\b|\btown\b/;

const tellings = (interp) => NPC_GOAL_NEWS.rebranch.contextReason
  .map((variant) => (typeof variant === 'function' ? String(variant(interp)) : String(variant)));

function rebranchOf(previous, activeConditions) {
  const state = {
    npcId: 'soak-d:rory', settlementId: 'soak-d', name: 'Rory Farrell', roleArchetype: 'civic',
    factionId: 'council', factionSeat: 'agent_protege', dotRank: 1, influenceBasis: ['bureaucracy'],
    contextSignature: previous, contextTier: 'town', shortGoal: 'win_public_legitimacy', longGoal: 'secure_office',
    ideal: 'order', flaw: 'pride', ambition: 0.2, loyalty: 0.5, momentum: 0, corruption: false,
    goalProgress: { short: 0, long: 0 }, rivalryTargets: [],
  };
  const snapshot = {
    worldState: { tick: 4, npcStates: { [state.npcId]: state }, relationshipStates: {} },
    regionalGraph: { edges: [] },
    settlements: [{ id: 'soak-d', name: 'Invershaw', settlement: { name: 'Invershaw', tier: 'town', population: 4000, npcs: [] }, activeConditions }],
  };
  return evaluateNpcRules(snapshot, pressureIndex([]), { tick: 5 })
    .find((candidate) => candidate.candidateType === 'npc_goal_rebranch') || null;
}

describe('CURE-P1 U3 — the context register leaves the page (FPQ-23)', () => {
  it('no telling of the rebranch reason voices the register, on the read\'s own fixture', () => {
    const lines = tellings({ name: 'Rory Farrell', ...READ_1 });
    expect(lines.length, 'the pool keeps its four tellings (a pool size move shifts every pick)').toBe(4);
    for (const [i, line] of lines.entries()) {
      expect(line.length, `telling ${i} is a live, interpolated line`).toBeGreaterThan(20);
      // anchored: the line is a live interpolated telling (its length is asserted on the line above).
      expect(line, `telling ${i} voices no register token`).not.toMatch(REGISTER);
      expect(line, `telling ${i} names the one whose aims turned`).toContain('Rory Farrell');
    }
  });

  it('the composer: the Origin line carries no register token, and the record keeps both keys', () => {
    const rebranch = rebranchOf(READ_1.previous, [
      { archetype: 'corruption_exposed', label: 'Corruption scandal' },
      { archetype: 'corruption_exposed', label: 'Corruption scandal' },
      { archetype: 'famine', label: 'Famine pressure' },
    ]);
    expect(rebranch, 'the famine branches the civic NPC toward a crisis goal').toBeTruthy();
    expect(rebranch.metadata, 'the instrument keeps its register on the record').toMatchObject({
      previousContext: READ_1.previous, nextContext: READ_1.next,
    });
    const origin = String(rebranch.reasons[0]);
    expect(origin.length, 'the Origin line is live').toBeGreaterThan(20);
    // anchored: the Origin line is live (above) and the record holds both keys (toMatchObject above).
    expect(origin, 'the Origin line voices no register token').not.toMatch(REGISTER);
    expect(origin, 'the Origin line names the NPC').toContain('Rory Farrell');
  });
});
