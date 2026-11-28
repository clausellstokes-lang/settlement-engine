import path from 'node:path';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const REP = await imp('src/generators/people/representatives.js');
const { faceOfInstitution } = await imp('src/data/institutionalCatalog.js');
const { backingRowFor } = await imp('src/data/institutionBacking.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
for (const seed of process.argv.slice(3)) {
  const m = seed.match(/^l2-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const tier = m ? m[2] : seed.split('-')[1];
  const cfg = m ? { ...DIALS, settType: tier, selectedStresses: [m[1]], selectedStressesRandom: false } : { ...DIALS, settType: tier };
  const s = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
  const g = governingFactionOf(s);
  console.log(`\n## ${seed} ${s.name} ${tier} ruler=${nameOf(g)} stress=${[].concat(s.stress||[]).map(x=>x?.type)}`);
  console.log(' insts:', (s.institutions||[]).map(h => `${h.name}[${REP.houseKindOf(h)}|face=${faceOfInstitution(h)}|w=${backingRowFor(h.name)?.weight??'-'}]`).join('; '));
  console.log(' factions:', s.powerStructure.factions.map(f => `${nameOf(f)}(${f.power}${f.isGoverning?',G':''})`).join(', '));
  for (const c of s.npcs||[]) console.log('  card', c.id, '|', c.name, '|', c.title, '|', c.role, '| inst', c.institution?.kind, c.institution?.key, '|', (c.memberships||[]).map(x=>`${x.power}#${x.rank}/${x.share}`).join(','));
}
