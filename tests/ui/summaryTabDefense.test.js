/**
 * @vitest-environment jsdom
 *
 * Regression guard for the defense average (review finding R3/R4).
 *
 * Originally this pinned the SummaryTab Defense situation tile's rendered "Avg.
 * score X/100" to the canonical `deriveDefensePosture(settlement).scoreAvg`,
 * catching the bug where the tile used a hard-coded 5-key mean
 * `(military+monster+internal+economic+magical)/5` that EXCLUDED the `disaster`
 * score the engine adds on essentially every modern settlement (the PDF / canon
 * average ALL numeric score keys).
 *
 * The legacy single-column SummaryTab — the only surface that rendered that tile
 * — was deleted in the dossier-keystone pass (the magazine SummaryTabV2 is the
 * one Summary now and carries no defense tile). The guarantee the test protects
 * is the canonical helper's correctness, so the assertion is repointed onto
 * `deriveDefensePosture` directly: that all numeric score keys (incl. `disaster`)
 * are averaged, never the legacy 5. SummaryTabV2 + the Defense tab consume this
 * same helper, so the screen can never diverge from canon.
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveDefensePosture } from '../../src/domain/display/dossierViewModel.js';

const SEED = 'summary-defense-parity-2026-06';

let village;
let metropolis;

beforeAll(() => {
  village = generateSettlementPipeline(
    { settType: 'village', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
    null,
    { seed: SEED, customContent: {} },
  );
  metropolis = generateSettlementPipeline(
    { settType: 'metropolis', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' },
    null,
    { seed: `${SEED}-metro`, customContent: {} },
  );
});

describe('Defense average — canonical scoreAvg correctness', () => {
  for (const [label, getS] of [['village', () => village], ['metropolis', () => metropolis]]) {
    test(`deriveDefensePosture returns a finite canonical scoreAvg (${label})`, () => {
      const s = getS();
      const canon = deriveDefensePosture(s).scoreAvg;
      expect(typeof canon).toBe('number'); // generated fixtures always have scores
      expect(Number.isFinite(canon)).toBe(true);
    });
  }

  test('the canonical average covers ALL numeric score keys, not the legacy 5', () => {
    // The bug was a 5-key mean. A modern settlement carries a numeric `disaster`
    // key too, so the canonical (all-numeric) mean must be computed over >5
    // values — proving the old 5-key formula was structurally wrong.
    const scores = metropolis.defenseProfile?.scores || {};
    const numeric = Object.values(scores).filter((v) => typeof v === 'number');
    expect(numeric.length).toBeGreaterThan(5);
    expect(scores.disaster).toEqual(expect.any(Number));
    const allKeyMean = Math.round(numeric.reduce((a, b) => a + b, 0) / numeric.length);
    expect(deriveDefensePosture(metropolis).scoreAvg).toBe(allKeyMean);
  });
});
