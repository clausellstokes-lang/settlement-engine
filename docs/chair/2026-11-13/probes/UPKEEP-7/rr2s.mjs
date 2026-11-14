// The reader's twenty towns (REVIEW-R2-STAGES rr2s seeds) in its own config shape; the safety and income lines.
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
await loadGenerationLawPayloads();
export function cfgFor(seed){
  const m=seed.match(/^rr2s-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  const stresses = m[2]==='calm' ? [] : m[2].split('+'); const route = m[3]==='rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({...DEFAULT_CONFIG, ...route, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, _randomizePriorities:true});
}
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  const sp=s.economicState.safetyProfile;
  console.log('##',seed,'| watch',!!s.institutions.find(i=>/watch/i.test(i.name)),'| inst:',s.institutions.map(i=>i.name).filter(n=>/merc|compan|watch|garrison|militia|alchem|apothec|quarr|smith|fish|court|prison/i.test(n)).join(', '));
  console.log('  GUARD:',sp.guardEffectivenessDesc); console.log('  SAFE:',sp.safetyLabel,'|',sp.safetyDesc.slice(0,120));
  for(const c of sp.crimeTypes) console.log('  CRIME:',c.type,'|',c.desc.slice(0,90));
  for(const e of s.economicState.incomeSources) console.log('  INCOME:',e.source,'|',e.desc.slice(0,110));
}
