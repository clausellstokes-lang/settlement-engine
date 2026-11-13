// claims4305.mjs <wtDir>: reads c4305-{base,tip}.{0,1}.ndjson.gz (births4305.mjs rows) and measures item 1, the seat's person,
// the labels, influence moves, existing-card re-deals, minted lords' categories/titles/genders and the governor's debt rows.
import fs from 'node:fs'; import zlib from 'node:zlib';
const W=process.argv[2]; const load=(t)=>{ const m=new Map(); for(const i of [0,1]) for(const l of zlib.gunzipSync(fs.readFileSync(`${W}/c4305-${t}.${i}.ndjson.gz`)).toString().split('\n')) if(l){ const r=JSON.parse(l); m.set(r.key,r);} return m; };
const b=load('base'), t=load('tip'); const tally=(o,k)=>{o[k]=(o[k]||0)+1;};
const R={births:t.size, seatSame:0, seatDiff:[], labelsMoved:0, differing:0, nobleFirst:{base:{},tip:{}}, minted:0, mintedCat:{}, mintedTitle:{}, mintedGender:{}, mintedInf:{}, inf:{}, gs:0, gl:0, relTowns:0, govSide:0, govSideTowns:new Set(), govEx:[], femaleLordRows:0};
for(const [k,tr] of t){ const br=b.get(k); if(!br) continue;
  if(tr.seat===br.seat) R.seatSame++; else if(R.seatDiff.length<10) R.seatDiff.push(`${k}: ${br.seat} -> ${tr.seat}`);
  if(JSON.stringify(tr.labels)!==JSON.stringify(br.labels)||JSON.stringify(tr.factions.map(f=>[f.n,f.l,f.p,f.g]))!==JSON.stringify(br.factions.map(f=>[f.n,f.l,f.p,f.g]))) R.labelsMoved++;
  if(JSON.stringify(tr)!==JSON.stringify(br)) R.differing++;
  for(const [r,side] of [[br,'base'],[tr,'tip']]) for(const f of r.factions){ if(f.c!=='noble'||f.g) continue; const first=r.npcs.find(p=>p.mem.some(m=>m[0]===f.n&&m[1]===1)); tally(R.nobleFirst[side], first? (first.ik==='power'?'MINTED '+first.title:first.title):'no one'); }
  const bIds=new Map(br.npcs.map(p=>[p.id,p])); const news=new Set();
  for(const p of tr.npcs){ const q=bIds.get(p.id); if(!q){ news.add(p.id); R.minted++; tally(R.mintedCat,p.cat); tally(R.mintedTitle,p.title); tally(R.mintedGender,p.g); tally(R.mintedInf,p.inf); continue; }
    if(q.inf!==p.inf) tally(R.inf,`${p.ik==='power'?'minted '+p.title:p.title} ${q.inf}->${p.inf}`); if(q.gs!==p.gs) R.gs++; if(q.gl!==p.gl) R.gl++; }
  const rk=(r)=>JSON.stringify(r.rel.filter(x=>!news.has(x[0])&&!news.has(x[1])).map(x=>[x[0],x[1],x[2],x[6]])); if(rk(br)!==rk(tr)) R.relTowns++;
  for(const x of tr.rel){ if(x[3]==='Financial Dependence'&&news.has(x[0])){ R.govSide++; R.govSideTowns.add(k); if(R.govEx.length<5) R.govEx.push(`${k}: ${x[6]}`);} 
    for(const [id,role] of [[x[0],x[4]],[x[1],x[5]]]) if(news.has(id)&&/\blord\b/.test(role||'')&&tr.npcs.find(p=>p.id===id)?.g==='female') R.femaleLordRows++; }
}
R.govSideTowns=R.govSideTowns.size; console.log(JSON.stringify(R,null,1));
