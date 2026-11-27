/**
 * tests/domain/facts/drawDeclaredRanked.test.js — THE DOOR'S RANKED MODE (point 121, TAIL-PICKS; the chair's
 * ruling 121-1 (1)). `drawDeclared(pool, { rankKey, taken })` walks the domain in rendezvous rank of
 * (rankKey, the line's own id) and prints the first line the place admits, or whose twin it admits; ids in
 * `taken` are skipped; exactly the printed line is noted. THE BAR: nothing a place cannot print may change
 * what it prints.
 *
 * @enforced-by npx vitest run tests/domain/facts/drawDeclaredRanked.test.js
 */
import { describe, expect, it } from 'vitest';
import { drawDeclared } from '../../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';
import { rankRendezvous } from '../../../src/kernel/proseHash.js';

const WALLED = factsOf({ tier: 'town', institutions: [{ name: 'Town walls', category: 'Defense' }] });
const BARE = factsOf({ tier: 'town', institutions: [] });
const KEYS = Array.from({ length: 300 }, (_, i) => `Town${i}::slot`);
const idOf = (/** @type {{ id: string }} */ l) => l.id;

/** @typedef {{ id: string, text: string, needs?: string[], excludes?: string[], twinOf?: string }} Row */
/** @type {Row[]} */
const POOL = [
  { id: 'P1', text: 'Plain one.' },
  { id: 'P2', text: 'Behind its walls, merchants shelter.', needs: ['walls'] },
  { id: 'P3', text: 'Plain three.' },
  { id: 'P4', text: 'Plain four.' },
  { id: 'P5', text: 'Inside its fences, merchants shelter.', excludes: ['walls'], twinOf: 'Behind its walls, merchants shelter.' },
];

/** @param {ReadonlyArray<Row>} pool @param {string} key @param {object} facts @param {object} [more] */
const ranked = (pool, key, facts, more = {}) => {
  const { result, ledger } = withPresumptionLedger(() => drawDeclared(pool, { rankKey: key, key, facts, poolId: 'T', surface: 't', ...more }));
  return { result, notes: ledger.map((e) => [e.pool, e.lineId, e.resolvedBy]) };
};

describe('drawDeclared, the ranked mode', () => {
  it('(i) a line ADDED that the place refuses moves nothing: the printed line and the note are equal', () => {
    const added = [...POOL, { id: 'P6', text: 'A walled addition.', needs: ['walls'] }];
    for (const key of KEYS) expect(ranked(added, key, BARE)).toEqual(ranked(POOL, key, BARE));
  });

  it('(ii) a line removed that the place did not print moves nothing', () => {
    for (const key of KEYS) {
      const before = ranked(POOL, key, WALLED);
      for (const gone of POOL.filter((l) => !l.twinOf && l !== before.result.line)) {
        expect(ranked(POOL.filter((l) => l !== gone), key, WALLED)).toEqual(before);
      }
    }
  });

  it('(iii) a refused top line prints its admitted twin; with the twin refused too, the next printable in rank', () => {
    let twins = 0; let next = 0;
    for (const key of KEYS) {
      const order = rankRendezvous(POOL.filter((l) => !l.twinOf), key, idOf);
      const bare = ranked(POOL, key, BARE).result;
      if (order[0].id === 'P2') { twins += 1; expect(bare).toMatchObject({ line: POOL[4], resolvedBy: 'twin' }); }
      else expect(bare.line).toBe(order[0]);
      // the twin refused as well (a place both walled-less and twin-refusing): the next in rank prints
      const noTwin = POOL.map((l) => (l.id === 'P5' ? { ...l, needs: ['walls'] } : l));
      const out = ranked(noTwin, key, BARE).result;
      if (order[0].id === 'P2') { next += 1; expect(out).toMatchObject({ line: noTwin.find((l) => l.id === order[1].id), resolvedBy: 'drawn', refused: null }); }
    }
    expect(twins).toBeGreaterThan(0); expect(next).toBeGreaterThan(0);
  });

  it('(iv) an id in `taken` is skipped: the next in rank prints', () => {
    for (const key of KEYS.slice(0, 50)) {
      const order = rankRendezvous(POOL.filter((l) => !l.twinOf && !l.needs), key, idOf);
      const plain = POOL.filter((l) => !l.twinOf && !l.needs);
      expect(ranked(plain, key, null, { taken: new Set([order[0].id]) }).result.line).toBe(order[1]);
      expect(ranked(plain, key, null, { taken: new Set(plain.map(idOf)) }).result).toMatchObject({ line: null, resolvedBy: 'none' });
    }
  });

  it('(v) an undeclared pool prints the top of the rank, noted once as drawn', () => {
    const plain = POOL.filter((l) => !l.twinOf && !l.needs);
    for (const key of KEYS.slice(0, 50)) {
      const top = rankRendezvous(plain, key, idOf)[0];
      expect(ranked(plain, key, null)).toEqual({ result: { line: top, text: top.text, refused: null, resolvedBy: 'drawn' }, notes: [['T', top.id, 'drawn']] });
    }
  });

  it('(vi) keepRefused keeps the top of the rank when nothing is printable; a held line is skipped', () => {
    const walledOnly = [{ id: 'W1', text: 'Walled one.', needs: ['walls'] }, { id: 'W2', text: 'Walled two.', needs: ['walls'] }];
    for (const key of KEYS.slice(0, 50)) {
      const top = rankRendezvous(walledOnly, key, idOf)[0];
      expect(ranked(walledOnly, key, BARE, { keepRefused: true })).toEqual({ result: { line: top, text: top.text, refused: ['walls'], resolvedBy: 'kept' }, notes: [['T', top.id, 'kept']] });
      expect(ranked(walledOnly, key, BARE)).toEqual({ result: { line: null, text: null, refused: ['walls'], resolvedBy: 'none' }, notes: [] });
      const plain = POOL.filter((l) => !l.twinOf && !l.needs);
      const order = rankRendezvous(plain, key, idOf);
      expect(ranked(plain, key, null, { held: new Set([order[0].text]) }).result.line).toBe(order[1]);
    }
  });

  it('notes exactly the printed line, never a line it walked past', () => {
    for (const key of KEYS) {
      const { result, notes } = ranked(POOL, key, BARE);
      expect(notes).toEqual([['T', /** @type {Row} */ (result.line).id, result.resolvedBy]]);
    }
  });

  it('a line with no id in a ranked draw is the caller\'s mistake: it throws, it never falls back to a position', () => {
    expect(() => drawDeclared(['bare string', { text: 'no id' }], { rankKey: 'k', key: 'k', facts: null })).toThrow(/no id/);
  });
});
