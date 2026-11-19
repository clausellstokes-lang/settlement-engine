import path from 'node:path';
const [TREE, ...seeds] = process.argv.slice(2);
const imp=(p)=>import(path.join(TREE,p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
for (const seed of seeds) {
  const calm = seed.match(/^(?:r2r|p8)-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] } : { ...DEFAULT_CONFIG, ...DIALS, settType: forced[2], selectedStresses: [forced[1]], selectedStressesRandom: false };
  const s = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
  const hits = (s.npcs||[]).filter(c=>c?.institution?.kind==='power' && /underworld|thie(?:f|ves)['’]?\s+guild|criminal guild/i.test(c.secret?.what||'')).map(c=>[c.title,c.institution.key,c.secret.what]);
  const g=[...(s.powerStructure?.factions||[]).map(f=>f.faction),...(s.institutions||[]).map(i=>i.name)].filter(n=>/thie|criminal guild/i.test(String(n||'')));
  if (hits.length) console.log(seed, JSON.stringify(g), JSON.stringify(hits));
}
console.log('done', seeds.length);
