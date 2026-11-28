// spdiff.mjs <baseDir> <tipDir> <which>: per card, structural position before -> after, tallied; examples with town.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [A,B,W]=process.argv.slice(2);
const load=(d)=>{ const m=new Map(); for(const f of fs.readdirSync(d).filter(f=>f.startsWith(W+'.')&&f.endsWith('.ndjson.gz'))) for(const l of zlib.gunzipSync(fs.readFileSync(d+'/'+f)).toString().split('\n')) if(l){const r=JSON.parse(l); m.set(r.key,r);} return m; };
const a=load(A), b=load(B); const t={}; const ex={}; let cards=0;
for(const [k,ra] of a){ const rb=b.get(k); const bm=new Map(rb.npcs.map(c=>[c.id,c]));
  for(const c of ra.npcs){ const d=bm.get(c.id); if(!d) continue; if((c.sp||'')!==(d.sp||'')||(c.ac||'')!==(d.ac||'')){ cards++; const key=`${(c.sp||'∅').slice(0,60)}  ==>  ${(d.sp||'∅').slice(0,60)}`; t[key]=(t[key]||0)+1; (ex[key]??=[]).push(`${k} ${c.title} cat=${c.cat}`); } } }
console.log('cards changed',cards); for(const [k,n] of Object.entries(t).sort((x,y)=>y[1]-x[1])) console.log(n, k, '|', ex[k].slice(0,2).join('; '));
