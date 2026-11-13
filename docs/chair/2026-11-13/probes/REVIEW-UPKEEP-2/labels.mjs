const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const PIC = await import(T+'/src/domain/display/prosperityInCrisis.js');
await loadGenerationLawPayloads(); const out=fs.createWriteStream(process.argv[3]);
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){ const m=seed.match(/^rv[23]-([a-z_+]+)-(\w+)-(\d+)$/);
  let s; try{ s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false}),null,{seed,customContent:{}}); }catch(e){ out.write(JSON.stringify({seed,err:String(e).slice(0,120)})+'\n'); continue; }
  out.write(JSON.stringify({seed,stress:[].concat(s.stress||[]).map(x=>x?.type),pros:s.economicState.prosperity,stand:s.economicState.prosperityStanding,line:PIC.prosperityInCrisisLine(s),rs:s.defenseProfile.readiness.score,rl:s.defenseProfile.readiness.label})+'\n'); }
out.end();
