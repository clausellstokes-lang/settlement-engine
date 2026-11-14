// fdiff.mjs <baseDir> <tipDir> <which>: per leaf path (indices folded), how many births differ; and births with any change.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [A,B,W]=process.argv.slice(2);
const load=(d)=>{ const m=new Map(); for(const f of fs.readdirSync(d).filter(f=>f.startsWith(W+'.')&&f.endsWith('.ndjson.gz'))){ for(const l of zlib.gunzipSync(fs.readFileSync(d+'/'+f)).toString().split('\n')){ if(!l) continue; const r=JSON.parse(l); m.set(r.key,r);} } return m; };
const a=load(A), b=load(B); const per={}; let any=0, n=0;
for(const [k,ra] of a){ const rb=b.get(k); if(!rb) continue; n++; let ch=false; const keys=new Set([...Object.keys(ra.fp),...Object.keys(rb.fp)]);
  for(const p of keys){ if(ra.fp[p]!==rb.fp[p]){ per[p]=(per[p]||0)+1; ch=true; } } if(ch) any++; }
console.log('births',n,'changed',any); for(const [p,c] of Object.entries(per).sort((x,y)=>y[1]-x[1])) console.log(c,p);
