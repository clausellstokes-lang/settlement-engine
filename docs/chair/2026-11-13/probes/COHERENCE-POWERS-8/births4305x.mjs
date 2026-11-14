// births4305x.mjs (COHERENCE-POWERS-8: the reader's births4305.mjs, each card also carrying its structural position and constraint)
// births4305.mjs — TREE=<tree> OUT=<file.ndjson.gz> SHARD=i NSHARD=n node births4305.mjs [which=RGS]
// The lane's 4,305 (COHERENCE-POWERS-3/corpus.mjs :: jobsFor, R+G+S), born in TREE, each written as a COMPACT row:
// the seat's person, the labels, the powers, every card's people fields, the relationships, the crisis cast.
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const TREE=process.env.TREE; const imp=(p)=>import(path.join(TREE,p));
const { jobsFor } = await import(path.join(process.env.CORPUS_DIR||'/home/user/settlement-engine/docs/chair/2026-11-11/probes/COHERENCE-POWERS-3','corpus.mjs'));
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { rulingChainOf } = await imp('src/domain/dossier/powerStrata.js');
await loadGenerationLawPayloads();
const jobs=(await jobsFor(imp, process.argv[2]||'RGS')).filter((_,i)=>i%Number(process.env.NSHARD||1)===Number(process.env.SHARD||0));
const out=zlib.createGzip(); out.pipe(fs.createWriteStream(process.env.OUT));
let n=0, err=0;
for(const j of jobs){
  try{
    const s=generateSettlementPipeline(j.cfg,null,{seed:j.seed,customContent:{}});
    const ps=s.powerStructure||{};
    let seat=null; try{ seat=rulingChainOf(s).npc?.id||null; }catch{}
    const row={key:j.key,tier:s.tier,stress:(Array.isArray(s.stress)?s.stress:[s.stress]).filter(Boolean).map(x=>x.type),
      seat, gov:ps.government?.name||ps.government||null,
      labels:{capture:ps.criminalCaptureState?.label||ps.criminalCaptureState?.state||null, stability:ps.stability??null, legitimacy:ps.publicLegitimacy?.score??ps.legitimacy??null},
      factions:(ps.factions||[]).map(f=>({n:f.faction||f.name,l:f.powerLabel,p:f.power,g:!!f.isGoverning,c:f.category,m:f.modifiers||[]})),
      npcs:(s.npcs||[]).map(p=>({id:p.id,name:p.name,g:p.gender,title:p.title,role:p.role,cat:p.category,inf:p.influence,pow:p.power,imp:p.importance,sr:p.structuralRank,ik:p.institution?.kind,key:p.institution?.key,mem:(p.memberships||[]).map(m=>[m.power,m.rank,m.share]),gs:p.goal?.short,gl:p.goal?.long,sec:p.secret?.what,flaw:p.personality?.flaw,sp:p.structuralPosition,ac:p.activeConstraint})),
      rel:(s.relationships||[]).map(r=>[r.from,r.to,r.type,r.typeName,r.npc1Role,r.npc2Role,r.description,r.tension]),
      cast:JSON.stringify(s.stress?.cast||(Array.isArray(s.stress)?s.stress.map(x=>x.cast):null)||null)};
    out.write(JSON.stringify(row)+'\n'); n++;
  }catch(e){ err++; console.error(j.key, e.message); }
}
out.end(); await new Promise(r=>out.on('end',r).on('finish',r)); console.log('births',n,'errors',err);
