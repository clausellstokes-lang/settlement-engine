/**
 * CENSUS-5b (2026-11-05), unit 3 — the pools that would go mute under their own crisis (R-L): the
 * claim lines declare the crisis kinds that contradict them, and each pool gains ONE crisis-safe
 * line (the chair's ruling, R-G / R-L: "a twin by default"), declared `crisis: <kinds>` (R-I: one
 * of those kinds must be active), so the twin is eligible only where every original is refused and
 * moves no birth anywhere else.
 *
 *   DS-DEF-1 strategic value LOW   "not worth an army's season" ×3      under_siege, occupied
 *   DS-WAR-1 warExhaustion rested  "carries no scar from fighting" ×3   under_siege, occupied (v3 also wartime)
 *   DS-FTH-3 every niche uncontested  v1 (v2, v3 by CENSUS-5)           religious_conversion
 *   DS-FTH-3 LEGITIMACY secure ×3  "the patron's claim is not questioned" religious_conversion
 *
 * Read through the kernel's own `eligibleVariants`, with the facts and the pool meta the composer
 * hands it (as `defensePerimeterCalm.test.js`).
 */
import { describe, expect, it } from 'vitest';
import { eligibleVariants } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { crisisDimensionsOf } from '../../src/domain/crisis/crisisFacts.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';

const LEAF = { ...DOSSIER_STATE_PROSE_DEFENSE, ...DOSSIER_STATE_PROSE_WAR_FAITH };

/** The variants one pool can draw for a place under `types`, walls answered both ways. */
function drawable(blockId, poolKey, types) {
  const block = LEAF[blockId];
  const pool = block.pools[poolKey];
  const meta = (block.poolMeta || {})[poolKey] || {};
  const slots = Object.fromEntries(pool.flatMap((v) => v.slots || []).map((slot) => [slot, 'X']));
  const place = { stress: types.map((type) => ({ type })) };
  const real = factsOf(place);
  const facts = { ...CALM_FACTS_ADMIT_ALL, crisis: real.crisis, famine: real.famine };
  const out = new Set();
  for (const walls of ['walls', 'no walls']) {
    for (const v of eligibleVariants(pool, { slots, audience: 'dm', dimensions: { walls, ...crisisDimensionsOf(place) }, facts, ...(meta.crisisScoped ? { crisisScoped: true } : {}) })) out.add(v);
  }
  return [...out];
}

/** [block, pool, the claim's pattern, the crisis kinds that contradict it, the twin's pattern]. */
const MUTE = Object.freeze([
  ['DS-DEF-1', 'strategic value LOW', /not worth|not a prize|not worth taking/, ['under_siege', 'occupied'], /somebody has come for it anyway/],
  ['DS-WAR-1', 'warExhaustion: rested', /no scar|has its people|full strength in the field/, ['under_siege', 'occupied'], /came to this fighting rested/],
  ['DS-FTH-3', 'NICHE: every niche uncontested', /own ground|do not overlap|orderly/, ['religious_conversion'], /not a quarrel between them/],
  ['DS-FTH-3', 'LEGITIMACY: secure', /not questioned|not this creed's problem|claim is secure/, ['religious_conversion'], /settled long before the conversion/],
]);

describe('CENSUS-5b unit 3 · the pools that went mute under their own crisis', () => {
  for (const [blockId, poolKey, claim, kinds, twin] of MUTE) {
    it(`${blockId} :: ${poolKey}: the claims are refused under ${kinds.join(', ')}, and one crisis-safe line speaks instead`, () => {
      const calm = drawable(blockId, poolKey, []);
      expect(calm.some((v) => claim.test(v.text)), 'the claims speak in calm').toBe(true);
      expect(calm.some((v) => twin.test(v.text)), 'the twin is silent in calm').toBe(false);
      for (const kind of kinds) {
        const under = drawable(blockId, poolKey, [kind]);
        expect(under.filter((v) => claim.test(v.text)).map((v) => v.text), kind).toEqual([]);
        expect(under.map((v) => v.text).filter((t) => twin.test(t)), `${kind}: the slot is filled by the twin alone`).toHaveLength(1);
        expect(under, `${kind}: only the twin`).toHaveLength(1);
      }
      // a crisis that does not contradict the claim leaves the pool as it was in calm
      const other = drawable(blockId, poolKey, ['indebted']);
      expect(other.map((v) => v.vid).sort()).toEqual(calm.map((v) => v.vid).sort());
    });
  }

  it('DS-WAR-1 rested v3 ("could put its full strength in the field … not being asked to") is refused under wartime too', () => {
    const under = drawable('DS-WAR-1', 'warExhaustion: rested', ['wartime']);
    expect(under.some((v) => /full strength in the field/.test(v.text))).toBe(false);
    expect(under.length).toBeGreaterThan(0);
  });
});
