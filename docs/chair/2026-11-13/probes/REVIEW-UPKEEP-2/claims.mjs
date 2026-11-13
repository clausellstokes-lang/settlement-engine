// REVIEW-UPKEEP-2 claims probe, run at the tip only. Per birth: (a) the parts sum to the score;
// (b) the record stripped of defenseProfile recomputes equal; (c) count once: drop each roster house
// alone and list the non-rule parts that move; (d) the two limits: where each bites, and whether the
// condition the design names holds there; (e) pay: each paid part with no crisis and no limit keeps
// exactly fundedGate(floor, standing keep) of its full points; (f) a crisis acts once: the same record
// with no stress differs only on parts the crisis line names, by what it took.
const T=process.env.TREE; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(T+'/src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(T+'/src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(T+'/src/store/configSlice.js');
const { generateDefenseProfile } = await import(T+'/src/generators/defenseGenerator.js');
const { keepOfRecord, keepOf, fundedGate } = await import(T+'/src/domain/facts/keep.js');
const { DEFENCE_TUNING:W } = await import(T+'/src/data/defenceWeights.js');
await loadGenerationLawPayloads();
function cfgFor(seed){ const m=seed.match(/^rv2-(calm|famine|under_siege|wartime|succession_void)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return birthConfig({...DEFAULT_CONFIG,settType:m[2],selectedStresses:m[1]==='calm'?[]:[m[1]],selectedStressesRandom:false}); }
const RULE=new Set(['terrain','size','danger','wallsUnmanned','sustainsHeld','scaleTop','scaleBottom','will']);
const isRule=id=>RULE.has(id)||id.startsWith('full:')||id.startsWith('floor:');
const out=fs.createWriteStream(process.argv[3]);
const clone=o=>JSON.parse(JSON.stringify(o));
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  const dp=s.defenseProfile; const r={seed};
  r.sumExact=Math.round(dp.parts.reduce((a,p)=>a+p.points,0)*10)===Math.round(dp.readiness.score*10);
  const st=clone(s); delete st.defenseProfile;
  const re=generateDefenseProfile(st,keepOfRecord(st.economicState));
  r.stripEqual=JSON.stringify(re)===JSON.stringify(JSON.parse(JSON.stringify(dp)));
  // master shape: no standing label
  const ms=clone(s); delete ms.defenseProfile; delete ms.economicState.prosperityStanding;
  const rm=generateDefenseProfile(ms,keepOfRecord(ms.economicState));
  r.masterShapeScore=rm.readiness.score; r.score=dp.readiness.score; r.pros=s.economicState.prosperity; r.stand=s.economicState.prosperityStanding;
  // (c) count once
  const base=Object.fromEntries(dp.parts.filter(p=>!isRule(p.id)).map(p=>[p.id,p.full]));
  const multi=[];
  (s.institutions||[]).forEach((inst,i)=>{
    const x=clone(s); x.institutions.splice(i,1); delete x.defenseProfile;
    const q=generateDefenseProfile(x,keepOfRecord(x.economicState));
    const now=Object.fromEntries(q.parts.filter(p=>!isRule(p.id)).map(p=>[p.id,p.full]));
    const moved=[...new Set([...Object.keys(base),...Object.keys(now)])].filter(k=>Math.abs((base[k]??0)-(now[k]??0))>1e-9);
    if(moved.length>1) multi.push([inst.name,moved.join('+')]);
  });
  r.multi=multi;
  // (d) limits
  const ids=dp.parts.map(p=>p.id);
  const ARMED=['garrison','militia','watch','company','charter','households','wardens'];
  const armedLive=dp.parts.some(p=>ARMED.includes(p.id)&&p.points>0);
  r.limit2=ids.includes('wallsUnmanned'); r.limit2cond=ids.includes('walls')&&!armedLive;
  const grp=g=>dp.parts.filter(p=>p.group===g).reduce((a,p)=>a+p.points,0);
  r.limit1=ids.includes('sustainsHeld');
  // (e) pay: paid parts with no crisis
  const keep=keepOfRecord(s.economicState); const PAID={garrison:1,militia:1,watch:1,court:1,prison:1,wardens:1,arcane:1,alchemists:1,hospital:1,market:1};
  const payBad=[];
  if(!r.limit1){ for(const p of dp.parts){ if(!PAID[p.id]||p.crisis||!p.full) continue;
    const tw=W[p.id]||{}; const dims=Object.keys(tw).filter(k=>['mil','mon','int','sup'].includes(k));
    if(dims.length===1){ const exp=p.full*fundedGate(W.floors[dims[0]],keep); if(Math.abs(exp-p.points)>0.11) payBad.push([p.id,p.full,p.points,+exp.toFixed(2)]); } } }
  r.payBad=payBad; r.keepFunded=keep.funded;
  // (f) crisis once
  if(s.stress){ const y=clone(s); delete y.defenseProfile; y.stress=null; y.stressors=null; y.config={...y.config,stressTypes:[],intendedStressTypes:[]};
    const q=generateDefenseProfile(y,keep); const a=Object.fromEntries(dp.parts.map(p=>[p.id,p])); const b=Object.fromEntries(q.parts.map(p=>[p.id,p]));
    const off=[]; for(const id of new Set([...Object.keys(a),...Object.keys(b)])){ if(isRule(id)) continue; const pa=a[id],pb=b[id];
      if(!pa||!pb){ off.push(id+':presence'); continue; }
      const took=pa.crisis?-Object.values(pa.crisis).reduce((u,v)=>u+v,0):0;
      if(Math.abs((pb.points-pa.points)-took)>0.15 && !(r.limit1)) off.push(`${id}:${pb.points}->${pa.points} took ${took.toFixed(1)}`); }
    r.crisisOff=off; r.noStressScore=q.readiness.score; }
  out.write(JSON.stringify(r)+'\n');
}
out.end();
