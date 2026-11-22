/**
 * tests/domain/crisisCastEdit.test.js — the DM's word on a crisis cast (docs/DESIGN_CRISIS_TAB.md,
 * "Editing (Trust the DM)"): `EDITABLE_FIELDS.crisis` holds the cast path, the edit rides the
 * crisis entry and is read through `walkUserEdits`, and "As the engine has it" reverts it.
 * `src/domain/crisis/crisisCast.js :: effectiveCastOf` is the one reader of the edited cast.
 */
import { describe, it, expect } from 'vitest';
import { EDITABLE_FIELDS, isEditablePath, applyUserEdit, revertUserEdit, walkUserEdits } from '../../src/domain/userEdits.js';
import {
  CAST_EDIT_PATH, formatCastRoles, parseCastRoles, effectiveCastOf, CAST_REASONS,
} from '../../src/domain/crisis/crisisCast.js';

const engineCast = () => ({
  nature: 'natural', rank: 1, absent: [], stakes: [], levers: [], ifNothingIsDone: { residualEffects: [] }, playersSeeFirst: ['food', 'defence'], links: [],
  roles: [
    { role: 'brunt', kind: 'npc', id: 'n8', name: 'Ren Hale', reason: CAST_REASONS.bruntLeast, temporary: false },
    { role: 'lever', kind: 'institution', id: 'Town granary', name: 'Town granary', reason: CAST_REASONS.leverInstitution, temporary: false },
  ],
});
const town = () => ({
  npcs: [{ id: 'n1', name: 'Mara Vell', role: 'Mayor' }, { id: 'n8', name: 'Ren Hale', role: 'Baker' }],
  institutions: [{ name: 'Town granary' }],
  powerStructure: { factions: [{ faction: 'Town Council', power: 10 }] },
  stress: [{ type: 'famine', label: 'Famine', cast: engineCast() }],
});

describe('the crisis cast is the DM\'s to edit, on the crisis record alone', () => {
  it('EDITABLE_FIELDS.crisis holds the cast path', () => {
    expect(EDITABLE_FIELDS.crisis).toEqual([CAST_EDIT_PATH]);
    expect(isEditablePath('crisis', CAST_EDIT_PATH)).toBe(true);
  });

  it('the cast spells as one line of role, kind and id, and reads back exactly', () => {
    const line = formatCastRoles(engineCast().roles);
    expect(parseCastRoles(line)).toEqual([
      { role: 'brunt', kind: 'npc', id: 'n8' },
      { role: 'lever', kind: 'institution', id: 'Town granary' },
    ]);
  });

  it('a reassigned role reads as the DM\'s, resolved against the roster; a stale id is dropped, never shown as a blank name', () => {
    const s = town();
    const entry = s.stress[0];
    applyUserEdit(entry, CAST_EDIT_PATH, formatCastRoles([
      { role: 'brunt', kind: 'npc', id: 'n1' },
      { role: 'exploiter', kind: 'npc', id: 'n-gone' },
    ]), { editedAt: '2026-11-03T00:00:00Z' });
    const { cast, edited } = effectiveCastOf(s, entry);
    expect(edited).toBe(true);
    expect(cast.roles).toEqual([{ role: 'brunt', kind: 'npc', id: 'n1', name: 'Mara Vell', reason: CAST_REASONS.dm, temporary: false }]);
  });

  it('an emptied cast is the DM\'s word too: nobody', () => {
    const s = town();
    applyUserEdit(s.stress[0], CAST_EDIT_PATH, '', { editedAt: '2026-11-03T00:00:00Z' });
    expect(effectiveCastOf(s, s.stress[0])).toMatchObject({ edited: true, cast: { roles: [] } });
  });

  it('the edit rides the crisis entry and walkUserEdits reads it by the entry\'s id', () => {
    const s = town();
    applyUserEdit(s.stress[0], CAST_EDIT_PATH, formatCastRoles([{ role: 'brunt', kind: 'npc', id: 'n1' }]), { editedAt: '2026-11-03T00:00:00Z' });
    const rows = walkUserEdits(s).filter((r) => r.kind === 'crisis');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ kind: 'crisis', entityIndex: 0, path: CAST_EDIT_PATH });
    expect(rows[0].entity.type).toBe('famine');
  });

  it('"As the engine has it" reverts to the derived cast', () => {
    const s = town();
    applyUserEdit(s.stress[0], CAST_EDIT_PATH, formatCastRoles([{ role: 'brunt', kind: 'npc', id: 'n1' }]), { editedAt: '2026-11-03T00:00:00Z' });
    revertUserEdit(s.stress[0], CAST_EDIT_PATH);
    expect(effectiveCastOf(s, s.stress[0])).toMatchObject({ edited: false, cast: engineCast() });
    expect(walkUserEdits(s).filter((r) => r.kind === 'crisis')).toEqual([]); // anchored: the previous line proves the entry and its cast are present
  });
});
