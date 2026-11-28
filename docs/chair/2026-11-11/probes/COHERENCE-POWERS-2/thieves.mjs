import path from 'node:path';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { allegianceOf } = await imp('src/domain/people/allegiance.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
for (const seed of ['l2-famine-hamlet-6','l2-insurgency-hamlet-12','l2-insurgency-village-8','l2-politically_fractured-village-10','l2-politically_fractured-town-4','l2-religious_conversion-village-8','l2-religious_conversion-village-16']) {
  const m = seed.match(/^l2-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = { ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false };
  const s = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
  const tg = s.powerStructure.factions.find(f => /Thieves/.test(f.faction));
  const agents = (s.npcs||[]).filter(c => allegianceOf(c)).map(c => `${c.name}(${c.title})->${JSON.stringify(allegianceOf(c))}`);
  // without the stress
  const s0 = generateSettlementPipeline(birthConfig({ ...DIALS, settType: m[2], selectedStresses: [], selectedStressesRandom: false }), null, { seed, customContent: {} });
  const tg0 = s0.powerStructure.factions.find(f => /Thieves/.test(f.faction));
  console.log(seed, 'TG', tg?.power, 'agents', agents.length, agents.slice(0,2).join(' | '), '| no-stress TG:', tg0?.power ?? 'absent', 'crimHouses', (s.institutions||[]).filter(h=>/thie|smuggl|fence|den|gang|rook/i.test(h.name)).map(h=>h.name).join(','), '| tier', s.tier, 'priorities', JSON.stringify(s.config?.priorities||s.config?._priorities||'').slice(0,80));
}
