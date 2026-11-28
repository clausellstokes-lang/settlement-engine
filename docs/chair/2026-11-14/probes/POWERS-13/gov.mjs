// gov.mjs: TREE OUT WHICH(720|file:<seeds>) SHARD NSHARD -> ndjson.gz of power facts per birth
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const TREE=process.env.TREE; const imp=(p)=>import(path.join(TREE,p));
const C2='/home/user/c2/docs/chair/2026-11-13/probes/CENSUS-2';
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
await loadGenerationLawPayloads();
const { makeCfgFor } = await import(C2+'/seedcfg.mjs'); const cfgFor=makeCfgFor(birthConfig, DEFAULT_CONFIG);
const W=process.env.WHICH||'720'; const f = W==='720' ? C2+'/seeds.txt' : W.slice(5);
let seeds=fs.readFileSync(f,'utf8').trim().split('\n').filter(Boolean);
seeds=seeds.filter((_,i)=>i%Number(process.env.NSHARD||1)===Number(process.env.SHARD||0));
const out=zlib.createGzip(); const done=new Promise(r=>out.pipe(fs.createWriteStream(process.env.OUT)).on('finish',r));
let n=0,err=0;
for(const seed of seeds){ try{
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  const ps=s.powerStructure||{}; const inst=s.economicState?.compound?.inst||{};
  out.write(JSON.stringify({key:seed,tier:s.tier,stress:(Array.isArray(s.stress)?s.stress:[s.stress]).filter(Boolean).map(x=>x.type),
    rc:ps.recentConflict, stab:ps.stability, inst:Object.keys(inst).filter(k=>inst[k]===true), names:(s.institutions||[]).map(i=>i.name),
    fac:(ps.factions||[]).map(x=>({n:x.faction,c:x.category,l:x.powerLabel,p:x.power,g:!!x.isGoverning,m:x.modifier||null,ms:x.modifiers||[]})),
    rel:(ps.factionRelationships||[]).map(r=>[r.factionA||r.a||r.from,r.factionB||r.b||r.to,r.type]),
    cfg:{pm:s.config?.priorityMagic??null,pmil:s.config?.priorityMilitary??null,pr:s.config?.priorityReligion??null},
    arc:!!s.defenseProfile?.traditions?.hasArcane, magic:s.magicProfile?.level??null})+'\n'); n++;
}catch(e){err++; console.error(seed,e.message);} }
out.end(); await done; console.log('births',n,'errors',err); process.exit(err?1:0);
