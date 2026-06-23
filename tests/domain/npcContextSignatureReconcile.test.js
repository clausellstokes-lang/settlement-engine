import { describe, expect, test } from 'vitest';

import { ensureNpcStates, npcId } from '../../src/domain/worldPulse/npcAgency.js';
import { createPRNG } from '../../src/generators/prng.js';

// B03 finding #4: evaluateNpcRules only advances an NPC's contextSignature
// through a goal_rebranch candidate. A context transition that produces NO
// branched goals (e.g. a hostile edge cooling to neutral for a role with no
// neutral branch) used to leave the signature permanently stale, so the rebranch
// classification re-ran every tick with no effect and a LATER branching
// transition was compared against the wrong "from" context. ensureNpcStates now
// reconciles the signature silently for the no-branch case, while leaving it
// stale (so the rebranch can fire) when the live context still branches.

const NPC = { name: 'Tam Ledgerwell', importance: 'notable' };

function snapshotFor(stored, { relationshipType = 'neutral' } = {}) {
  const id = npcId('a', NPC, 0);
  return {
    snapshot: {
      worldState: {
        tick: 4,
        npcStates: { [id]: { npcId: id, settlementId: 'a', ...stored } },
        relationshipStates: relationshipType === 'neutral'
          ? {}
          : { 'edge.a.b': { relationshipType } },
      },
      regionalGraph: {
        edges: relationshipType === 'neutral'
          ? []
          : [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType }],
      },
      settlements: [{
        id: 'a',
        settlement: { name: 'Ashford', tier: 'town', population: 1500, npcs: [NPC] },
        activeConditions: [],
      }],
    },
    id,
  };
}

function storedState(patch = {}) {
  return {
    name: NPC.name,
    roleArchetype: 'civic', // civic has no neutral/local branch
    factionId: 'council',
    factionSeat: 'agent_protege',
    dotRank: 2,
    contextTier: 'town',
    shortGoal: 'win_public_legitimacy',
    longGoal: 'secure_office',
    ideal: 'order',
    flaw: 'pride',
    ambition: 0.3,
    loyalty: 0.5,
    corruption: false,
    rivalryTargets: [],
    ...patch,
  };
}

describe('ensureNpcStates reconciles a stale contextSignature for non-branching transitions', () => {
  test('a stale signature is advanced when the live context produces NO branched goals', () => {
    // Stored signature says the town was hostile; the live context is neutral
    // ('town|local|'), which yields no branch for a civic NPC.
    const { snapshot, id } = snapshotFor(storedState({ contextSignature: 'town|hostile|' }));
    const next = ensureNpcStates(snapshot.worldState, snapshot, createPRNG('seed').fork('npc'));
    expect(next.npcStates[id].contextSignature).toBe('town|local|');
    expect(next.npcStates[id].contextTier).toBe('town');
  });

  test('a stale signature is LEFT in place when the live context still branches (so the rebranch can fire)', () => {
    // Live context is hostile → branchedGoals returns mobilize_defenses for any
    // role, so the signature must stay stale for evaluateNpcRules to rebranch.
    const { snapshot, id } = snapshotFor(
      storedState({ contextSignature: 'town|local|' }),
      { relationshipType: 'hostile' },
    );
    const next = ensureNpcStates(snapshot.worldState, snapshot, createPRNG('seed').fork('npc'));
    expect(next.npcStates[id].contextSignature).toBe('town|local|');
  });

  test('a signature already matching the live context is untouched', () => {
    const { snapshot, id } = snapshotFor(storedState({ contextSignature: 'town|local|' }));
    const next = ensureNpcStates(snapshot.worldState, snapshot, createPRNG('seed').fork('npc'));
    expect(next.npcStates[id].contextSignature).toBe('town|local|');
  });

  test('a missing signature is still seeded from the live context (legacy behaviour preserved)', () => {
    const { snapshot, id } = snapshotFor(storedState({ contextSignature: undefined }));
    const next = ensureNpcStates(snapshot.worldState, snapshot, createPRNG('seed').fork('npc'));
    expect(next.npcStates[id].contextSignature).toBe('town|local|');
  });
});
