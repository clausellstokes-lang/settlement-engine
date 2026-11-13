// REVIEW-UPKEEP-3: does pay still reach the martial will outside its hold? Per birth: the will part at the record's
// standing keep against the same record at full keep; where neither is held and no crisis touches it, any
// difference is pay reaching the will. usage: TREE=<tree> node willpay.mjs <seeds> <out>
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const DG = await import(T+'/src/generators/defenseGenerator.js'); const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
await loadGenerationLawPayloads();
function cfgFor(seed){ const m=seed.match(/^rv[234]-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false}); }
const out=fs.createWriteStream(process.argv[3]);
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const s=JSON.parse(JSON.stringify(generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}})));
  const k=keepOfRecord(s.economicState); const a=DG.defencePartsOf(s,k).find(p=>p.id==='will'); const b=DG.defencePartsOf(s,{bought:1,funded:1}).find(p=>p.id==='will');
  const insts=(s.institutions||[]).map(i=>i.name).join('|');
  out.write(JSON.stringify({seed,keep:k,stand:s.economicState.prosperityStanding,willPay:a?.full,willFull:b?.full,heldA:a?.held,heldB:b?.held,crisis:!!(a?.crisis||b?.crisis),merc:/[Mm]ercenar|[Ff]ree company|[Hh]ired/.test(insts)})+'\n');
}
out.end();
