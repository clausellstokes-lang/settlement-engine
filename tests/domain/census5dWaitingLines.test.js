/**
 * CENSUS-5d (2026-11-05), unit 3 — the waiting faith lines, now that their atoms are homed.
 *
 * `sacredHouse` (R-AE, CENSUS-1f `fc45cc1`: temple ∨ monastery as the roster names them):
 *   DS-FTH-3 STANDING cult v2      "Its shrine is real"                          `sacredHouse`
 *   DS-FTH-3 NICHE slots open v1   "Shrines stand unclaimed"                     `sacredHouse`
 *   DS-FTH-1 CULTS v1              "smaller observances keep their own shrines"  `sacredHouse`
 * `priest` (a senior cleric among the named people; CENSUS-1c's `faith` getter). "The clergy" is
 * satisfied by a named senior cleric OR a sacred house (the golden corpus: 60 births hold the
 * cleric without a house, 36 the house without a cleric) — a disjunction no line may declare
 * (R-U); each line declares the likelier sufficient fact, and `clergy` = priest ∨ sacredHouse is
 * listed as a wave-2 composite candidate (two lines want it):
 *   DS-FTH-1 DEVOTION lukewarm v3  "the clergy preach to the same few households" `priest`
 *   DS-FTH-1 ARC rising v3         "What the clergy record is larger …"           `priest`
 * `institution: tavern` (fact 11; the roster's tavern / inn / ale house):
 *   DS-FTH-3 PILGRIM SEASON thin v1 "the town's inns are honest about the difference" `institution: tavern`
 * Reworded (R-U: "several" cults has no home — the key guarantees one; a "quarter" presumes a size):
 *   DS-FTH-1 CULTS v3 "Several lesser rites run alongside the patron's, each with its own days and its own quarter of the town."
 *     → "What else is kept here runs alongside the patron's rite, with its own days and its own corner of {settlement}."
 *
 * Read through the kernel's own `eligibleVariants`, with facts built on R-N's one calm double.
 */
import { describe, expect, it } from 'vitest';
import { eligibleVariants } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';
import { variantByVid } from '../helpers/drawnProse.js';

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
const noTavern = withFacts({ hasInstitution: (/** @type {string} */ k) => k !== 'tavern' });

const WAITING = Object.freeze([
  ['DS-FTH-3', 'STANDING: cult', /Its shrine is real/, 'sacredHouse', withFacts({ sacredHouse: false })],
  ['DS-FTH-3', 'NICHE: slots open', /Shrines stand unclaimed/, 'sacredHouse', withFacts({ sacredHouse: false })],
  ['DS-FTH-1', 'CULTS: cults[] present beneath the patron', /keep their own shrines/, 'sacredHouse', withFacts({ sacredHouse: false })],
  // CENSUS-5e unit 3 (re-keyed by that cause, R-AE): the two "clergy" lines declare `clergy` (priest ∨
  // sacredHouse, CENSUS-1h `712ac7694`), so they are refused only where neither a cleric nor a house stands.
  ['DS-FTH-1', 'DEVOTION: lukewarm', /the clergy preach to the same few households/, 'clergy', withFacts({ faith: { seniorCleric: null }, sacredHouse: false })],
  ['DS-FTH-1', 'ARC: trend: rising', /What the clergy record/, 'clergy', withFacts({ faith: { seniorCleric: null }, sacredHouse: false })],
  ['DS-FTH-3', 'PILGRIM SEASON: thin', /the town's inns are honest/, 'institution: tavern', noTavern],
]);

describe('CENSUS-5d unit 3 · the waiting faith lines declare as their atoms land', () => {
  for (const [blockId, poolKey, line, mark, refuse] of WAITING) {
    it(`${blockId} :: ${poolKey}: ${line.source} declares \`${mark}\`; refused where the record contradicts it, and the pool still speaks`, () => {
      const variant = LEAF[blockId].pools[poolKey].find((v) => line.test(v.text));
      expect(variant, 'the line is in the leaf').toBeTruthy();
      expect(variant.marks || []).toContain(mark);
      expect(drawable(blockId, poolKey, CALM_FACTS_ADMIT_ALL).some((t) => line.test(t)), 'admitted where the record holds it').toBe(true);
      const refused = drawable(blockId, poolKey, refuse);
      expect(refused.some((t) => line.test(t)), 'refused where the record contradicts it').toBe(false);
      expect(refused.length, 'the pool is not mute').toBeGreaterThan(1);
    });
  }

  it('CULTS v3 presumes no cult count and no quarter (R-U)', () => {
    const texts = LEAF['DS-FTH-1'].pools['CULTS: cults[] present beneath the patron'].map((v) => v.text);
    expect(texts.some((t) => /Several lesser rites|quarter of the town/.test(t))).toBe(false);
    // v3 is the reworded line (R-U), computed by its vid rather than quoted (proseDrawnAnchors).
    const v3 = variantByVid({ leaf: 'warFaith', blockId: 'DS-FTH-1', poolKey: 'CULTS: cults[] present beneath the patron', vid: 3, slots: { settlement: 'X' } });
    expect(v3.length).toBeGreaterThan(20);
    expect(v3).not.toMatch(/Several lesser rites|quarter of the town/);
  });
});
