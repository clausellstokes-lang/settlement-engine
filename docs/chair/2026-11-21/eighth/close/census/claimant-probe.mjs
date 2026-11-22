const T = process.argv[2];
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
for (const seed of ['rvf-succession_void-city-4', 'rvf-succession_void-city-6']) {
  const s = generateSettlementPipeline(birthConfig({ ...DIALS, settType: 'city', selectedStresses: ['succession_void'], selectedStressesRandom: false }), null, { seed, customContent: {} });
  const ps = s.powerStructure || {};
  console.log(seed, JSON.stringify({ prosperity: s.economicState?.prosperity, legit: ps.publicLegitimacy?.score, claimants: (ps.factions || []).filter((f) => /claimant/i.test(f.faction)).map((f) => [f.faction, f.power]), n: (ps.factions || []).length }));
}
