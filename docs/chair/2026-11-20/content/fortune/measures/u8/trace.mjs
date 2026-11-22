const T = process.argv[2];
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { seatFacesFoldedByDualHat } = await import(`${T}/src/generators/people/representatives.js`);
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const CASES = [['rvf-slave_revolt-thorp-5','thorp','slave_revolt'],['rvf-wartime-thorp-2','thorp','wartime'],['rvw-thorp-86','thorp',null]];
for (const [seed, settType, stress] of CASES) for (const lit of [false, true]) {
  const config = stress ? { ...DIALS, settType, selectedStresses: [stress], selectedStressesRandom: false } : { ...DIALS, settType };
  globalThis.__DBG = [];
  const cfg = lit ? { ...birthConfig(config), _fortuneLawVersion: 2 } : birthConfig(config);
  const s = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
  const ps = s.powerStructure || {};
  console.log(`=== ${seed} ${lit ? 'LIT' : 'DARK'} pop=${s.population} prosp=${s.economicState?.prosperity} legit=${ps.publicLegitimacy?.score} ${ps.publicLegitimacy?.label} stress=${JSON.stringify((Array.isArray(s.stress)?s.stress:[s.stress]).map(x=>x?.type||x?.id||x))} npcs=${(s.npcs||[]).length} folded=${seatFacesFoldedByDualHat(s)}`);
  console.log('  factions', JSON.stringify((ps.factions||[]).map(f=>[f.faction,f.power,f.isGoverning?'gov':''])));
  console.log('  npcs', JSON.stringify((s.npcs||[]).map(n=>[n.name,n.role||n.title,n.factionAffiliation||n.faction])));
  console.log('  stability', JSON.stringify(ps.stability));
  for (const d of globalThis.__DBG) console.log('  DBG', JSON.stringify(d));
}
