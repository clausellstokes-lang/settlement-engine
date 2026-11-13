import path from 'node:path';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
const { derivePowerStrata, rulingChainOf } = await imp('src/domain/dossier/powerStrata.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
await loadGenerationLawPayloads();
const cont = [], note = [];
for (let i = 0; i < 60; i++) {
  const s = generateSettlementPipeline(birthConfig({ ...(DEFAULT_CONFIG || {}), settType: 'thorp' }), null, { seed: `rulers-thorp-${i}`, customContent: {} });
  if (derivePowerStrata(s).powers.filter((p) => p.role === 'contender').length) cont.push(i);
  const gov = governingFactionOf(s); const rival = (s.powerStructure.factions || []).filter((f) => !f.isGoverning && f.power > gov.power);
  if (String(gov.crisisNote || '').includes('Holds the title') && rival.length) note.push(`${i}:${nameOf(rival[0])} ${rival[0].power}/${gov.power}`);
  if (i === 11) console.log('thorp 11 absence:', rulingChainOf(s).absence?.line);
}
console.log('contenders', cont.join(' ')); console.log('note+rival', note.join(' | '));
