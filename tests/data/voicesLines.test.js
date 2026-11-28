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
import { CARD_WORDS } from '../../src/domain/voices/cardWords.js';
import { CHANGED_WORDS, CLASS_ANSWERS, NEEDS_ATOM, NOUN_DECLARATION, SPEAKER_KEY, TEMPERS, needsTermsOf, liarGroupOf, nounDeclarationOf } from '../../scripts/gen-voices-lines.mjs';

const said = Object.entries(SAID_LINES).flatMap(([pool, rows]) => rows.map((row) => ({ pool, row })));
const liar = Object.entries(LIAR_LINES).flatMap(([group, rows]) => rows.map((row) => ({ group, row })));

describe('the said lines (the first load: 197 lines, 53 pools)', () => {
  it('holds every line of the writer once, filed by its kind and state', () => {
    expect(said).toHaveLength(197);
    expect(Object.keys(SAID_LINES)).toHaveLength(53);
    expect(new Set(said.map(({ row }) => row.id)).size).toBe(197);
    const ABBR = { inst: 'institution', trad: 'tradition' };
    for (const { pool, row } of said) {
      const [, kind, state] = /^SAID\.(\w+)\.([\w-]+)\.\d+$/.exec(row.id) || [];
      // the six lines of a tension's own type moved to their own state (ruling G1-1 (3)); their ids stand
      const moved = { 'SAID.tension.crime': 'tension.graft', 'SAID.tension.neighbours': 'tension.mistrust' }[row.id.replace(/\.\d+$/, '')];
      expect([`${ABBR[kind] || kind}.${state}`, moved].includes(pool), row.id).toBe(true);
    }
  });

  it('gives every line four non-empty versions, one a stored disposition, and a speaker rule', () => {
    for (const { row } of said) {
      expect(Object.keys(row.versions)).toEqual([...TEMPERS]);
      for (const t of TEMPERS) expect(row.versions[t].text.trim().length, `${row.id} ${t}`).toBeGreaterThan(0);
      expect(row.speaker.length, row.id).toBeGreaterThan(0);
      for (const k of row.speaker) expect(Object.values(SPEAKER_KEY), `${row.id} ${k}`).toContain(k);
      expect(Object.isFrozen(row) && Object.isFrozen(row.versions)).toBe(true);
    }
  });

  it('declares only atoms of the vocabulary that have a reader, on each version (the carrier the door reads)', () => {
    for (const { row } of [...said, ...liar]) {
      for (const a of [...(row.needs || []), ...(row.excludes || [])]) expect(() => assertDeclarable(a), `${row.id} ${a}`).not.toThrow();
      for (const t of TEMPERS) {
        for (const a of [...(row.versions[t].needs || []), ...(row.versions[t].excludes || [])]) expect(() => assertDeclarable(a), `${row.id} ${t} ${a}`).not.toThrow();
      }
    }
    for (const a of Object.values(NEEDS_ATOM)) expect(() => assertDeclarable(a), a).not.toThrow();
    for (const d of Object.values(NOUN_DECLARATION)) for (const a of [...(d.needs || []), ...(d.excludes || []), ...Object.values(d.byWord || {}).flat()]) expect(() => assertDeclarable(a), a).not.toThrow();
  });

  it('declares on every version the nouns its own words name (the rule book\'s answer), and the writer\'s needs', () => {
    for (const { row } of [...said, ...liar]) {
      for (const t of TEMPERS) {
        const own = nounDeclarationOf(row.versions[t].text, row.id);
        for (const a of own.needs) expect(row.versions[t].needs || [], `${row.id} ${t}`).toContain(a);
        for (const a of own.excludes) expect(row.versions[t].excludes || [], `${row.id} ${t}`).toContain(a);
      }
    }
    const streets = said.find(({ row }) => row.id === 'SAID.tension.crime.2').row;
    expect(streets.versions.welcoming.needs).toEqual(['tier: ≥ village']);
    expect(streets.versions.transactional.needs).toBeUndefined();
  });

  it('answers each needs word by an atom, by the card, or nowhere; a word answered nowhere leaves its VERSION out (ruling G1-2)', () => {
    const out = said.flatMap(({ row }) => TEMPERS.filter((t) => row.versions[t].ineligible).map((t) => `${row.id} ${t}: ${row.versions[t].ineligible.join(',')}`));
    // none since the four candle versions were reworded (the chair's G1-4 (d)): the count is pinned with its list in
    // tests/domain/voices/voicesIneligible.test.js
    expect(out).toEqual([]);
    const carded = said.flatMap(({ row }) => TEMPERS.flatMap((t) => row.versions[t].card || []));
    for (const w of carded) expect(Object.keys(CARD_WORDS)).toContain(w);
    expect(new Set(carded).size).toBe(8);
    for (const { row } of said) expect(row.ineligible, row.id).toBeUndefined();
  });

  it('carries the changed words (G1-3 (3), G1-4) and the class answers (G1-3 (1), (2)) onto the versions they name', () => {
    const all = [...said, ...liar].map(({ row }) => row);
    const at = (/** @type {string} */ k) => { const [id, w] = k.split(' '); const row = all.find((r) => r.id === id); return w === 'inTruth' ? { text: row.inTruth, needs: row.needs, excludes: row.excludes } : row.versions[w]; };
    for (const [k, c] of Object.entries(CHANGED_WORDS)) expect(at(k).text, k).toBe(c.to);
    for (const [k, a] of Object.entries(CLASS_ANSWERS)) {
      for (const x of a.needs || []) expect(at(k).needs, k).toContain(x);
      for (const x of a.excludes || []) expect(at(k).excludes, k).toContain(x);
      for (const x of a.card || []) expect(at(k).card, k).toContain(x);
    }
    expect(Object.keys(CHANGED_WORDS).length).toBe(10);
    expect(Object.keys(CLASS_ANSWERS).length).toBe(9);
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
      for (const t of TEMPERS) expect(row.versions[t].text.trim().length, `${row.id} ${t}`).toBeGreaterThan(0);
      expect(row.inTruth.trim().length, row.id).toBeGreaterThan(0);
    }
    expect(Object.keys(LIAR_LINES).sort()).toEqual(['blackmarket', 'extortion', 'front.other', 'front.trade', 'killing',
      'office.faith', 'office.hall', 'retainer', 'secrets', 'smuggling', 'theft', 'tunnels']);
  });
});
