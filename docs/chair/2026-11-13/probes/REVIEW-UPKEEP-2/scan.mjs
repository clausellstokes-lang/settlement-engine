// REVIEW-UPKEEP-2 scan: one ndjson line per birth. Seeds rv2-<crisis>-<size>-<i>; crisis 'calm' = no stress.
// Born in the app's own shape: birthConfig({...DEFAULT_CONFIG, settType, selectedStresses:[c] or [], selectedStressesRandom:false}).
const R=process.env.TREE+'/src'; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
export function cfgFor(seed){
  const m=seed.match(/^rv2-(calm|famine|under_siege|wartime|succession_void)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:[m[1]],selectedStressesRandom:false});
}
const seeds=fs.readFileSync(process.argv[2],'utf8').trim().split('\n');
const out=fs.createWriteStream(process.argv[3]);
for(const seed of seeds){
  let s; try{ s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}); }catch(e){ out.write(JSON.stringify({seed,err:String(e).slice(0,200)})+'\n'); continue; }
  const d=s.defenseProfile||{}; const sc=d.scores||{}; const I=d.institutions||{};
  const n=k=>(I[k]||[]).length; const nm=k=>(I[k]||[]).map(x=>x.name).join('|');
  out.write(JSON.stringify({seed,tier:s.tier,pros:s.economicState?.prosperity,stand:s.economicState?.prosperityStanding,
    stress:[].concat(s.stress||[]).map(x=>x?.type).filter(Boolean).join('+'),
    rs:d.readiness?.score,rl:d.readiness?.label,mil:sc.military,mon:sc.monster,int:sc.internal,eco:sc.economic,mag:sc.magical,dis:sc.disaster,
    walls:nm('walls'),gar:nm('garrison'),mili:nm('militia'),watch:nm('watch'),merc:nm('mercenary'),charter:nm('charter'),mdef:nm('magicDef'),
    months:s.economicState?.foodSecurity?.storageMonths,
    parts:(d.parts||[]).map(p=>[p.id,p.points]) })+'\n');
}
out.end();
