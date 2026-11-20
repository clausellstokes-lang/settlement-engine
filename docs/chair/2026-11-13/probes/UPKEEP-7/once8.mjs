// COHERENCE-UPKEEP-7, ruling W1: count once by the DESIGN'S law. Drop each roster house alone, recompute the parts
// (never stored), and take the non-rule parts whose full value moves. A house COUNTS TWICE where two of the parts it
// moves feed ONE score (each part's `feeds`). A house that moves two parts feeding different scores stands in two roles.
// Usage: TREE=<tree> node once8.mjs <seedfile> <out.ndjson>   (rv2/rv3/rv4 app-shape seeds; once7-<tier>-<i> random dials)
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const { defencePartsOf } = await import(T+'/src/generators/defenseGenerator.js');
await loadGenerationLawPayloads();
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function cfgFor(seed){
  let m=seed.match(/^rv[234]-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if(m) return birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false});
  m=seed.match(/^once7-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return birthConfig({...DEFAULT_CONFIG,...DIALS,settType:m[1]});
}
const RULE=new Set(['terrain','size','danger','wallsUnmanned','sustainsHeld','scaleTop','scaleBottom','will','rounding']);
const isRule=id=>RULE.has(id)||id.startsWith('full:')||id.startsWith('floor:');
const out=fs.createWriteStream(process.argv[3]);
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  const list=(x)=>defencePartsOf(x).filter(p=>!isRule(p.id));
  const b=list(s); const base=Object.fromEntries(b.map(p=>[p.id,p.full])); const feeds=Object.fromEntries(b.map(p=>[p.id,p.feeds]));
  const twice=[], roles=[];
  (s.institutions||[]).forEach((inst,i)=>{
    const n=list({...s,institutions:s.institutions.filter((_,j)=>j!==i)});
    for(const p of n) feeds[p.id]??=p.feeds;
    const now=Object.fromEntries(n.map(p=>[p.id,p.full]));
    const moved=[...new Set([...Object.keys(base),...Object.keys(now)])].filter(k=>Math.abs((base[k]??0)-(now[k]??0))>1e-9);
    if(moved.length<2) return;
    const byScore={}; for(const id of moved) for(const sc of feeds[id]||[]) (byScore[sc]??=[]).push(id);
    const shared=Object.entries(byScore).filter(([,ids])=>ids.length>1);
    const row=[inst.name,moved.map(id=>`${id}(${(feeds[id]||[]).join('/')})`).join('+')];
    if(shared.length) twice.push([...row,shared.map(([sc,ids])=>`${sc}:${ids.join('+')}`).join(' ')]); else roles.push(row);
  });
  out.write(JSON.stringify({seed,twice,roles})+'\n');
}
out.end();
