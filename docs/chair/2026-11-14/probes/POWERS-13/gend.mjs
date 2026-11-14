import path from 'node:path';
const [TREE, ...seeds] = process.argv.slice(2);
const imp=(p)=>import(path.join(TREE,p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
for (const seed of seeds) {
  const m = seed.match(/^(?:r2r|p8)-(\w+)-\d+$/);
  const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
  const by = new Map((s.npcs || []).map((c) => [c.id, c]));
  const ends = (s.relationships || []).flatMap((r) => [[by.get(r.from), r.npc1Role], [by.get(r.to), r.npc2Role]]).filter(([c]) => c);
  const g = ends.filter(([c]) => c.gender === 'female' && /^the (?:lord|abbot|senior abbot)$/.test(c.role));
  console.log(seed, g.length, JSON.stringify(g.map(([c,w])=>c.name+':'+w)));
}
