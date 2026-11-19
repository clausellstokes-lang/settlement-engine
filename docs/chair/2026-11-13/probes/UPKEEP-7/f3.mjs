// COHERENCE-UPKEEP-7, F3: each PDF threat row's band (the band the row prints: scoreBand of its score) against the
// sentence threatAssessment chose (by threat family and forces). Usage: TREE=<tree> node f3.mjs <seeds> <out.ndjson>
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const { buildViewModel } = await import(T+'/src/pdf/lib/viewModel.js');
await loadGenerationLawPayloads();
function cfgFor(seed){ const m=seed.match(/^rv[234]-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false}); }
const out=fs.createWriteStream(process.argv[3]);
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  const vm=buildViewModel({settlement:s});
  const rows=(vm.defense?.threatReadiness||[]).filter(r=>['Beasts & Monsters','Invasion & War'].includes(r.label)).map(r=>({label:r.label,status:r.status,score:r.score,assess:r.assess}));
  out.write(JSON.stringify({seed,threat:s.config?.monsterThreat,rows})+'\n');
}
out.end();
