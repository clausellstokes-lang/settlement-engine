/**
 * assignNpcPreservesSheet.test.js — [domain-top-1].
 *
 * The SuccessorPrompt flow (a pillar dies → ASSIGN_NPC_TO_ROLE on an existing
 * pipeline NPC) used to rebuild the appointee through createNpc's 13-field list,
 * wiping the rich generated sheet (personality/secret/goal/plotHooks/category/
 * factionAffiliation/structuralPosition/corruption) and any DM _userEdits/_authored.
 * The fix overlays only the structural fields onto the original NPC.
 */

import { describe, test, expect } from 'vitest';
import { assignNpcToRole } from '../../src/domain/entities/npcs.js';

const richNpc = () => ({
  id: 'npc.volker_ab12',
  name: 'Volker Krüger',
  role: 'Guard',
  importance: 'notable',
  status: 'active',
  linkedInstitutionIds: ['inst.barracks'],
  linkedFactionIds: ['faction.watch'],
  influence: 20,
  // rich pipeline fields (NOT in createNpc's field list):
  personality: 'gruff but fair',
  physical: 'scarred, broad-shouldered',
  secret: { short: 'takes bribes', long: 'has taken bribes for years', driven_by: 'debt' },
  goal: { short: 'pay off his debt', long: 'clear the family ledger' },
  plotHooks: ['owes the moneylender'],
  category: 'military',
  factionAffiliation: 'faction.watch',
  structuralPosition: { seat: 'garrison', rank: 'subordinate' },
  corrupt: true,
  corruptionVector: 'bribery',
  createdByEventId: 'evt.gen.1',
  _userEdits: { personality: { value: 'gruff but fair', originalValue: 'gruff', editedAt: 111 } },
  _authored: true,
});

describe('[domain-top-1] ASSIGN_NPC_TO_ROLE preserves the full NPC sheet', () => {
  test('rich fields + user edits survive the assignment', () => {
    const before = richNpc();
    const { npc } = assignNpcToRole({
      npc: before,
      institutionId: 'inst.town_hall',
      role: 'Captain of the Watch',
      quality: 'competent',
      importance: 'pillar',
      influence: 60,
      eventId: 'evt.assign.1',
    });

    // Rich sheet preserved byte-for-byte
    expect(npc.personality).toBe(before.personality);
    expect(npc.physical).toBe(before.physical);
    expect(npc.secret).toEqual(before.secret);
    expect(npc.goal).toEqual(before.goal);
    expect(npc.plotHooks).toEqual(before.plotHooks);
    expect(npc.category).toBe('military');
    expect(npc.factionAffiliation).toBe('faction.watch');
    expect(npc.structuralPosition).toEqual(before.structuralPosition);
    expect(npc.corrupt).toBe(true);
    expect(npc.corruptionVector).toBe('bribery');
    expect(npc.createdByEventId).toBe('evt.gen.1');
    expect(npc._userEdits).toEqual(before._userEdits);
    expect(npc._authored).toBe(true);
    expect(npc.id).toBe(before.id); // identity preserved

    // Structural fields legitimately changed
    expect(npc.status).toBe('active');
    expect(npc.role).toBe('Captain of the Watch');
    expect(npc.importance).toBe('pillar');
    expect(npc.influence).toBe(60);
    expect(npc.linkedInstitutionIds).toContain('inst.town_hall');
    expect(npc.linkedInstitutionIds).toContain('inst.barracks');
  });

  test('a brand-new appointee (null npc) still produces a valid structural NPC', () => {
    const { npc } = assignNpcToRole({
      npc: null,
      institutionId: 'inst.town_hall',
      role: 'Steward',
      quality: 'competent',
      eventId: 'evt.assign.2',
    });
    expect(npc.role).toBe('Steward');
    expect(npc.status).toBe('active');
    expect(npc.linkedInstitutionIds).toContain('inst.town_hall');
  });
});
