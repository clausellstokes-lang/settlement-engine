/**
 * illustratedLensFree.test.js — THE ILLUSTRATED TOWN (IT-6, THE FACE): the free-face invariant.
 *
 * The owner ruling (recorded, vetoable): the `illustrated` lens is FREE — "it becomes the product's
 * face; gating the face starves the funnel + gallery." That ruling is enforced STRUCTURALLY, not by
 * a runtime tier check: the illustrated lens is a SIXTH pickable lens (TOWN_MAP_LENS_IDS) held
 * DELIBERATELY OUT of the paid TOWN_MAP_STYLE_IDS set, from which the pricing table's paid "all N
 * lenses" count (LENS_COUNT) is derived. So the free face is served by the same ungated picker as
 * the paid five, over-and-above the advertised count (an over-delivery, by design).
 *
 * This pin connects the two modules the invariant SPANS — the entitlement ladder (the paid claim)
 * and the lens registry (the free face) — so a refactor that either folds illustrated into the paid
 * set OR bumps LENS_COUNT to include it (silently turning the free face into a paid pitch) reds
 * here. A paid-surface decision is owner-gated; this locks it. (The registry-only relationship is
 * separately pinned in tests/domain/townMapIllustratedLens.test.js; this is the cross-module tie.)
 */
import { describe, expect, it } from 'vitest';

import { LENS_COUNT, ENTITLEMENT_LADDER } from '../../src/config/entitlementLadder.js';
import { TOWN_MAP_STYLE_IDS, TOWN_MAP_LENS_IDS, ILLUSTRATED_STYLE_ID } from '../../src/design/townMapStyles.js';

/** Find a ladder row by id across the grouped capability areas. */
function ladderRow(id) {
  for (const group of ENTITLEMENT_LADDER) {
    const row = group.rows.find((r) => r.id === id);
    if (row) return row;
  }
  return null;
}

describe('the illustrated lens is FREE — the paid lens count excludes the product face', () => {
  it('LENS_COUNT is the five re-skins exactly, and the illustrated face is not among them', () => {
    expect(LENS_COUNT).toBe(TOWN_MAP_STYLE_IDS.length);
    expect(LENS_COUNT).toBe(5);
    expect([...TOWN_MAP_STYLE_IDS]).not.toContain(ILLUSTRATED_STYLE_ID);
  });

  it('the illustrated face is a pickable lens shipped OVER the paid count (exactly one free bonus)', () => {
    expect([...TOWN_MAP_LENS_IDS]).toContain(ILLUSTRATED_STYLE_ID);
    // the pickable set is the paid five plus the one free face — no more, no less.
    expect(TOWN_MAP_LENS_IDS.length).toBe(LENS_COUNT + 1);
  });

  it('the map-viewing rows through which the free face reaches every viewer are all FREE', () => {
    for (const id of ['map-view', 'all-lenses', 'panorama', 'provenance-hover']) {
      const row = ladderRow(id);
      expect(row, `entitlement row ${id} missing`).toBeTruthy();
      expect(row.free, `entitlement row ${id} must be free`).toBeTruthy();
    }
  });
});
