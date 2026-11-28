/**
 * tests/data/voicesLines.test.js — THE VOICES' LINES AS DATA (S-G1, the eleventh chair's ruling E28 point 10).
 *
 * The two data files are generated once from VOICES-LINES' TSVs (`scripts/gen-voices-lines.mjs`). This holds what the
 * engine relies on: every line has an id of its pool, four non-empty versions and a speaker rule; every `needs` atom is
 * an atom of the vocabulary with a reader (asked of the record through the one door); a writer's `needs` word with no
 * atom makes its line INELIGIBLE, never silently dropped; the liar's lines each carry the DM's "in truth".
 */
import { describe, expect, it } from 'vitest';
import { SAID_LINES } from '../../src/data/voices/saidLines.js';
import { LIAR_LINES } from '../../src/data/voices/liarLines.js';
import { assertDeclarable } from '../../src/domain/facts/factVocabulary.js';
import { NEEDS_ATOM, TEMPERS, needsTermsOf, liarGroupOf } from '../../scripts/gen-voices-lines.mjs';

const said = Object.entries(SAID_LINES).flatMap(([pool, rows]) => rows.map((row) => ({ pool, row })));
const liar = Object.entries(LIAR_LINES).flatMap(([group, rows]) => rows.map((row) => ({ group, row })));

describe('the said lines (the first load: 197 lines, 51 pools)', () => {
  it('holds every line of the writer once, filed by its kind and state', () => {
    expect(said).toHaveLength(197);
    expect(Object.keys(SAID_LINES)).toHaveLength(51);
    expect(new Set(said.map(({ row }) => row.id)).size).toBe(197);
    const ABBR = { inst: 'institution', trad: 'tradition' };
    for (const { pool, row } of said) {
      const [, kind, state] = /^SAID\.(\w+)\.([\w-]+)\.\d+$/.exec(row.id) || [];
      expect(`${ABBR[kind] || kind}.${state}`, row.id).toBe(pool);
    }
  });

  it('gives every line four non-empty versions, one a stored disposition, and a speaker rule', () => {
    for (const { row } of said) {
      expect(Object.keys(row.versions)).toEqual([...TEMPERS]);
      for (const t of TEMPERS) expect(row.versions[t].trim().length, `${row.id} ${t}`).toBeGreaterThan(0);
      expect(row.speaker.length, row.id).toBeGreaterThan(0);
      expect(Object.isFrozen(row) && Object.isFrozen(row.versions)).toBe(true);
    }
  });

  it('declares only atoms of the vocabulary that have a reader', () => {
    for (const { row } of said) {
      for (const a of row.needs || []) expect(() => assertDeclarable(a), `${row.id} ${a}`).not.toThrow();
      for (const [t, atoms] of Object.entries(row.versionNeeds || {})) {
        expect(TEMPERS).toContain(t);
        for (const a of atoms) expect(() => assertDeclarable(a), `${row.id} ${t} ${a}`).not.toThrow();
      }
    }
    for (const a of Object.values(NEEDS_ATOM)) expect(() => assertDeclarable(a), a).not.toThrow();
  });

  it('makes a line whose needs word has no atom INELIGIBLE, and no other line', () => {
    for (const { row } of said) {
      const unmapped = (row.needsWords || []).filter((w) => !Object.hasOwn(NEEDS_ATOM, w));
      expect(row.ineligible !== undefined, row.id).toBe(unmapped.length > 0);
      for (const w of unmapped) expect(row.ineligible).toContain(`${w}: no atom`);
    }
    const ineligible = said.filter(({ row }) => row.ineligible).map(({ row }) => row.id);
    expect(ineligible.length).toBeGreaterThan(0);
    expect(ineligible.length).toBeLessThan(30);
  });

  it('reads the writer\'s needs cell: a word, its gloss, and the tempers that need it', () => {
    expect(needsTermsOf('clerks (a hall with a staff) (W); candles (T)')).toEqual([
      { word: 'clerks', tempers: ['welcoming'] }, { word: 'candles', tempers: ['transactional'] },
    ]);
    expect(needsTermsOf('type: corruption_scandal; a hearing (C)')).toEqual([
      { word: 'type: corruption_scandal', tempers: null }, { word: 'a hearing', tempers: ['cautious'] },
    ]);
    expect(needsTermsOf('fish (a fishing house; not a ferry or a boatyard) (D); (the water family holds no well or bath-house)'))
      .toEqual([{ word: 'fish', tempers: ['dismissive'] }]);
    expect(needsTermsOf('')).toEqual([]);
  });
});

describe('the liar\'s lines (the first load: 40 lines)', () => {
  it('holds every liar line once, filed by its group, each with the DM\'s truth', () => {
    expect(liar).toHaveLength(40);
    expect(new Set(liar.map(({ row }) => row.id)).size).toBe(40);
    for (const { group, row } of liar) {
      expect(group).toBe(liarGroupOf(row.id));
      expect(Object.keys(row.versions)).toEqual([...TEMPERS]);
      for (const t of TEMPERS) expect(row.versions[t].trim().length, `${row.id} ${t}`).toBeGreaterThan(0);
      expect(row.inTruth.trim().length, row.id).toBeGreaterThan(0);
    }
    expect(Object.keys(LIAR_LINES).sort()).toEqual(['blackmarket', 'extortion', 'front.other', 'front.trade', 'killing',
      'office.faith', 'office.hall', 'retainer', 'secrets', 'smuggling', 'theft', 'tunnels']);
  });
});
