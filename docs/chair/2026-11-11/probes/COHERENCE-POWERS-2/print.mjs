import path from 'node:path';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const SPF = await imp('src/domain/people/stressPowerFaces.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const RW = { 1: 'first', 2: 'second', 3: 'third' };
for (const seed of process.argv.slice(3)) {
  const m = seed.match(/^l2-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = m ? { ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false } : { ...DIALS, settType: seed.split('-')[1] };
  const s = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
  const g = nameOf(governingFactionOf(s));
  console.log(`${s.name} (${seed}) — a ${s.tier}, ruled by ${g}${m ? `, under ${m[1]}` : ''}`);
  for (const f of s.powerStructure.factions) {
    const p = nameOf(f);
    const ranked = (s.npcs || []).map((c) => ({ c, r: c.memberships?.find((x) => x.power === p)?.rank, v: c.memberships?.find((x) => x.power === p)?.veiled })).filter((x) => x.r).sort((a, b) => a.r - b.r);
    const line = ranked.length ? ranked.map(({ c, r, v }) => `${RW[r]} ${c.name}, ${c.title}${c.role && c.role !== c.title ? ` and ${c.role}` : ''}${v ? ' (veiled)' : ''}`).join(' · ')
      : (SPF.leaderlessLineOf(s, p) || '(no one)');
    console.log(`  ${p} (${f.power}): ${line}`);
  }
}
