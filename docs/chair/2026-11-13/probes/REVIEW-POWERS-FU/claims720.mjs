// claims720.mjs <base corpus.ndjson.gz> <tip corpus.ndjson.gz> — item 1/2 and the draw-move claims on the census's 720.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
async function load(f){ const m=new Map(); const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity}); for await(const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); m.set(seed,s);} return m; }
const [B,T]=process.argv.slice(2); const b=await load(B), t=await load(T);
const isNobleF=(f)=>f.category==='noble';
const firstOf=(s,power)=>s.npcs.find(c=>(c.memberships||[]).some(m=>m.power===power&&m.rank===1));
const tally=(o,k)=>{o[k]=(o[k]||0)+1;};
const res={nobleFirstBase:{},nobleFirstTip:{},minted:0,mintedBy:{},mintedGender:{},mintedInf:{},mintedCat:{},mintedTitle:{},govRelMinted:0,govRelExamples:[],relLordFemale:0,femEx:[],moved:{inf:0,gs:0,gl:0,imp:0,sr:0,rel:0,sec:0,name:0},movedTowns:0,townsWithMint:0,movedTownsWithoutMint:0,seatSame:0,seatDiff:[]};
for(const [seed,ts] of t){ const bs=b.get(seed); if(!bs) continue;
  for(const [s,k] of [[bs,'nobleFirstBase'],[ts,'nobleFirstTip']]) for(const f of s.powerStructure.factions||[]){ if(!isNobleF(f)||f.isGoverning) continue; const c=firstOf(s,f.faction||f.name); tally(res[k], c? (c.institution?.kind==='power'?'MINTED '+c.title : c.title) : 'no one'); }
  const bIds=new Set(bs.npcs.map(p=>p.id)); const newIds=ts.npcs.filter(p=>!bIds.has(p.id));
  for(const p of newIds){ res.minted++; tally(res.mintedBy,(p.memberships||[]).map(m=>m.power).join('+')); tally(res.mintedGender,p.gender); tally(res.mintedInf,p.influence); tally(res.mintedCat,p.category); tally(res.mintedTitle,p.title); }
  const newSet=new Set(newIds.map(p=>p.id));
  for(const r of ts.relationships||[]){ const involves=newSet.has(r.from)||newSet.has(r.to); if(!involves) continue;
    if(/^gov_|Financial Dependence/.test(r.archetypeKey||'')||/governs|council's decisions|common works|treasury|civic project|tax rolls|levy/i.test((r.description||'')+' '+(r.tension||''))){ res.govRelMinted++; if(res.govRelExamples.length<12) res.govRelExamples.push(`${seed}: ${r.typeName} | ${r.description} | ${r.tension}`); }
    for(const [id,role] of [[r.from,r.npc1Role],[r.to,r.npc2Role]]){ const p=ts.npcs.find(x=>x.id===id); if(newSet.has(id)&&p?.gender==='female'&&/\blord\b/.test(role||'')){ res.relLordFemale++; if(res.femEx.length<5) res.femEx.push(`${seed}: ${p.name} (${role})`);} } }
  // existing cards that moved
  let moved=false; const bm=new Map(bs.npcs.map(p=>[p.id,p]));
  for(const p of ts.npcs){ const q=bm.get(p.id); if(!q) continue;
    if(q.influence!==p.influence){res.moved.inf++;moved=true;} if(q.goal?.short!==p.goal?.short){res.moved.gs++;moved=true;} if(q.goal?.long!==p.goal?.long){res.moved.gl++;moved=true;}
    if(q.importance!==p.importance){res.moved.imp++;moved=true;} if(q.structuralRank!==p.structuralRank){res.moved.sr++;} if(q.secret?.what!==p.secret?.what){res.moved.sec++;moved=true;} if(q.name!==p.name){res.moved.name++;moved=true;} }
  const relKey=(s)=>JSON.stringify((s.relationships||[]).filter(r=>!newSet.has(r.from)&&!newSet.has(r.to)).map(r=>[r.from,r.to,r.type,r.description]));
  if(relKey(bs)!==relKey(ts)){res.moved.rel++;moved=true;}
  if(moved) res.movedTowns++; if(newIds.length) res.townsWithMint++; if(moved&&!newIds.length) res.movedTownsWithoutMint++;
}
console.log(JSON.stringify(res,null,1));
