// REVIEW-UPKEEP-3: per birth, a hash of the whole stored record, the readiness, the five scores and the guard line,
// at TREE. Used to attribute every move to the commit that made it. usage: TREE=<tree> node hashscan.mjs <seeds> <out>
const T=process.env.TREE; import fs from 'node:fs'; import crypto from 'node:crypto';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
await loadGenerationLawPayloads();
function cfgFor(seed){ const m=seed.match(/^rv[234]-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false}); }
const out=fs.createWriteStream(process.argv[3]);
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); const j=JSON.stringify(s);
  const d=s.defenseProfile||{}; const noDef=JSON.parse(j); delete noDef.defenseProfile; if(noDef.economicState?.safetyProfile) delete noDef.economicState.safetyProfile.guardEffectivenessDesc; delete noDef.powerStructure;
  out.write(JSON.stringify({seed,h:crypto.createHash('sha1').update(j).digest('hex').slice(0,12),
    hRest:crypto.createHash('sha1').update(JSON.stringify(noDef)).digest('hex').slice(0,12),
    hPow:crypto.createHash('sha1').update(JSON.stringify(s.powerStructure??null)).digest('hex').slice(0,12),
    rs:d.readiness?.score,rl:d.readiness?.label,sc:d.scores,guard:s.economicState?.safetyProfile?.guardEffectivenessDesc})+'\n');
}
out.end();
