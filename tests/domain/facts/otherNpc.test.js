/**
 * tests/domain/facts/otherNpc.test.js — CENSUS-1 wave 0, fact 14: THE OTHER-NPC HOME (a new atom).
 * @enforced-by npx vitest run tests/domain/facts/otherNpc.test.js
 */
import { describe, expect, it } from 'vitest';
import { hasOtherNpc, otherNpcOf } from '../../../src/domain/facts/otherNpc.js';

describe('the other-NPC home (CENSUS-1 fact 14)', () => {
  it('the first other NPC, by index or by identity; named only when it carries a name', () => {
    const a = { name: 'Ada' }; const b = { name: 'Bo' }; const c = {};
    expect(otherNpcOf({ npcs: [a, b] }, 0)).toBe(b);
    expect(otherNpcOf({ npcs: [a, b] }, b)).toBe(a);
    expect(otherNpcOf({ npcs: [a] }, 0)).toBe(null);
    expect(hasOtherNpc({ npcs: [a, b] }, a)).toBe(true);
    expect(hasOtherNpc({ npcs: [a, c] }, 0)).toBe(false);
    expect(hasOtherNpc({}, 0)).toBe(false);
  });
});
