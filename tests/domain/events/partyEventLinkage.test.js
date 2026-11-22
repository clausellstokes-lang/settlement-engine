import { describe, it, expect } from 'vitest';
import { mapEventToPartyImpact, PARTY_LINKED_EVENT_TYPES } from '../../../src/domain/events/partyEventLinkage.js';
import { PARTY_IMPACT_KINDS } from '../../../src/domain/worldPulse/partyImpact.js';

const SAVE = 'save-1';

describe('mapEventToPartyImpact', () => {
  it('returns null when the event is not party-caused', () => {
    expect(mapEventToPartyImpact({ type: 'KILL_NPC', targetId: 'npc-1' }, SAVE)).toBeNull();
  });

  it('returns null without a saveId (no campaign settlement to scope to)', () => {
    expect(mapEventToPartyImpact({ type: 'KILL_NPC', targetId: 'npc-1', partyCaused: true }, null)).toBeNull();
  });

  it('maps KILL_NPC → remove_npc with the npc id', () => {
    const action = mapEventToPartyImpact({ type: 'KILL_NPC', targetId: 'npc-1', partyCaused: true, description: 'Slain in the vault' }, SAVE);
    expect(action).toMatchObject({
      kind: 'remove_npc',
      settlementId: SAVE,
      npcId: 'npc-1',
      magnitude: PARTY_IMPACT_KINDS.remove_npc.defaultMagnitude,
      note: 'Slain in the vault',
    });
  });

  it('maps IMPAIR_FACTION → undermine_faction and RESTORE_FACTION → bolster_faction', () => {
    const undermine = mapEventToPartyImpact({ type: 'IMPAIR_FACTION', targetId: 'thieves', partyCaused: true }, SAVE);
    expect(undermine).toMatchObject({ kind: 'undermine_faction', factionId: 'thieves', settlementId: SAVE });
    const bolster = mapEventToPartyImpact({ type: 'RESTORE_FACTION', targetId: 'guild', partyCaused: true }, SAVE);
    expect(bolster).toMatchObject({ kind: 'bolster_faction', factionId: 'guild', settlementId: SAVE });
  });

  it('falls back to the kind default note when the event has no description', () => {
    const action = mapEventToPartyImpact({ type: 'KILL_NPC', targetId: 'npc-1', partyCaused: true }, SAVE);
    expect(action.note).toBe(PARTY_IMPACT_KINDS.remove_npc.note);
  });

  it('returns null for events with no world-scale analog (attribution-only)', () => {
    for (const type of ['ADD_INSTITUTION', 'REMOVE_INSTITUTION', 'IMPAIR_INSTITUTION', 'ADD_NPC', 'ASSIGN_NPC_TO_ROLE', 'ADD_FACTION', 'DEPLETE_RESOURCE', 'CUT_TRADE_ROUTE']) {
      expect(mapEventToPartyImpact({ type, targetId: 'x', partyCaused: true }, SAVE)).toBeNull();
    }
  });

  it('returns null when the target id is blank', () => {
    expect(mapEventToPartyImpact({ type: 'KILL_NPC', targetId: '   ', partyCaused: true }, SAVE)).toBeNull();
  });

  it('every mapped kind is a real PARTY_IMPACT_KIND', () => {
    for (const type of PARTY_LINKED_EVENT_TYPES) {
      const action = mapEventToPartyImpact({ type, targetId: 't', partyCaused: true }, SAVE);
      expect(PARTY_IMPACT_KINDS[action.kind]).toBeTruthy();
    }
  });
});
