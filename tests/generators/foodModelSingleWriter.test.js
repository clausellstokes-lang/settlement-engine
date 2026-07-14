/**
 * foodModelSingleWriter.test.js — [generators-domain-4].
 *
 * There were TWO food models: generateFoodSecurity (economicState.foodSecurity —
 * feeds prosperity + the tick foodStockpile) and deriveFoodBalanceAnalysis (the
 * viability foodBalance — paid Viability tab + PDF). They independently recomputed
 * production/need/deficit with a different terrain-agri source, a different magic
 * model, and — in foodSecurity only — seeded crop-fortune variance, so they could
 * DISAGREE on the deficit sign (one surplus, one deficit) for the same settlement.
 *
 * The fix makes deriveFoodBalanceAnalysis a VIEW of the canonical foodSecurity: its
 * production/need/deficit are the single source of truth. This pins the contradiction
 * killer + attribution consistency + the fallback (no-foodSecurity) legacy path.
 */

import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveFoodBalanceAnalysis } from '../../src/generators/economy/foodBalance.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });

describe('generators-domain-4 — single-writer food model', () => {
  it('CONTRADICTION KILLER — viability foodBalance never disagrees with foodSecurity on deficit sign or magnitude', () => {
    const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    const terrains = ['plains', 'mountain', 'coastal', 'desert', 'forest', 'hills', 'riverside'];
    const routes = ['road', 'river', 'port', 'crossroads', 'isolated', 'none'];
    let compared = 0;
    for (const settType of tiers) for (const terrainOverride of terrains) for (const tradeRouteAccess of routes) {
      const s = gen({ settType, terrainOverride, tradeRouteAccess }, 'sw-seed');
      const fs = s.economicState?.foodSecurity;
      const fb = s.economicViability?.metrics?.foodBalance;
      if (!fs || !fb) continue;
      compared++;
      // Sign: deficitPct > 0 on foodSecurity ⇔ deficit > 0 on foodBalance.
      expect((fb.deficit || 0) > 0, `${settType}|${terrainOverride}|${tradeRouteAccess} deficit-sign disagreement`)
        .toBe((fs.deficitPct || 0) > 0);
      // Magnitude: foodBalance is a view — production & need equal foodSecurity's.
      expect(fb.dailyProduction).toBe(fs.dailyProduction);
      expect(fb.dailyNeed).toBe(fs.dailyNeed);
    }
    expect(compared).toBeGreaterThan(200);
  });

  it('attribution sums exactly to the canonical gap (importCoverage + magicFoodOffset === rawDeficit − deficit)', () => {
    const tiers = ['village', 'town', 'city', 'metropolis'];
    const terrains = ['mountain', 'desert', 'plains', 'coastal'];
    for (const settType of tiers) for (const terrainOverride of terrains) {
      const s = gen({ settType, terrainOverride, tradeRouteAccess: 'road' }, 'attr-seed');
      const fb = s.economicViability?.metrics?.foodBalance;
      if (!fb || fb.rawDeficit == null) continue;
      const covered = (fb.importCoverage || 0) + (fb.magicFoodOffset || 0);
      expect(Math.abs((fb.rawDeficit - covered) - fb.deficit)).toBeLessThanOrEqual(1);
    }
  });

  it('the view FOLLOWS the canonical — a foodSecurity surplus overrides a local deficit', () => {
    // Local model (no imports, low terrain) would compute a deficit; the canonical
    // foodSecurity reports a clear surplus, so the view must report NO deficit.
    const localWouldDeficit = deriveFoodBalanceAnalysis(
      5000, { agricultureCapacity: 0.3 }, [], { tier: 'city', tradeRouteAccess: 'isolated' },
    );
    expect(localWouldDeficit.foodBalance.deficit).toBeGreaterThan(0); // sanity: fallback sees a deficit

    const canonicalSurplus = { dailyProduction: 12000, dailyNeed: 10000, deficitPct: 0, surplusPct: 20 };
    const view = deriveFoodBalanceAnalysis(
      5000, { agricultureCapacity: 0.3 }, [], { tier: 'city', tradeRouteAccess: 'isolated' }, canonicalSurplus,
    );
    expect(view.foodBalance.deficit).toBe(0);
    expect(view.foodBalance.dailyProduction).toBe(12000);
    expect(view.foodBalance.dailyNeed).toBe(10000);
    expect(view.foodBalance.surplus).toBe(2000);
  });

  it('the view FOLLOWS the canonical — a foodSecurity deficit overrides a local surplus', () => {
    const canonicalDeficit = { dailyProduction: 6000, dailyNeed: 10000, deficitPct: 25, surplusPct: 0 };
    const view = deriveFoodBalanceAnalysis(
      5000, { agricultureCapacity: 2.0 }, [], { tier: 'city', tradeRouteAccess: 'port' }, canonicalDeficit,
    );
    expect(view.foodBalance.deficit).toBeGreaterThan(0);
    expect(view.foodBalance.deficitPercent).toBe(25);
    expect(view.foodBalance.dailyProduction).toBe(6000);
  });

  it('fallback (no foodSecurity) keeps the legacy local model — a fixed input is stable', () => {
    const fb = deriveFoodBalanceAnalysis(
      3000, { agricultureCapacity: 1.0 }, [], { tier: 'town', tradeRouteAccess: 'road' },
    ).foodBalance;
    expect(fb).toMatchObject({
      dailyNeed: 6000,
      dailyProduction: 5538,
      deficit: 300,
      deficitPercent: 5,
      importCoverage: 162,
      rawDeficit: 462,
      importChannel: 'road trade',
    });
  });
});
