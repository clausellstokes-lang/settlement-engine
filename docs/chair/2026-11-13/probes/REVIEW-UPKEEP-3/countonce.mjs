// REVIEW-UPKEEP-3, cure E: the earlier reader's count-once test on the COMPUTED parts (defencePartsOf).
// Per birth: (a) the parts sum exactly to the score; (b) drop each roster house alone, recompute, and list the
// non-rule parts whose FULL points move; a house that moves two or more parts is counted twice.
// usage: TREE=<tree> node countonce.mjs <seeds> <out.ndjson>
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const DG = await import(T+'/src/generators/defenseGenerator.js');
await loadGenerationLawPayloads();
function cfgFor(seed){ const m=seed.match(/^rv[234]-([a-z_+]+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:m[1].split('+'),selectedStressesRandom:false}); }
const RULE=new Set(['terrain','size','danger','wallsUnmanned','sustainsHeld','scaleTop','scaleBottom','will','rounding']);
const isRule=id=>RULE.has(id)||id.startsWith('full:')||id.startsWith('floor:');
const clone=o=>JSON.parse(JSON.stringify(o)); const out=fs.createWriteStream(process.argv[3]);
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const s=clone(generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}}));
  const parts=DG.defencePartsOf(s); const r={seed,score:s.defenseProfile.readiness.score,label:s.defenseProfile.readiness.label,mag:s.defenseProfile.scores.magical};
  r.sumExact=Math.round(parts.reduce((a,p)=>a+p.points,0)*10)===Math.round(r.score*10);
  r.parts=parts.map(p=>[p.id,p.points,p.full]);
  const base=Object.fromEntries(parts.filter(p=>!isRule(p.id)).map(p=>[p.id,p.full]));
  const multi=[];
  (s.institutions||[]).forEach((inst,i)=>{ const x=clone(s); x.institutions.splice(i,1);
    const q=DG.defencePartsOf(x); const now=Object.fromEntries(q.filter(p=>!isRule(p.id)).map(p=>[p.id,p.full]));
    const moved=[...new Set([...Object.keys(base),...Object.keys(now)])].filter(k=>Math.abs((base[k]??0)-(now[k]??0))>1e-9);
    if(moved.length>1) multi.push([inst.name,moved.join('+')]); });
  r.multi=multi; out.write(JSON.stringify(r)+'\n');
}
out.end();
