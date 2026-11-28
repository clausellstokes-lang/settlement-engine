// read30: the PDF Economic Survival sentence as (b) writes it, and as the pre-(b) path writes it (standing nulled on a copy).
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const { buildThreatAssessment } = await import(T+'/src/domain/display/threatAssessment.js');
const { scoreBand } = await import(T+'/src/domain/display/defenseScoreBands.js');
await loadGenerationLawPayloads();
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const m=seed.match(/^rv2-([a-z_]+)-(town|city|metropolis)-(\d+)$/);
  const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:[m[1]],selectedStressesRandom:false}),null,{seed,customContent:{}});
  const now=buildThreatAssessment(s).find(r=>r.label==='Economic Survival').assess;
  const old=buildThreatAssessment({...s,economicState:{...s.economicState,prosperityStanding:null}}).find(r=>r.label==='Economic Survival').assess;
  console.log([seed,s.economicState.prosperity,s.economicState.prosperityStanding,s.defenseProfile.scores.economic,scoreBand(s.defenseProfile.scores.economic),now.slice(0,60),old.slice(0,60)].join('\t'));
}
