/**
 * THE COMPOSE, unit 2 item 5 (the chair's ruling of 2026-11-05 10:3x; R-AD, R-AE, R-AO): the DS-FTH
 * lines that speak of "the clergy", re-read now that `clergy` (= a named senior cleric ∨ a sacred
 * house, CENSUS-1h) exists. A line that asserts the place HAS clergy at work declares `clergy`; a line
 * that describes the faith's tradition or realm-wide reach stays colour. A pool braced `{colour}`
 * cannot hold a declaring line, so its brace becomes a per-line `colour` mark on its other lines.
 * Read through the kernel's own `eligibleVariants`, on R-N's one calm double.
 *
 * @enforced-by npx vitest run tests/domain/facts/composeClergyLines.test.js
 */
import { describe, expect, it } from 'vitest';
import { eligibleVariants } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH as LEAF } from '../../../src/data/dossierStateProse/warFaith.generated.js';
import { CALM_FACTS_ADMIT_ALL } from '../../helpers/calmFactsDouble.js';

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
const NEITHER = withFacts({ sacredHouse: false, faith: { seniorCleric: null } });

const CLAIMS = Object.freeze([
  ['DS-FTH-1', 'PATRON: rankAxis: major', /Its clergy speak with the confidence/],
  ['DS-FTH-1', 'STANDINGS: a plural field, no majority', /the clergy of each describe/],
  ['DS-FTH-1', 'MANDATE: contested, or patron security below the floor', /more than the clergy do/],
  ['DS-FTH-1', 'MANDATE: a dominant church', /the patron's clergy have already asked/],
  ['DS-FTH-3', 'TEMPLE WEALTH: drawn down', /the clergy have started asking/],
]);
const COLOUR = Object.freeze([
  ['DS-FTH-3', 'PANTHEON RANK: Cult', /Its clergy travel little/],
  ['DS-FTH-3', 'PANTHEON RANK: Major', /its clergy speak to rulers/],
  // W4 PEOPLE second seat 2026-11-07: re-keyed to the line's text after the first seat's faith style pass (05da0e050, the owner's style law): the line no longer names the clergy, so it is colour (the PATRON minor row moved here from
  // CLAIMS for the same reason; its `clergy` mark became `colour` in the annex, since the line now claims no clergy).
  ['DS-FTH-3', 'PANTHEON RANK: Major', /in great houses and small/],
  ['DS-FTH-1', 'PATRON: rankAxis: minor', /travellers from far off will not have heard of/],
]);

describe('the compose · "the clergy" re-read by R-AD', () => {
  for (const [blockId, poolKey, line] of CLAIMS) {
    it(`${blockId} :: ${poolKey}: a claim declares \`clergy\` (${line.source})`, () => {
      const variant = LEAF[blockId].pools[poolKey].find((v) => line.test(v.text));
      expect(variant, 'the line is in the leaf').toBeTruthy();
      expect(variant.marks || []).toContain('clergy');
      expect(((LEAF[blockId].poolMeta || {})[poolKey] || {}).colour, 'the pool brace is gone').not.toBe(true);
      expect(drawable(blockId, poolKey, HOUSE_ONLY).some((t) => line.test(t))).toBe(true);
      const refused = drawable(blockId, poolKey, NEITHER);
      expect(refused.some((t) => line.test(t)), 'refused where neither a cleric nor a house stands').toBe(false);
      expect(refused.length, 'the pool is not mute').toBeGreaterThan(1);
      for (const v of LEAF[blockId].pools[poolKey]) if (v !== variant && !(v.marks || []).some((m) => m !== 'colour' && m !== 'dm-only')) expect(v.marks || [], `read and marked: ${v.text.slice(0, 40)}`).toContain('colour');
    });
  }
  for (const [blockId, poolKey, line] of COLOUR) {
    it(`${blockId} :: ${poolKey}: the faith's reach stays colour (${line.source})`, () => {
      const variant = LEAF[blockId].pools[poolKey].find((v) => line.test(v.text));
      expect(variant).toBeTruthy();
      expect(variant.marks || []).not.toContain('clergy'); // anchored: the variant is proven present above and proven drawable with neither atom on the line below
      expect(drawable(blockId, poolKey, NEITHER).some((t) => line.test(t))).toBe(true);
    });
  }
});
