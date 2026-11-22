const T = process.argv[2];
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
// [seed, tier, stress, power, override]
const RUNS = [
  ['rvf-slave_revolt-thorp-5','thorp','slave_revolt','Revolt Leadership',{ gov: 0.60 }],
  ['rvf-wartime-thorp-2','thorp','wartime','War Council',{ gov: 0.60 }],
  ['rvw-thorp-86','thorp',null,'The Highborn Circle',{ gov: 0.80 }],
  ['rvf-succession_void-city-4','city','succession_void','Noble Claimant (Reform Line)',{ gov: 1.00 }],
  ['rvf-succession_void-city-4','city','succession_void','Noble Claimant (Reform Line)',{ p01: 0.65 }],
  ['rvf-succession_void-city-4','city','succession_void','Noble Claimant (Reform Line)',{ gov: 1.00, p01: 0.65 }],
];
for (const [seed, settType, stress, power, ov] of RUNS) {
  const config = stress ? { ...DIALS, settType, selectedStresses: [stress], selectedStressesRandom: false } : { ...DIALS, settType };
  globalThis.__GOVMULT = ov.gov ?? null; globalThis.__PROSP01 = ov.p01 ?? null; globalThis.__DBG = [];
  const s = generateSettlementPipeline({ ...birthConfig(config), _fortuneLawVersion: 2 }, null, { seed, customContent: {} });
  globalThis.__GOVMULT = null; globalThis.__PROSP01 = null;
  const roster = (s.powerStructure?.factions || []).map((f) => f.faction);
  const d = globalThis.__DBG.find((x) => x.seam === 'resize') || {};
  console.log(`${roster.includes(power) ? 'BACK' : 'STILL-MISSING'} LIT+${JSON.stringify(ov)} ${seed} prosp=${s.economicState?.prosperity} legit=${s.powerStructure?.publicLegitimacy?.score} roster=[${roster.join(', ')}] npcs=${(s.npcs||[]).length} rolledFC=${d.rolledFactionCount} rival=${JSON.stringify(d.rival)} ordered=${JSON.stringify(d.ordered)}`);
  console.log('   rawPower', JSON.stringify((s.powerStructure?.factions||[]).map(f=>[f.faction,f.rawPower,f.power])));
}
