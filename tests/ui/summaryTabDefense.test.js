/**
 * @vitest-environment jsdom
 *
 * Regression guard for the SummaryTab defense average (review finding R3/R4).
 *
 * The Defense situation tile used to compute a hard-coded 5-key mean
 * `(military+monster+internal+economic+magical)/5` that EXCLUDED the
 * `disaster` score the engine adds on essentially every modern settlement.
 * The PDF / canon average ALL numeric score keys, so the on-screen "Avg.
 * score X/100" provably diverged from the PDF on nearly every settlement,
 * and rendered NaN when a key was absent. The fix routes the tile through
 * the canonical `deriveDefensePosture(settlement).scoreAvg`.
 *
 * This pins the SCREEN to the canonical helper — the arm the existing
 * viewModelParity pin could not see, because it only compared the PDF view
 * model to canon, never the rendered tab.
 *
 * createElement (not JSX) to match tabs.smoke.test.js — the test-side
 * transform doesn't apply the JSX transform to test files.
 */

import React from 'react';
import { describe, test, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveDefensePosture } from '../../src/domain/display/dossierViewModel.js';
import SummaryTab from '../../src/components/new/SummaryTab.jsx';

const e = React.createElement;
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

afterEach(() => { cleanup(); });

/** Pull the integer N out of the rendered "Avg. score N/100" tile sub-label. */
function renderedDefenseAvg(settlement) {
  const { container } = render(e(SummaryTab, { settlement }));
  const m = container.textContent.match(/Avg\. score (\d+)\/100/);
  return m ? Number(m[1]) : null;
}

describe('SummaryTab defense average — screen↔canon parity', () => {
  for (const [label, getS] of [['village', () => village], ['metropolis', () => metropolis]]) {
    test(`the Defense tile renders the canonical scoreAvg (${label})`, () => {
      const s = getS();
      const canon = deriveDefensePosture(s).scoreAvg;
      expect(typeof canon).toBe('number'); // generated fixtures always have scores
      expect(renderedDefenseAvg(s)).toBe(canon);
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
