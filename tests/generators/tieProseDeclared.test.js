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
    // TAIL-TIES-2 (the chair's ruling (T6), re-keyed by identity with its cause): 30 + the nine vote lines (`ruling body`)
    // and the two passed-threat lines of wary_alliance (`crisis: threat`, `crisis: wartime`) = 41
    // BAR3-CLOSE-DOORS-1 (2026-11-15, the close of the round BAR3, the chair's ruling TP1, re-keyed by identity with its cause):
    // 41 + the three tie lines BAR3-PEOPLE batch 1 (aef83b4b5, P1: no road, import or coach under a siege) gave
    // `excludes: ['crisis: under_siege']` (econ_crim_blur.desc#3, desc#6, tension#2) = 44
    // BAR4-CLOSE-DOORS-1 (2026-11-16, the close of the round BAR4, the chair's ruling TI1, re-keyed by identity with its cause):
    // 44 + the two tie lines BAR4-PEOPLE batch 1 (46b693c2c, P1 at the draw) made declare: mentor_legacy.desc#7
    // `needs: ['shared place']` and bitter_history.desc#3 `needs: ['lone tie']` = 46
    // BAR4-CLOSE-DOORS-1 (2026-11-16, after THE ONE MERGE of 600b7683a, the chair's ruling PD1/PD1b, re-keyed by identity with its cause):
    // 46 - mentor_legacy.desc#7, which BAR4-CLOSE-SWEEP L4 (4ed8a41e9) made a closure gated by its own twin (no `needs` again) = 45
    // CLOSE-DOORS-1A (2026-11-18, the close of 2026-11-18, re-keyed by identity with its cause): 45 + the three tie lines
    // BAR6-PEOPLE (343b41c74, LAW 5 widened B4; JOIN-17 point 8) declared and wrote into the ledger (econ_crim_exploitation.tension#6,
    // mil_crim_suppression.tension#3, bitter_history.tension#3) + the two BAR5-THINGS (c74829e25, LAW 4; JOIN-16 point 9) made
    // declare, re-taken here: econ_mil_contract.desc#6 `excludes: ['crisis: under_siege']`, family_complication.tension#7
    // `crisis: ['any']` (each no longer a colour line) = 50
    expect(ROWS.filter(declares)).toHaveLength(50);
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
