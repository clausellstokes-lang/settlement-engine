/**
 * townMapOpBudget.test.js — THE ILLUSTRATED TOWN (IT-1): the op-count ceiling.
 *
 * The glyph layer multiplies each building's op count (a rect became a multi-stroke
 * oblique glyph + a shadow group). The LOD rule caps the blow-up — fill mass renders as
 * simplified massing rows, not full glyphs — but a self-scoring guard is what catches the
 * explosion CLASS. This pins the illustrated draw list's total op count under a generous
 * ceiling across the LARGEST golden seeds (the metropolis configs), so a future glyph or
 * density change that would balloon a big map's op count reds here (design §1 perf guard).
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapDrawList } from '../../src/domain/townMap/townMapDraw.js';
import { groundDressOps } from '../../src/domain/townMap/groundDress.js';
import { GOLDEN_CONFIGS, V2_GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

// The class-catching ceiling. Empirically the largest golden metropolis lands FAR under
// this (glyph layer + ground dress: ~360 ops on the richest v2 metropolis); the guard
// exists to catch an explosion, not to be tight.
const OP_CEILING = 2200;

// THE GROUND-DRESS CAP (IT-2). Dress is FRAME-level (farm belt / woods / ripples / meadow /
// hedges / wall shadows / relief) — NOT per-building — so the per-building bound below
// can't see it. Empirically the densest golden seed emits ≤ 88 dress ops; this cap (with
// ~2× headroom) reds if a future density/mark-count change balloons the frame texture,
// the exact frame-level explosion the per-building allowance would otherwise mask.
const DRESS_CAP = 160;

/** Every golden config's illustrated draw-op count, with a legible label. */
function illustratedCounts() {
  const rows = [];
  for (const { spec, settlement } of GOLDEN_CONFIGS) {
    const model = buildTownMapModel(settlement);
    rows.push({ label: `v1 ${spec.tier}/${spec.terrain}`, ops: buildTownMapDrawList(model, 'illustrated').length });
  }
  for (const { spec, settlement, mapEdits } of V2_GOLDEN_CONFIGS) {
    const model = buildTownMapModel(settlement, mapEdits);
    rows.push({ label: `v2 ${spec.tier}/${spec.terrain}`, ops: buildTownMapDrawList(model, 'illustrated').length });
  }
  return rows;
}

describe('town-map OP BUDGET — the illustrated lens does not explode', () => {
  it('every golden seed stays under the op ceiling under the illustrated lens', () => {
    const rows = illustratedCounts();
    const worst = rows.reduce((a, b) => (b.ops > a.ops ? b : a));
    expect(
      worst.ops,
      `${worst.label} emitted ${worst.ops} illustrated ops (> ${OP_CEILING}) — a glyph/density change ballooned the op count; re-tune the LOD before raising the ceiling`,
    ).toBeLessThanOrEqual(OP_CEILING);
    // anti-vacuity: the illustrated lens actually draws glyph populations (not empty)
    expect(worst.ops).toBeGreaterThan(50);
  });

  it('the illustrated lens adds a BOUNDED multiple over the parchment op count (no runaway)', () => {
    // The largest v2 config: glyphs + shadows are a bounded expansion of the rect list,
    // PLUS the frame-level ground dress (bounded separately by DRESS_CAP).
    const big = V2_GOLDEN_CONFIGS.reduce((a, b) => {
      const na = buildTownMapModel(a.settlement, a.mapEdits).buildings.length;
      const nb = buildTownMapModel(b.settlement, b.mapEdits).buildings.length;
      return nb > na ? b : a;
    });
    const model = buildTownMapModel(big.settlement, big.mapEdits);
    const parch = buildTownMapDrawList(model, 'parchment').length;
    const illus = buildTownMapDrawList(model, 'illustrated').length;
    expect(illus).toBeGreaterThan(parch);        // glyphs add detail
    // ≤ ~14 ops/building glyph expansion + the frame furniture + the ground-dress budget.
    expect(illus).toBeLessThan(parch + model.buildings.length * 14 + 40 + DRESS_CAP);
  });

  it('the ground dress is a BOUNDED frame texture on every seed (≤ DRESS_CAP, > 0)', () => {
    // Every golden seed gets dressed (the v1 COVERAGE LAW) and none explodes the frame.
    const dress = [];
    for (const { spec, settlement } of GOLDEN_CONFIGS) dress.push({ label: `v1 ${spec.tier}/${spec.terrain}`, ops: groundDressOps(buildTownMapModel(settlement), 'illustrated').length });
    for (const { spec, settlement, mapEdits } of V2_GOLDEN_CONFIGS) dress.push({ label: `v2 ${spec.tier}/${spec.terrain}`, ops: groundDressOps(buildTownMapModel(settlement, mapEdits), 'illustrated').length });
    const worst = dress.reduce((a, b) => (b.ops > a.ops ? b : a));
    expect(worst.ops, `${worst.label} emitted ${worst.ops} dress ops (> ${DRESS_CAP})`).toBeLessThanOrEqual(DRESS_CAP);
    const sparsest = dress.reduce((a, b) => (b.ops < a.ops ? b : a));
    expect(sparsest.ops, `${sparsest.label} got no ground dress (v1 coverage law)`).toBeGreaterThan(0);
  });
});
