const T = process.argv[2];
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { seatFacesFoldedByDualHat } = await import(`${T}/src/generators/people/representatives.js`);
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const CASES = [['rvf-occupied-thorp-6','thorp','occupied','Occupation Authority'],['rvf-occupied-hamlet-5','hamlet','occupied','Occupation Authority'],['rvf-slave_revolt-thorp-5','thorp','slave_revolt','Revolt Leadership'],['rvf-wartime-thorp-2','thorp','wartime','War Council'],['rvf-famine-thorp-0','thorp','famine','Grain Holders'],['rvw-thorp-86','thorp',null,'The Highborn Circle'],['rvw-hamlet-66','hamlet',null,'Monster Hunters / Adventurers'],['rvf-politically_fractured-hamlet-3','hamlet','politically_fractured','The Independent Bloc']];
for (const [seed, settType, stress, power] of CASES) {
  const config = stress ? { ...DIALS, settType, selectedStresses: [stress], selectedStressesRandom: false } : { ...DIALS, settType };
  const s = generateSettlementPipeline((process.env.LIT ? { ...birthConfig(config), _fortuneLawVersion: 2 } : birthConfig(config)), null, { seed, customContent: {} });
  const roster = (s.powerStructure?.factions || []).map((f) => `${f.faction}${f.isGoverning ? '*' : ''}`);
  const st = Array.isArray(s.stress) ? s.stress.map((x) => x.type || x.id || x).join('+') : (s.stress?.type || s.stress?.id || JSON.stringify(s.stress)?.slice(0, 40));
  console.log(`${roster.some((r) => r.replace('*','') === power) ? 'OK  ' : 'MISS'} ${seed} stress=${st} folded=${seatFacesFoldedByDualHat(s)} gov=${s.powerStructure?.governingFaction?.faction || s.powerStructure?.government || ''} roster=[${roster.join(', ')}] npcs=${(s.npcs||[]).length}`);
}
