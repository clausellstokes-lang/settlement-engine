// REVIEW-UPKEEP-3 scan: one ndjson line per birth (rv2-/rv3-/rv4- seeds, the app's own shape), at TREE.
// Like REVIEW-UPKEEP-2's scan.mjs, plus the computed parts (defencePartsOf: id, group, source, points).
const R=process.env.TREE+'/src'; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
const DG = await import(R+'/generators/defenseGenerator.js');
await loadGenerationLawPayloads();
function cfgFor(seed){
  const m=seed.match(/^rv[234]-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false});
}
const out=fs.createWriteStream(process.argv[3]);
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  let s; try{ s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); }catch(e){ out.write(JSON.stringify({seed,err:String(e).slice(0,200)})+'\n'); continue; }
  const d=s.defenseProfile||{}; const sc=d.scores||{}; const I=d.institutions||{};
  const nm=k=>(I[k]||[]).map(x=>x.name).join('|');
  let parts=[]; try{ parts=DG.defencePartsOf(JSON.parse(JSON.stringify(s))).map(p=>({id:p.id,g:p.group,src:p.source,lab:p.label,pt:p.points})); }catch(e){ parts=[{err:String(e).slice(0,120)}]; }
  out.write(JSON.stringify({seed,tier:s.tier,pros:s.economicState?.prosperity,stand:s.economicState?.prosperityStanding,
    stress:[].concat(s.stress||[]).map(x=>x?.type).filter(Boolean).join('+'),
    rs:d.readiness?.score,rl:d.readiness?.label,mil:sc.military,mon:sc.monster,int:sc.internal,eco:sc.economic,mag:sc.magical,dis:sc.disaster,
    walls:nm('walls'),gar:nm('garrison'),mili:nm('militia'),watch:nm('watch'),merc:nm('mercenary'),charter:nm('charter'),mdef:nm('magicDef'),
    insts:(s.institutions||[]).map(i=>i.name).join('|'),
    months:s.economicState?.foodSecurity?.storageMonths, parts })+'\n');
}
out.end();
