/**
 * tests/kernel/pickRendezvous.test.js — the rendezvous pick (point 120, D13 STABLE-PICKS).
 *
 * `pickRendezvous(lines, slotKey, idOf)` returns the line with the HIGHEST `mix32(fnv1a32(slotKey::id))`.
 * Its point is stability under a pool edit: removing a line that was not the pick leaves the pick;
 * removing the pick gives the next highest; adding a line moves the pick only if the new line hashes
 * highest; the order of the list does not matter. A tie goes to the smaller id (by string); an empty or
 * non-array list returns undefined; a falsy key returns the first line (as the old modulus pick did).
 */
import { describe, it, expect } from 'vitest';
import { fnv1a32, mix32, pickRendezvous } from '../../src/kernel/proseHash.js';

const idOf = (/** @type {{ id: string }} */ l) => l.id;
const lines = Array.from({ length: 12 }, (_, i) => ({ id: `L${i + 1}`, text: `line ${i + 1}` }));
const keys = Array.from({ length: 400 }, (_, i) => `Town${i}::dailyLife.dawn_work::plain`);
const score = (/** @type {string} */ key, /** @type {string} */ id) => mix32(fnv1a32(`${key}::${id}`));

describe('pickRendezvous — the highest hash of (slot key, line id)', () => {
  it('is the argmax of the stated hash, and the same input gives the same line', () => {
    for (const key of keys) {
      const best = [...lines].sort((a, b) => score(key, b.id) - score(key, a.id) || (a.id < b.id ? -1 : 1))[0];
      expect(pickRendezvous(lines, key, idOf)).toBe(best);
      expect(pickRendezvous(lines, key, idOf)).toBe(pickRendezvous(lines.slice(), key, idOf));
    }
  });

  it('removing a line that was not the pick leaves the pick', () => {
    for (const key of keys) {
      const pick = pickRendezvous(lines, key, idOf);
      for (const gone of lines) {
        if (gone === pick) continue;
        expect(pickRendezvous(lines.filter((l) => l !== gone), key, idOf)).toBe(pick);
      }
    }
  });

  it('removing the pick gives the next highest', () => {
    for (const key of keys) {
      const ranked = [...lines].sort((a, b) => score(key, b.id) - score(key, a.id));
      expect(pickRendezvous(lines.filter((l) => l !== ranked[0]), key, idOf)).toBe(ranked[1]);
    }
  });

  it('adding a line changes the pick only if the new line hashes highest', () => {
    const added = { id: 'L99', text: 'line 99' };
    let moved = 0;
    for (const key of keys) {
      const before = pickRendezvous(lines, key, idOf);
      const after = pickRendezvous([...lines, added], key, idOf);
      const top = score(key, added.id) > score(key, idOf(/** @type {any} */ (before)));
      expect(after).toBe(top ? added : before);
      if (after !== before) moved += 1;
    }
    // about 1 in n+1 keys move to the new line (n = 12): neither none nor most
    expect(moved).toBeGreaterThan(0);
    expect(moved).toBeLessThan(keys.length / 4);
  });

  it('the order of the list does not matter', () => {
    const reversed = [...lines].reverse();
    const rotated = [...lines.slice(5), ...lines.slice(0, 5)];
    for (const key of keys) {
      const pick = pickRendezvous(lines, key, idOf);
      expect(pickRendezvous(reversed, key, idOf)).toBe(pick);
      expect(pickRendezvous(rotated, key, idOf)).toBe(pick);
    }
  });

  it('a tie goes to the smaller id by string, in either order', () => {
    // a true 32-bit collision under the key 'tie', found by search: both ids hash to 1221666182
    const small = { id: 'C139599', text: 'small' };
    const large = { id: 'C322382', text: 'large' };
    expect(score('tie', small.id)).toBe(score('tie', large.id));
    expect(pickRendezvous([large, small], 'tie', idOf)).toBe(small);
    expect(pickRendezvous([small, large], 'tie', idOf)).toBe(small);
  });

  it('an empty or non-array list returns undefined; a falsy key returns the first line', () => {
    expect(pickRendezvous([], 'k', idOf)).toBeUndefined();
    expect(pickRendezvous(/** @type {any} */ (null), 'k', idOf)).toBeUndefined();
    expect(pickRendezvous(/** @type {any} */ ('L1'), 'k', idOf)).toBeUndefined();
    for (const key of [null, undefined, '', 0]) expect(pickRendezvous(lines, key, idOf)).toBe(lines[0]);
    expect(pickRendezvous([lines[3]], 'any', idOf)).toBe(lines[3]);
  });

  it('is well mixed: over 400 keys no line of 12 is starved and none is drawn over three times its share', () => {
    /** @type {Map<string, number>} */
    const count = new Map();
    for (const key of keys) {
      const id = idOf(/** @type {any} */ (pickRendezvous(lines, key, idOf)));
      count.set(id, (count.get(id) ?? 0) + 1);
    }
    const share = keys.length / lines.length;
    for (const l of lines) {
      expect(count.get(l.id) ?? 0, `${l.id} drawn`).toBeGreaterThan(0);
      expect(count.get(l.id) ?? 0, `${l.id} not over 3x`).toBeLessThan(3 * share);
    }
  });
});
