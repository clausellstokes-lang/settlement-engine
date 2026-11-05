/**
 * CENSUS-5 (2026-11-05), unit 1: the DS-DEF perimeter calm claims declare the crisis families
 * they deny, through the census channel (`no crisis: threat, unrest` in the annex tag slot;
 * `docs/DESIGN_POOL_CENSUS.md` §3.2) — the chair's ruling R-F 3: "the arrival and perimeter calm
 * claims … declare `excludes: crisis: threat, unrest` — the LINE widens, never the family".
 *
 * Rung 2D read the class on the page: `soak1k-4803` (under siege) printed "A stranger reaches the
 * centre … without being stopped, challenged or counted by anybody at all"; `soak1k-3005` (an
 * insurgency) printed "…chiefly for how relaxed the people on it are", which F12's `no threat`
 * mark could not reach because an insurgency is unrest, not threat. The pools are read through the
 * kernel's own `eligibleVariants`, with the facts and the pool's brace group the composer hands it
 * (`composeStateProse.js :: poolReadOf`).
 */
import { describe, expect, it } from 'vitest';
import { eligibleVariants } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { crisisDimensionsOf } from '../../src/domain/crisis/crisisFacts.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';

/** @param {string} type */
const placeUnder = (type) => (type ? { stress: [{ type }] } : { stress: [] });

/** The vids one pool can draw for a place, walls answered both ways in turn. */
function drawable(blockId, poolKey, type, walls) {
  const block = DOSSIER_STATE_PROSE_DEFENSE[blockId];
  const pool = block.pools[poolKey];
  const meta = (block.poolMeta || {})[poolKey] || {};
  const slots = Object.fromEntries(pool.flatMap((v) => v.slots || []).map((slot) => [slot, 'X']));
  const place = placeUnder(type);
  return eligibleVariants(pool, {
    slots, audience: 'dm', dimensions: { walls, ...crisisDimensionsOf(place) }, facts: factsOf(place),
    ...(meta.crisisScoped ? { crisisScoped: true } : {}),
  }).map((v) => v.vid);
}

/** The perimeter calm claims: [block, pool, vid, the walls answer under which the line is otherwise lawful]. */
const PERIMETER_CALM = Object.freeze([
  ['DS-DEF-1', 'readiness CRITICAL', 3, 'no walls'],
  ['DS-DEF-1', 'readiness WEAK', 2, 'walls'],
  ['DS-DEF-2', 'Beasts & Monsters: settled, defenses beyond the need', 3, 'walls'],
  ['DS-DEF-6', 'Naval Defense: Port only', 3, 'no walls'],
]);

describe('CENSUS-5 · the DS-DEF perimeter calm claims', () => {
  for (const [blockId, poolKey, vid, walls] of PERIMETER_CALM) {
    it(`${blockId} :: ${poolKey} :: v${vid} is drawable in calm and refused under threat and unrest, and the pool stays readable`, () => {
      expect(drawable(blockId, poolKey, null, walls)).toContain(vid);
      for (const type of ['under_siege', 'occupied', 'monster_pressure', 'insurgency', 'slave_revolt', 'wartime']) {
        const vids = drawable(blockId, poolKey, type, walls);
        // anchored: the calm arm above asserts the same vid IS drawable, and the length below that the pool is not empty
        expect(vids, `${type}`).not.toContain(vid);
        expect(vids.length, `${type}: the pool went mute`).toBeGreaterThan(0);
      }
    });
  }

  it('the four pools opt into the crisis dimension (silence there reads as calm)', () => {
    for (const [blockId, poolKey] of PERIMETER_CALM) {
      expect(DOSSIER_STATE_PROSE_DEFENSE[blockId].poolMeta[poolKey], `${blockId} :: ${poolKey}`).toMatchObject({ crisisScoped: true });
    }
  });
});
