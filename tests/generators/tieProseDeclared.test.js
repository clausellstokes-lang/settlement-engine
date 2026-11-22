/**
 * tests/generators/tieProseDeclared.test.js — CENSUS-4c unit 4 (the ties): the tie prose of
 * `npcData.js :: STRESS_ECONOMIC_EFFECTS` carries the phase-A ledger's 30 declarations IN PLACE
 * (`{ line: closure, needs?, excludes? }`), its consumer (`pairProse`) accepts both shapes
 * byte-identically (R-C), and each archetype field hands its variants read-only, in index order,
 * on `lines` for the tie draw's resolution (Appendix B site 19, CENSUS-1d's to wire).
 *
 * @enforced-by npx vitest run tests/generators/tieProseDeclared.test.js
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { STRESS_ECONOMIC_EFFECTS } from '../../src/data/npcData.js';
import * as V from '../../src/domain/facts/factVocabulary.js';

const LEDGER = JSON.parse(readFileSync(new URL('../../docs/census/declarations/npcData.STRESS_ECONOMIC_EFFECTS.json', import.meta.url), 'utf8'));
const ROWS = LEDGER.rows.filter((/** @type {any} */ r) => /#\d+$/.test(r.id));
const declares = (/** @type {any} */ r) => r.needs.length > 0 || r.excludes.length > 0 || r.crisis.length > 0;
const at = (/** @type {string} */ id) => {
  const m = /^(\w+)\.(desc|tension)#(\d+)$/.exec(id);
  if (!m) throw new Error(id);
  return { field: /** @type {any} */ (STRESS_ECONOMIC_EFFECTS)[m[1]][m[2]], index: Number(m[3]) };
};

describe('the tie prose declares in place (CENSUS-4c unit 4)', () => {
  it('every field exposes its variants on `lines`, one per index', () => {
    for (const archetype of Object.values(STRESS_ECONOMIC_EFFECTS)) {
      for (const f of ['desc', 'tension']) {
        const field = /** @type {any} */ (archetype)[f];
        expect(Array.isArray(field.lines)).toBe(true);
        expect(field.lines).toHaveLength(field.size);
        expect(Object.isFrozen(field.lines)).toBe(true);
      }
    }
  });
  it('the ledger\'s 30 declaring rows carry exactly the ledger\'s declaration; every other row declares nothing', () => {
    expect(ROWS.filter(declares)).toHaveLength(30);
    for (const r of ROWS) {
      const { field, index } = at(r.id);
      const d = V.declarationOf(field.lines[index]);
      expect({ id: r.id, needs: [...d.needs], excludes: [...d.excludes], crisis: [...d.crisis] })
        .toEqual({ id: r.id, needs: r.needs, excludes: r.excludes, crisis: r.crisis });
      for (const atom of [...r.needs, ...r.excludes]) expect(V.assertDeclarable(atom)).toBeTruthy();
    }
  });
  it('the rendered text of every row is the ledger\'s, byte for byte (the closure is the same)', () => {
    for (const r of ROWS) {
      const { field, index } = at(r.id);
      expect(field({ name: '{A}' }, { name: '{B}' }, index)).toBe(r.text);
    }
  });
});
