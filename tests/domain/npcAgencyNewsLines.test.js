/**
 * npcAgencyNewsLines.test.js — STYLE-2-PULSE-FOLLOWUP (2026-11-09): the lines npcAgency's
 * own writers put on the Herald's news card, driven through the shipped composer
 * (`evaluateNpcRules`), never a copy of a template.
 *
 * The rows are the PULSE audit's (STYLE-AUDIT-2-PULSE-2026-11-09, ledger A2 and ledger B):
 *   A2·171 — the ideal reason. A card corrupted at generation carries its ideal as the token
 *            `corrupted_<ideal>`, and the reason printed the prefix AND its own "corrupted"
 *            word: "Rare corrupted corrupted mercy ideal modifies behavior." (2 of the 4,177
 *            cards at bd07005b9). The prefix is the card's state, not a word for the page.
 */
import { describe, expect, it } from 'vitest';

import { evaluateNpcRules, pressureIndex } from '../../src/domain/worldPulse/index.js';

/** One NPC under heavy legitimacy pressure, so its preferred reform/expose move fires. */
function actorSnapshot(overrides = {}) {
  const state = {
    npcId: 'a:clerk', settlementId: 'a', name: 'Ilse Brandt', roleArchetype: 'civic',
    factionId: 'council', factionSeat: 'agent_protege', dotRank: 1,
    shortGoal: 'win_public_legitimacy', longGoal: 'secure_office',
    ideal: 'mercy', flaw: 'pride', ambition: 0.8, loyalty: 0.5, momentum: 0, corruption: false,
    goalProgress: { short: 0, long: 0 }, rivalryTargets: [],
    contextSignature: 'village|local|', contextTier: 'village',
    ...overrides,
  };
  return {
    worldState: { tick: 4, npcStates: { [state.npcId]: state }, relationshipStates: {} },
    regionalGraph: { edges: [] },
    settlements: [{ id: 'a', name: 'Aschberg', settlement: { name: 'Aschberg', tier: 'village', npcs: [] }, activeConditions: [] }],
  };
}
const PRESSURE = pressureIndex([{ settlementId: 'a', kind: 'legitimacy', score: 0.9 }]);

function actionOf(overrides) {
  const out = evaluateNpcRules(actorSnapshot(overrides), PRESSURE, { tick: 5 });
  const action = out.find((c) => /^npc_/.test(c.candidateType)
    && !['npc_goal_culmination', 'npc_goal_rebranch'].includes(c.candidateType));
  expect(action, 'the planted NPC acts').toBeTruthy();
  return action;
}

describe('A2·171 — the ideal prints once, without the state token', () => {
  it('a card corrupted at generation (ideal `corrupted_mercy`) names the ideal once', () => {
    const action = actionOf({ ideal: 'corrupted_mercy', corruption: true });
    const all = action.reasons.join(' ');
    expect(all, 'the ideal is in the reasons').toContain('mercy');
    expect(all, 'no doubled word').not.toMatch(/corrupted corrupted/i);
    expect(all, 'no state token').not.toMatch(/corrupted_/);
  });

  it('an exposed card whose ideal still carries the token prints the plain ideal', () => {
    const action = actionOf({ ideal: 'corrupted_order', corruption: false });
    const all = action.reasons.join(' ');
    expect(all, 'the ideal is in the reasons').toContain('order');
    expect(all, 'the token never prints').not.toMatch(/corrupted/i);
  });
});
