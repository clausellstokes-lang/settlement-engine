/**
 * tests/domain/tonightCastWantsRanked.test.js — TONIGHT'S CAST WANTS BY THE RENDEZVOUS (point 121, TAIL-PICKS; the
 * chair's ruling 121-1, U3). Every role's wants are rows `{ id, text }` with ids written once, unique across the table;
 * the want a goal-less cast person voices is the line of the HIGHEST rendezvous rank (key `person|crisis|role`, the line's
 * id) among the lines the town leaves true (`castWantAdmits`), so a line the town makes false never moves the pick, and
 * the held-seat lines are named by id.
 *
 * @enforced-by npx vitest run tests/domain/tonightCastWantsRanked.test.js
 */
import { describe, expect, it } from 'vitest';
import { CAST_WANTS, castWantOf } from '../../src/domain/summary/tonightSheet.js';
import { rankRendezvous } from '../../src/kernel/proseHash.js';

const esc = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** @param {string} t @returns {RegExp} the line's template, its slots open */
const shape = (t) => new RegExp(`^${esc(t).replace(/\\\{\w+\\\}/g, '.+')}$`);
const PEOPLE = Array.from({ length: 120 }, (_, i) => `npc-${i}`);
const CRISES = ['famine', 'plague_onset', 'under_siege'];

describe('CAST_WANTS: rows with ids, the pick by the rendezvous over the admitted lines', () => {
  it('every role\'s line is a row { id, text }, the ids unique across the table', () => {
    const rows = Object.values(CAST_WANTS).flat();
    for (const r of rows) expect(Object.keys(r).sort()).toEqual(['id', 'text']);
    expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length);
  });

  it('every id of CAST_WANTS[role] is `<role>.<n>`, <n> a positive whole number with no leading zero (the id pins its pool: RULING 121-5 (a))', () => {
    for (const [role, pool] of Object.entries(CAST_WANTS)) {
      expect(pool.length, role).toBeGreaterThan(0);
      for (const r of pool) expect(r.id, role).toMatch(new RegExp(`^${esc(role)}\\.[1-9][0-9]*$`));
    }
  });

  it('a person with no goal voices the highest-ranked line the town leaves true, on the key person|crisis|role', () => {
    let reached = 0;
    for (const [role, pool] of Object.entries(CAST_WANTS)) {
      for (const person of PEOPLE) for (const crisis of CRISES) {
        const want = castWantOf(role, person, crisis, '', 'the Elder Council', { seatEmpty: false, forceStands: true });
        const top = rankRendezvous(pool, `${person}|${crisis}|${role}`, (l) => l.id)[0];
        expect(want, `${role} ${person} ${crisis}`).toMatch(shape(top.text));
        reached += 1;
      }
    }
    expect(reached).toBeGreaterThan(1000);
  });

  it('where the seat stands empty the held-seat lines (by id) are never voiced; the next in rank is', () => {
    const pool = CAST_WANTS.instigator;
    const held = pool.filter((l) => l.id === 'instigator.1' || l.id === 'instigator.3');
    expect(held).toHaveLength(2);
    for (const person of PEOPLE) {
      const want = castWantOf('instigator', person, 'famine', '', 'the Elder Council', { seatEmpty: true, forceStands: true });
      const top = rankRendezvous(pool.filter((l) => !held.includes(l)), `${person}|famine|instigator`, (l) => l.id)[0];
      expect(want).toMatch(shape(top.text));
    }
  });
});
