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
import { deriveFoodBalance } from '../../src/domain/display/dossierViewModel.js';
import { generateEconomicViability } from '../../src/generators/economicGenerator.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

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
  }, 120_000);

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

  /**
   * ODQ §934.15 — the owner's order "make sure that the food deficit math and the
   * band visual are correct". Summing to the gap was never enough: the view also
   * has to name the RIGHT carrier and the RIGHT multiplier, and for both it used
   * to re-derive a figure the canonical writer already holds. These three arms pin
   * the reads, not the re-derivations.
   */
  it('the carrier split is the WRITER\'S split, and a route that imports is never credited with zero', () => {
    const routes = ['road', 'river', 'port', 'crossroads'];
    const terrains = ['plains', 'riverside', 'coastal', 'hills', 'desert'];
    let checked = 0;
    let withMagic = 0;
    for (const settType of ['village', 'town', 'city']) for (const terrainOverride of terrains) for (const tradeRouteAccess of routes) {
      const s = gen({ settType, terrainOverride, tradeRouteAccess }, 'carrier-seed');
      const fs = s.economicState?.foodSecurity;
      const fb = s.economicViability?.metrics?.foodBalance;
      // The gap as the CANONICAL writer sees it, spelled in fields that predate this
      // contract, so the arm below measures behaviour rather than the new field set.
      // Ten pounds a day keeps a rounding-scale gap on a ten-soul thorp out of it.
      if (!fs || !fb || !((fs.dailyNeed - fs.dailyProduction) >= 10)) continue;
      checked++;
      // ⛔ THE DEFECT THIS REPLACES: the view gated imports on its OWN superseded
      // local deficit, so a settlement the local model read as fed — which is most
      // of them, since geographyData's agricultureCapacity runs above the writer's
      // TERRAIN_AGRI on five of seven terrains — was credited with zero imports and
      // a magical offset covering the entire gap, and lost its import channel. Every
      // route in this sweep carries food at a nonzero rate in BOTH models, so a gap
      // this size that shows no import coverage is that erasure and nothing else.
      expect(fb.importCoverage, `${settType}|${terrainOverride}|${tradeRouteAccess} lost its imports`)
        .toBeGreaterThan(0);
      expect(typeof fb.importChannel, `${settType}|${terrainOverride}|${tradeRouteAccess} lost its channel`)
        .toBe('string');
      const canonicalCovered = (fs.importCoverage || 0) + (fs.magicOffset || 0);
      const viewCovered = (fb.importCoverage || 0) + (fb.magicFoodOffset || 0);
      if (canonicalCovered > 0 && viewCovered > 0 && (fs.magicOffset || 0) > 0) {
        withMagic++;
        // The two channels' PROPORTIONS follow the writer's; only the total is
        // re-anchored to deficitPct, and integer pounds cost at most a few percent.
        expect(
          Math.abs((fb.importCoverage || 0) / viewCovered - (fs.importCoverage || 0) / canonicalCovered),
          `${settType}|${terrainOverride}|${tradeRouteAccess} split drifted from the writer`,
        ).toBeLessThan(0.05);
      }
    }
    expect(checked).toBeGreaterThan(20);
    expect(withMagic, 'the magic-split arm never exercised a magical offset').toBeGreaterThan(0);
  }, 120_000);

  it('agricultureModifier is the multiplier the production beside it was computed with', () => {
    // The Economics tab prints it as "Agriculture modifier: X%" and the PDF as
    // "Ag mod X", both immediately beside dailyProduction. It carried geographyData's
    // terrain agricultureCapacity (plains 1.5) while the canonical writer produced at
    // TERRAIN_AGRI (plains 1.0), so the printed modifier contradicted the printed
    // production. Reconstructing production from the pair it prints is the proof.
    let checked = 0;
    for (const settType of ['village', 'town', 'city', 'metropolis']) {
      for (const terrainOverride of ['plains', 'riverside', 'hills', 'forest', 'coastal', 'mountain', 'desert']) {
        const s = gen({ settType, terrainOverride, tradeRouteAccess: 'road' }, 'agmod-seed');
        const fb = s.economicViability?.metrics?.foodBalance;
        const fs = s.economicState?.foodSecurity;
        if (!fb || !fs || !(s.population > 0)) continue;
        checked++;
        expect(fb.agricultureModifier).toBe(fs.effectiveAgriculture);
        // dailyProduction = ⌊pop × 0.4⌋ × 6 × agri × stress × cropFortune ÷ 1.3, and
        // cropFortune is the writer's seeded ±8% harvest band — the only term the
        // printed pair does not name, so the reconstruction lands inside it.
        const predicted = Math.floor(s.population * 0.4) * 6
          * fb.agricultureModifier * (fb.stressModifier ?? 1) / 1.3;
        const ratio = fb.dailyProduction / predicted;
        expect(ratio, `${settType}|${terrainOverride} predicted ${Math.round(predicted)} vs ${fb.dailyProduction}`)
          .toBeGreaterThan(0.91);
        expect(ratio).toBeLessThan(1.09);
      }
    }
    expect(checked).toBeGreaterThan(20);
  }, 120_000);

  it('one residual percentage reaches every surface — the dossier model prints the record\'s own figure', () => {
    // deriveFoodBalance feeds the Economics tab and the PDF chapter; fb.deficitPercent
    // feeds the Daily Life tab, foodNarrative and the AI brief. Re-deriving the percent
    // from the published integer pounds split them on small settlements: a thorp with a
    // 2.4 lb residual against a 60 lb need is 4% on the record and 3% off the pounds.
    let compared = 0;
    for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (const tradeRouteAccess of ['road', 'river', 'port', 'isolated']) {
        const s = gen({ settType, terrainOverride: 'plains', tradeRouteAccess }, 'pct-seed');
        const fb = s.economicViability?.metrics?.foodBalance;
        if (!fb || !(fb.deficit > 0)) continue;
        compared++;
        expect(deriveFoodBalance(s).deficitPct, `${settType}|${tradeRouteAccess}`).toBe(fb.deficitPercent);
      }
    }
    expect(compared).toBeGreaterThan(5);
  }, 120_000);

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

  it('never calls an isolated settlement self-sufficient while over a quarter of food need is uncovered', () => {
    const settlement = {
      population: 5000,
      tier: 'city',
      institutions: [],
      config: {
        tier: 'city',
        tradeRouteAccess: 'isolated',
        priorityMagic: 0,
        priorityReligion: 0,
      },
      economicState: {
        foodSecurity: {
          dailyProduction: 7000,
          dailyNeed: 10000,
          deficitPct: 30,
          surplusPct: 0,
        },
      },
    };
    const result = generateSettlementViability(settlement);

    expect(result.viable).toBe(false);
    expect(result.summary).toMatch(/NOT VIABLE: 1 critical issue prevents settlement survival/);
    // A missing or empty summary reds on the positive pin above, never here.
    // anchored: the positive toMatch above pins this same summary string.
    expect(result.summary).not.toMatch(/self-sufficient/i);
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'Uncovered Local Food Deficit',
        severity: 'critical',
      }),
    ]));
  });

  it('keeps the audited isolated-village verdict aligned with its 48% food gap', () => {
    const settlement = gen({
      settType: 'village',
      culture: 'random_culture',
      terrainOverride: 'auto',
      tradeRouteAccess: 'isolated',
      magicExists: true,
      priorityMagic: 57,
      priorityEconomy: 98,
      monsterThreat: 'plagued',
    }, 'food-verdict-audit-140');
    const balance = settlement.economicViability.metrics.foodBalance;

    expect(balance.deficitPercent).toBe(48);
    expect(settlement.economicState.situationDesc).toMatch(
      /48% of daily need uncovered/i,
    );
    expect(settlement.economicState.situationDesc).toMatch(
      /rationing and outside supply/i,
    );
    // The 48%-uncovered figure and the rationing clause are both pinned on this
    // same string above, so this exclusion measures wording, not absence.
    // anchored: two positive toMatch pins on this same situationDesc above.
    expect(settlement.economicState.situationDesc).not.toMatch(
      /self-sufficient/i,
    );
    expect(
      settlement.generationCoherenceReceipt.checks.find(
        check => check.id === 'food_verdict',
      ),
    ).toMatchObject({
      status: 'pass',
      findings: [],
    });
  });

  it('treats an authored no-route settlement as disconnected in every economy projection', () => {
    const settlement = gen({
      settType: 'thorp',
      culture: 'east_asian',
      terrainOverride: 'forest',
      tradeRouteAccess: 'none',
      monsterThreat: 'heartland',
      contentProfile: 'grounded',
      magicExists: true,
      priorityMagic: 0,
      priorityEconomy: 39,
      priorityMilitary: 95,
      priorityReligion: 27,
      priorityCriminal: 10,
    }, 'intent-84');
    const balance = settlement.economicViability.metrics.foodBalance;

    expect(settlement.economicState.primaryImports).toEqual([]);
    expect(settlement.economicState.primaryExports).toEqual([]);
    expect(settlement.economicState.tradeDependencies).toEqual([]);
    expect(balance.importCoverage).toBeUndefined();
    expect(balance.importChannel).toBeUndefined();
    expect(balance.deficitPercent).toBeGreaterThan(50);
    // 'salt' is the anchor: a route-less thorp cannot produce it, so the critical
    // list is demonstrably still being computed. Without it, a critical list that
    // stopped being populated would pass the grain exclusion forever.
    expectAbsentWithAnchor(
      settlement.resourceAnalysis.imports.critical, 'grain', 'salt',
      'a route-less thorp still names its critical imports',
    );
    // A settlement with tradeRouteAccess:'none' must never render 'via none'.
    // Liveness: `balance` above is read out of this very object and its
    // deficitPercent is pinned above 50, so this payload cannot be empty.
    expect(
      JSON.stringify(settlement.economicViability),
    ).not.toMatch(/\bvia none\b/i); // anchored: `balance` is read out of this object above
    expect(
      settlement.generationCoherenceReceipt.checks.find(
        check => check.id === 'food_verdict',
      ),
    ).toMatchObject({
      status: 'pass',
      findings: [],
    });
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

function generateSettlementViability(settlement) {
  return generateEconomicViability(settlement, 'mountain', []);
}
