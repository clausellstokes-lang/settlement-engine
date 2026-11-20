/**
 * CENSUS-5e unit 3 (the chair's answer 2 to CENSUS-5d; R-AE; 2026-11-05): the two DS-FTH-1 lines
 * that speak of "the clergy" declare `clergy` (= a named senior cleric ∨ a sacred house, defined
 * once by CENSUS-1h `712ac7694`) instead of the meanwhile `priest`:
 *   DS-FTH-1 DEVOTION lukewarm v3  "the clergy preach to the same few households"
 *   DS-FTH-1 ARC rising v3         "What the clergy record is larger …"
 * Admitted where the record holds a cleric with no house, or a house with no cleric (the 36 golden
 * births 'priest' refused); refused only where both are answered false; the pool still speaks.
 * Read through the kernel's own `eligibleVariants`, with facts built on R-N's one calm double.
 */
import { describe, expect, it } from 'vitest';
import { eligibleVariants } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';

const LEAF = DOSSIER_STATE_PROSE_WAR_FAITH;

/** The texts one pool can draw under `facts`. */
function drawable(blockId, poolKey, facts) {
  const pool = LEAF[blockId].pools[poolKey];
  const meta = (LEAF[blockId].poolMeta || {})[poolKey] || {};
  const slots = Object.fromEntries(pool.flatMap((v) => v.slots || []).map((slot) => [slot, 'X']));
  const out = new Set();
  for (const walls of ['walls', 'no walls']) {
    for (const v of eligibleVariants(pool, { slots, audience: 'dm', dimensions: { walls }, facts, ...(meta.crisisScoped ? { crisisScoped: true } : {}) })) out.add(v.text);
  }
  return [...out];
}

const withFacts = (over) => ({ ...CALM_FACTS_ADMIT_ALL, ...over });
const HOUSE_ONLY = withFacts({ sacredHouse: true, faith: { seniorCleric: null } });
const CLERIC_ONLY = withFacts({ sacredHouse: false, faith: { seniorCleric: { name: 'Mother Ysolde' } } });
const NEITHER = withFacts({ sacredHouse: false, faith: { seniorCleric: null } });

const LINES = Object.freeze([
  ['DEVOTION: lukewarm', /the clergy preach to the same few households/],
  ['ARC: trend: rising', /The clergy's register counts more people/], // W4 PEOPLE second seat 2026-11-07: re-keyed to the line's text after the first seat's faith style pass (05da0e050, the owner's style law)
]);

describe('CENSUS-5e unit 3 · "the clergy" declares `clergy` (R-AE)', () => {
  for (const [poolKey, line] of LINES) {
    it(`DS-FTH-1 :: ${poolKey}: ${line.source}`, () => {
      const variant = LEAF['DS-FTH-1'].pools[poolKey].find((v) => line.test(v.text));
      expect(variant, 'the line is in the leaf').toBeTruthy();
      expect(variant.marks || []).toContain('clergy');
      expect(variant.marks || []).not.toContain('priest'); // anchored: the same marks are proven to carry 'clergy' on the line above
      for (const facts of [HOUSE_ONLY, CLERIC_ONLY]) expect(drawable('DS-FTH-1', poolKey, facts).some((t) => line.test(t))).toBe(true);
      const refused = drawable('DS-FTH-1', poolKey, NEITHER);
      expect(refused.some((t) => line.test(t)), 'refused where neither a cleric nor a house stands').toBe(false);
      expect(refused.length, 'the pool is not mute').toBeGreaterThan(1);
    });
  }
});
