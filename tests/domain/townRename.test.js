/**
 * tests/domain/townRename.test.js — POINT 124, unit K2: THE HAZARDS of `domain/townRename.js :: renameTownInRecord` (the
 * measure `docs/chair/2026-11-27/eleventh/rename/build/M3-K2-stored.md`, each rule below one row of its table).
 */
import { describe, it, expect } from 'vitest';
import { renameTownInRecord } from '../../src/domain/townRename.js';

/** @param {Record<string, unknown>} over */
const town = (over = {}) => ({
  id: 's_ford', name: 'Ford', tier: 'village',
  arrivalScene: 'Ford sits where the road meets the river.',
  pressureSentence: "Ford's debt grows, and the salt runs short.",
  stress: { type: 'indebted', summary: 'Ford owes more than it can pay.' },
  stressors: { type: 'indebted', summary: 'Ford owes more than it can pay.' },
  npcs: [{ id: 'npc_a', name: 'Ana Weber' }], institutions: [{ name: 'Market' }],
  history: { historicalEvents: [{ name: 'The Ford Flood', desc: 'Ford flooded.' }] },
  ...over,
});

describe('renameTownInRecord: the stored sentences follow the name, by whole word, and nothing else moves', () => {
  it('rewrites the four homes (and the stressors mirror), a possessive included; every other field is left as it is', () => {
    const before = town();
    const after = renameTownInRecord(before, 'Ford', 'Quillmarsh');
    expect(after.name).toBe('Quillmarsh');
    expect(after.arrivalScene).toBe('Quillmarsh sits where the road meets the river.');
    expect(after.pressureSentence).toBe("Quillmarsh's debt grows, and the salt runs short.");
    expect(after.stress.summary).toBe('Quillmarsh owes more than it can pay.');
    expect(after.stressors.summary).toBe('Quillmarsh owes more than it can pay.');
    expect(after.history).toEqual(before.history); // a stored event is not a home: no field but the homes is touched
    expect(before.arrivalScene, 'the record handed in is not mutated').toBe('Ford sits where the road meets the river.');
  });

  it('a crisis list: every entry\'s summary', () => {
    const after = renameTownInRecord(town({ stress: [{ type: 'famine', summary: 'Ford is hungry.' }, { type: 'plague_onset', summary: 'Ford is sick.' }] }), 'Ford', 'Ashby');
    expect(after.stress.map((/** @type {any} */ e) => e.summary)).toEqual(['Ashby is hungry.', 'Ashby is sick.']);
  });

  it('a name inside a longer word is never rewritten ("Fordham"); a lower-case common word is never rewritten ("salt")', () => {
    const after = renameTownInRecord(town({ name: 'Salt', arrivalScene: 'Salt lies past Fordham; the salt roads meet at Salt.' }), 'Salt', 'Quillmarsh');
    expect(after.arrivalScene).toBe('Quillmarsh lies past Fordham; the salt roads meet at Quillmarsh.');
  });

  it('an occurrence inside another stored proper name is masked ("Ford Abbey", "Ana Ford")', () => {
    const s = town({
      institutions: [{ name: 'Ford Abbey' }], npcs: [{ name: 'Ana Ford' }],
      arrivalScene: 'Ford is ruled from Ford Abbey, and Ana Ford keeps its keys.',
    });
    expect(renameTownInRecord(s, 'Ford', 'Quillmarsh').arrivalScene).toBe('Quillmarsh is ruled from Ford Abbey, and Ana Ford keeps its keys.');
  });

  it('where the old name IS another stored name (a house called Ford), only `name` changes: the rename does not guess', () => {
    const s = town({ institutions: [{ name: 'Ford' }] });
    const after = renameTownInRecord(s, 'Ford', 'Quillmarsh');
    expect(after.name).toBe('Quillmarsh');
    expect(after.arrivalScene).toBe(s.arrivalScene);
    expect(after.stress).toEqual(s.stress);
  });

  it('a Unicode name (Ö, Á), a hyphenated one and a multi-word new name', () => {
    expect(renameTownInRecord(town({ name: 'Ögedeidavan', arrivalScene: 'Ögedeidavan wakes early.' }), 'Ögedeidavan', 'Ásaker').arrivalScene).toBe('Ásaker wakes early.');
    expect(renameTownInRecord(town({ name: 'Dar-al-darya', arrivalScene: 'In Dar-al-darya the tide rules.' }), 'Dar-al-darya', 'Port of Salt').arrivalScene).toBe('In Port of Salt the tide rules.');
  });

  it('a rename back restores the record byte for byte; a no-op rename and a blank name write nothing but what they were handed', () => {
    const s = town();
    expect(JSON.stringify(renameTownInRecord(renameTownInRecord(s, 'Ford', 'Quillmarsh'), 'Quillmarsh', 'Ford'))).toBe(JSON.stringify(s));
    expect(renameTownInRecord(s, 'Ford', 'Ford')).toEqual(s);
    expect(renameTownInRecord(s, 'Ford', '   ')).toEqual(s);
  });
  it('a name the DM typed (a note, an edited description) is NOT rewritten: the cascade touches only the measured homes (K2-1 (iv))', () => {
    const s = town({
      dmNotes: 'Ford owes me a favour.', dossierNotes: 'Remember Ford at the next session.', narrativeNotes: 'Ford, in my own words.',
      institutions: [{ name: 'Mill', desc: 'The old mill of Ford, as I rewrote it.' }],
      _userEdits: { 'institution:0': { desc: 'The old mill of Ford, as I rewrote it.' } },
    });
    const after = renameTownInRecord(s, 'Ford', 'Quillmarsh');
    expect([after.dmNotes, after.dossierNotes, after.narrativeNotes]).toEqual([s.dmNotes, s.dossierNotes, s.narrativeNotes]);
    expect(after.institutions).toEqual(s.institutions);
    expect(after._userEdits).toEqual(s._userEdits);
    // anchored: the same rename DID rewrite the measured homes of this record
    expect(after.arrivalScene).toBe('Quillmarsh sits where the road meets the river.');
  });
});
