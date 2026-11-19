// cdiff.mjs <a.{0,1}.ndjson.gz prefix> <b prefix>: the 4,305's compact rows (births4305[x].mjs), paired by key; per field
// family (seat, labels, factions, npcs.<field>, rel.<column>, cast) the births whose values differ. sp/ac (births4305x only)
// are compared only where both sides carry them.
import fs from 'node:fs'; import zlib from 'node:zlib';
const load=(p)=>{ const m=new Map(); for(const i of [0,1]) for(const l of zlib.gunzipSync(fs.readFileSync(`${p}.${i}.ndjson.gz`)).toString().split('\n')) if(l){ const r=JSON.parse(l); m.set(r.key,r);} return m; };
const [A,B]=process.argv.slice(2); const a=load(A), b=load(B); const fam={}; let diff=0;
const RELCOL=['from','to','type','typeName','npc1Role','npc2Role','description','tension'];
const tally=(set,k)=>set.add(k);
for(const [k,rb] of b){ const ra=a.get(k); if(!ra) continue; const f=new Set();
  for(const key of ['seat','gov','labels','factions','cast']) if(JSON.stringify(ra[key])!==JSON.stringify(rb[key])) tally(f,key);
  const an=new Map(ra.npcs.map(p=>[p.id,p])); if(ra.npcs.length!==rb.npcs.length) tally(f,'npcs.count');
  for(const p of rb.npcs){ const q=an.get(p.id); if(!q){ tally(f,'npcs.new'); continue; } for(const x of Object.keys(p)) { if((x==='sp'||x==='ac')&&!(x in q)) continue; if(JSON.stringify(p[x])!==JSON.stringify(q[x])) tally(f,'npcs.'+x); } }
  const rk=(r)=>r.rel.map(x=>x.join('\u0001')); if(ra.rel.length!==rb.rel.length) tally(f,'rel.count');
  ra.rel.forEach((x,i)=>{ const y=rb.rel[i]; if(!y) return; x.forEach((v,j)=>{ if(JSON.stringify(v)!==JSON.stringify(y[j])) tally(f,'rel.'+RELCOL[j]); }); });
  if(f.size){ diff++; for(const x of f) fam[x]=(fam[x]||0)+1; } }
console.log('births',b.size,'differing',diff); for(const [x,c] of Object.entries(fam).sort((p,q)=>q[1]-p[1])) console.log(c,x);
