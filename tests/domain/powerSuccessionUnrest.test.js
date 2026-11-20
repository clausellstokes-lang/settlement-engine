/**
 * CENSUS-5 (2026-11-05), unit 2: DS-POW-4's settled-succession lines under an uprising — the
 * chair's ruling R-F 1. Rung 2D unit 2 (`1d79e31`) denied the seat-safety line (v3) under the
 * unrest family; the draw that replaced it was v1/v2 ("…the succession question is not a live one
 * here" / "…does not come up…"), which a DM stops at under a slave revolt at legitimacy 19
 * (`soak1k-1`) or an insurgency at legitimacy 8 (`soak1k-3001`). v1/v2 now declare `no crisis:
 * unrest` beside F12's `succession settled`, and the pool gains ONE unrest-safe line (v6, the
 * chair's ruling, `docs/CENSUS_5_LANE_2026-11-04.md`), so a settled seat under an uprising is
 * never mute and never calm.
 */
import { describe, expect, it } from 'vitest';
import { eligibleVariants } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { crisisDimensionsOf } from '../../src/domain/crisis/crisisFacts.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';

const POOL = 'riskLabel: Stable (no challengers)';

/** @param {string[]} types */
function drawable(types) {
  const block = DOSSIER_STATE_PROSE_POWER['DS-POW-4'];
  const pool = block.pools[POOL];
  const place = { stress: types.map((type) => ({ type })) };
  const slots = Object.fromEntries(pool.flatMap((v) => v.slots || []).map((slot) => [slot, 'X']));
  return eligibleVariants(pool, { slots, audience: 'dm', dimensions: { walls: 'no walls', ...crisisDimensionsOf(place) }, facts: factsOf(place) })
    .map((v) => v.vid);
}

describe('CENSUS-5 · DS-POW-4 under an uprising', () => {
  it('in calm the settled lines draw and the unrest-safe line does not', () => {
    const vids = drawable([]);
    expect(vids).toEqual(expect.arrayContaining([1, 2, 3]));
    // anchored: the line above asserts v1–v3 ARE drawable from this same read; the unrest arms below assert v6 draws
    expect(vids).not.toContain(6);
  });

  for (const type of ['insurgency', 'slave_revolt', 'wartime']) {
    it(`under ${type} (succession settled) only the unrest-safe line draws`, () => {
      expect(drawable([type])).toEqual([6]);
    });
  }

  it('under an open succession the unrest-safe line stays out (the open-seat lines serve)', () => {
    expect(drawable(['succession_void', 'insurgency'])).toEqual([4, 5]);
  });
});
