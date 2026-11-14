/**
 * CENSUS-3e (the chair's answer 2 to CENSUS-3d): the outlook's grain-monopoly hook
 * (`foodBalance.js :: deriveSupplyRiskAnalysis`, a deficit on a traded route) presumed a GUILD.
 * Measured under R-V on soak1k-0..999: `guild` at the economy step (`birthFactsOf`) differs from
 * the final record on 25 of 1,000 births (4 of the 377 that print the hook), because the power
 * half of `guildOf` is settled after the economy. So the hook is reworded to presume only what its
 * branch guarantees (the deficit and a traded route: the imports), and declares nothing.
 */
import { describe, expect, it } from 'vitest';
import { deriveSupplyRiskAnalysis } from '../../src/generators/economy/foodBalance.js';

describe('the grain-monopoly hook presumes no guild (CENSUS-3e)', () => {
  it('a deficit on a river route prints the monopoly hook without a guild', () => {
    const { plotHooks } = deriveSupplyRiskAnalysis(1000, 'plains', [], { tradeRouteAccess: 'river' }, { deficit: 50, dailyProduction: 100, dailyNeed: 150, importCoverage: 25, importChannel: 'river trade' }); // R2-CODE-A item 6: the importer presumes food comes in by trade, so the double states the channel the real writer sets on a traded route
    const monopoly = plotHooks.find((h) => h.category === 'Trade Monopoly');
    expect(monopoly?.hook).toBe('One importer now brings in all the grain and has quadrupled the price; the locals are arguing over whether to pay, find another supplier, or take the grain.');
    expect(monopoly?.hook).not.toMatch(/guild/i); // anchored: the exact hook text is pinned on the line above
  });
});
