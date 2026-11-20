/**
 * tests/domain/tonightCastTail.test.js — SW-6 CRISIS-SURFACES (STYLE-RULINGS-2 A1 R4; W4 PEOPLE row 271): the
 * Tonight crisis head's cast tail says who the crisis lands on in the hooks' own clauses, never the cast's role
 * tag printed as prose ("Macrina Denter (bears the brunt); Hortensia Denter (bears the brunt).", soak1k-4).
 */
import { describe, it, expect } from 'vitest';
import { composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';

const row = (role, id, name) => ({ role, kind: 'npc', id, name, reason: 'r', temporary: false });
const castOf = (nature, rank, roles) => ({ nature, rank, roles, absent: [], stakes: [], levers: [], ifNothingIsDone: { residualEffects: [] }, playersSeeFirst: [], links: [] });
const town = (stress) => ({
  name: 'Portaminus',
  npcs: [{ id: 'a', name: 'Macrina Denter', role: 'watch commander' }, { id: 'b', name: 'Hortensia Denter', role: 'almoner' }, { id: 'c', name: 'Chae Liu', role: 'reeve' }],
  stress,
});

describe('the Tonight cast tail', () => {
  it('two crises, each landing on its own person: one sentence, each attributed to its crisis, no role tag', () => {
    const sheet = composeTonightSheet(town([
      { type: 'monster_pressure', label: 'Beast & Raider Threat', cast: castOf('natural', 1, [row('brunt', 'a', 'Macrina Denter')]) },
      { type: 'mass_migration', label: 'Mass Migration', cast: castOf('natural', 2, [row('brunt', 'b', 'Hortensia Denter')]) },
    ]));
    // anchored: the subject is the exact text asserted positively beside it (SW-6), so it cannot have drifted away
    expect(sheet.opening).not.toMatch(/\(bears the brunt\)/);
    expect(sheet.opening).toMatch(/The worst of it falls on Macrina Denter in the raids and on Hortensia Denter in the migration\.$/);
  });
  it('one crisis: the worst of it falls on the person, plainly', () => {
    const sheet = composeTonightSheet(town([{ type: 'monster_pressure', label: 'Beast & Raider Threat', cast: castOf('natural', 1, [row('brunt', 'a', 'Macrina Denter')]) }]));
    expect(sheet.opening).toMatch(/The worst of it falls on Macrina Denter\.$/);
  });
  it('a social crisis names its instigator in the hooks\' clause, never "the worst of it"', () => {
    const sheet = composeTonightSheet(town([{ type: 'recently_betrayed', label: 'Recently Betrayed', cast: castOf('social', 1, [row('instigator', 'c', 'Chae Liu')]) }]));
    expect(sheet.opening).toMatch(/Chae Liu is stirring it\.$/);
    // anchored: the subject is the exact text asserted positively beside it (SW-6), so it cannot have drifted away
    expect(sheet.opening).not.toMatch(/\(instigator\)/);
  });
});
