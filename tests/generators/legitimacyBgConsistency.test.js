/**
 * legitimacyBgConsistency.test.js — cycle-3 Wave 2, M5 pin.
 *
 * THE BUG (M5). assembleSettlement's defense-readiness legitimacy patch re-stamps
 * publicLegitimacy.score/label/color/govMultiplier/crimMultiplier/is* when the
 * defense contribution crosses a band — but it NEVER re-stamped `bg`. So a
 * band-crossing settlement rendered a legitimacy chip whose background belonged to
 * the PROVISIONAL band while its colour/label named the new one — a self-
 * contradicting chip.
 *
 * THE FIX. The patch now re-stamps `bg` per band from the same map
 * computePublicLegitimacy uses, so the (label, color, bg) triple is always
 * internally consistent.
 *
 * THE PIN (real pipeline). Generate a broad corpus of real settlements and assert
 * EVERY settlement's publicLegitimacy.bg is the canonical bg for its label — an
 * invariant a band-crossing settlement violated before the fix. Verified as a real
 * plant: with the fix reverted, at least one corpus settlement band-crosses and
 * reddens this pin (see the Wave-2 report).
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

// The canonical legitimacy band → background, mirrored from
// src/generators/factionDynamics.js computePublicLegitimacy (the producer of the
// provisional value the patch re-stamps). If a band's bg changes there, the patch
// AND this map must move together.
const LABEL_TO_BG = Object.freeze({
  'Endorsed':          '#f0faf4',
  'Approved':          '#f4faf0',
  'Tolerated':         '#faf8ec',
  'Contested':         '#fdf6ec',
  'Legitimacy Crisis': '#fdf4f4',
});

function corpus() {
  const rows = [];
  const tiers = ['village', 'town', 'city', 'metropolis'];
  const threats = ['civilized', 'frontier', 'plagued'];
  const seeds = ['lb-a', 'lb-b', 'lb-c', 'lb-d', 'lb-e'];
  for (const settType of tiers) {
    for (const monsterThreat of threats) {
      for (const seed of seeds) {
        rows.push({ cfg: { settType, culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat }, seed });
      }
    }
  }
  return rows;
}

describe('M5 — publicLegitimacy.bg stays consistent with its band after the defense patch', () => {
  it('every generated settlement has bg matching the canonical bg for its legitimacy label', () => {
    const mismatches = [];
    let observed = 0;
    const failures = collectSeedFailures(corpus(), ({ cfg, seed }) => {
      const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
      const leg = s?.powerStructure?.publicLegitimacy;
      if (!leg || !leg.label) return;
      observed += 1;
      const expectedBg = LABEL_TO_BG[leg.label];
      expect(expectedBg, `unknown legitimacy label "${leg.label}" (${cfg.settType}/${cfg.monsterThreat}/${seed})`).toBeTruthy();
      if (leg.bg !== expectedBg) {
        mismatches.push(`${cfg.settType}/${cfg.monsterThreat}/${seed}: label=${leg.label} color=${leg.color} bg=${leg.bg} (expected ${expectedBg})`);
      }
    });
    expect(observed, 'the corpus produced settlements with a public legitimacy').toBeGreaterThan(0);
    expectNoSeedFailures(failures, 'every corpus settlement carries a legitimacy label this map knows');
    expect(mismatches, `bg/band mismatch (the M5 stale-bg symptom):\n  ${mismatches.join('\n  ')}`).toEqual([]);
  }, 120_000);
});
