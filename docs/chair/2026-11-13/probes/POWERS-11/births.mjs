// POWERS-9 births: TREE=<tree> OUT=<file.ndjson.gz> WHICH=4305|r80|720 SHARD=i NSHARD=n node births.mjs
// 4305 = the lane's corpus (COHERENCE-POWERS-3/corpus.mjs :: jobsFor 'RGS'); r80 / 720 = the census's seeds (CENSUS-2 seedcfg.mjs).
// Each row: key, a field fingerprint (leaf path with array indices folded -> hash of the values in order) and compact rows.
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path'; import crypto from 'node:crypto';
const TREE=process.env.TREE; const imp=(p)=>import(path.join(TREE,p));
const C2='/home/user/c2/docs/chair/2026-11-13/probes/CENSUS-2';
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
await loadGenerationLawPayloads();
let jobs;
if (process.env.WHICH==='4305') { const { jobsFor } = await import('/home/user/settlement-engine/docs/chair/2026-11-11/probes/COHERENCE-POWERS-3/corpus.mjs'); jobs=await jobsFor(imp,'RGS'); }
else { const { makeCfgFor } = await import(C2+'/seedcfg.mjs'); const cfgFor=makeCfgFor(birthConfig, DEFAULT_CONFIG);
  const f = process.env.WHICH==='r80' ? C2+'/seeds.readers.txt' : C2+'/seeds.txt';
  jobs=fs.readFileSync(f,'utf8').trim().split('\n').filter(Boolean).map(seed=>({key:seed,seed,cfg:cfgFor(seed)})); }
jobs=jobs.filter((_,i)=>i%Number(process.env.NSHARD||1)===Number(process.env.SHARD||0));
function fp(o){ const acc={}; const walk=(v,p)=>{ if(v===null||typeof v!=='object'){ (acc[p]??=[]).push(v); return; }
  if(Array.isArray(v)){ v.forEach(x=>walk(x,p+'[]')); if(!v.length)(acc[p+'[]']??=[]).push('∅'); return; }
  for(const k of Object.keys(v)) walk(v[k], p?p+'.'+k:k); };
  walk(o,''); const out={}; for(const [k,vs] of Object.entries(acc)) out[k]=crypto.createHash('sha1').update(JSON.stringify(vs)).digest('hex').slice(0,12); return out; }
const out=zlib.createGzip(); const done=new Promise(r=>out.pipe(fs.createWriteStream(process.env.OUT)).on('finish',r));
let n=0, err=0;
for(const j of jobs){
  try{
    const s=generateSettlementPipeline(j.cfg,null,{seed:j.seed,customContent:{}});
    const ps=s.powerStructure||{};
    const row={key:j.key,tier:s.tier,pop:s.population,stress:(Array.isArray(s.stress)?s.stress:[s.stress]).filter(Boolean).map(x=>x.type),
      fp:fp(s),
      factions:(ps.factions||[]).map(f=>({n:f.faction||f.name,l:f.powerLabel,p:f.power,g:!!f.isGoverning,c:f.category,m:f.modifiers||[],d:f.desc})),
      npcs:(s.npcs||[]).map(p=>({id:p.id,name:p.name,g:p.gender,title:p.title,role:p.role,cat:p.category,sr:p.structuralRank,key:p.institution?.key,mem:(p.memberships||[]).map(m=>[m.power,m.rank,m.share]),gs:p.goal?.short,gl:p.goal?.long,sec:p.secret?.what,pi:p.presentation?.impression,sp:p.structuralPosition,ac:p.activeConstraint,sc:p.settlementCondition})),
      rel:(s.relationships||[]).map(r=>[r.from,r.to,r.type,r.typeName,r.npc1Role,r.npc2Role,r.description,r.tension]),
      inst:(s.institutions||[]).map(i=>i.name)};
    out.write(JSON.stringify(row)+'\n'); n++;
  }catch(e){ err++; console.error(j.key, e.message); }
}
out.end(); await done; console.log('births',n,'errors',err); process.exit(err?1:0);
