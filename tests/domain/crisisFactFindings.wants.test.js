/**
 * SW-6 CRISIS-SURFACES (#40 / A·T3; the chair's grant 12:5x): a cast person's want reads the crisis's scarce good
 * and their own house, and the checker re-derives it through the writer's fill — a house-filled want passes, a
 * want from another role's pool still fails.
 */
import { describe, it, expect } from 'vitest';
import { castWantOf, CAST_WANTS, composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';
import { crisisCastSenseFindings } from '../../src/domain/coherence/crisisFactFindings.js';

const row = (role, id, name) => ({ role, kind: 'npc', id, name, reason: 'r', temporary: false });
const town = () => ({
  name: 'Albamunicipium',
  npcs: [{ id: 'p', name: 'Paullus Severus', role: 'elder', memberships: [{ power: 'Elder Council', rank: 1 }] }],
  powerStructure: { factions: [{ faction: 'Elder Council', power: 60, isGoverning: true }] },
  stress: [{ type: 'mass_migration', label: 'Mass Migration', cast: { nature: 'natural', rank: 1, roles: [row('brunt', 'p', 'Paullus Severus')], absent: [], stakes: [], levers: [], ifNothingIsDone: { residualEffects: [] }, playersSeeFirst: [], links: [] } }],
});

describe('the cast want reads the crisis and the house (SW-6, #40)', () => {
  it('the want names the person\'s house or the crisis\'s scarce good, never a fixed line', () => {
    const want = castWantOf('brunt', 'p', 'mass_migration', '', 'Elder Council');
    expect(want).toMatch(/the people of the Elder Council|shelter/);
    expect(want).not.toMatch(/\{/);
    expect(Object.values(CAST_WANTS).flat().join(' ')).not.toMatch(/rather than/);
  });
  it('the checker passes the house-filled want and refuses another role\'s', () => {
    const s = town();
    const sheet = composeTonightSheet(s);
    expect(sheet.people[0]).toMatchObject({ why: 'cast', castId: 'p', castKind: 'mass_migration' });
    expect(crisisCastSenseFindings(s).filter((f) => /want_not_role/.test(f.detail))).toEqual([]);
    // exact equality to the writer's fill: the lever's want for the same person is not the brunt's
    expect(castWantOf('lever', 'p', 'mass_migration', '', 'Elder Council')).not.toBe(sheet.people[0].line);
  });
});
