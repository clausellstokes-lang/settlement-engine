const T = process.argv[2];
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const s = generateSettlementPipeline(birthConfig({ ...DIALS, settType: 'thorp', selectedStresses: ['slave_revolt'], selectedStressesRandom: false }), null, { seed: 'rvf-slave_revolt-thorp-5', customContent: {} });
const ps = s.powerStructure || {};
console.log(JSON.stringify({ pop: s.population, prosperity: s.economicState?.prosperity, legit: ps.publicLegitimacy?.score, legitLabel: ps.publicLegitimacy?.label, factions: (ps.factions||[]).map(f=>[f.faction,f.power,f.isGoverning?'gov':'']), npcs: (s.npcs||[]).map(n=>[n.name,n.role||n.title,n.factionAffiliation||n.faction]), stability: ps.stability }).slice(0, 900));
