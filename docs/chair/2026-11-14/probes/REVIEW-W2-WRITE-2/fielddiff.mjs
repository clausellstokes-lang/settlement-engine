// fielddiff.mjs <a.ndjson.gz> <b.ndjson.gz>: per seed, every leaf path whose value differs, folded to its top two keys
// (the record's families); prints each family with the number of seeds it moved in, and new/removed top-level keys.
import fs from 'node:fs'; import zlib from 'node:zlib';
const load=f=>new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map(l=>{const o=JSON.parse(l);return [o.seed,o.s];}));
const [A,B]=process.argv.slice(2); const a=load(A), b=load(B); const fam={}; const keysA=new Set(), keysB=new Set(); let same=0;
function walk(x,y,p,out){ if(JSON.stringify(x)===JSON.stringify(y)) return; if(x&&y&&typeof x==='object'&&typeof y==='object'&&!Array.isArray(x)&&!Array.isArray(y)){ for(const k of new Set([...Object.keys(x),...Object.keys(y)])) walk(x[k],y[k],p.concat(k),out); } else out.add(p.slice(0,2).join('.')); }
for(const [seed,x] of a){ const y=b.get(seed); Object.keys(x).forEach(k=>keysA.add(k)); if(y) Object.keys(y).forEach(k=>keysB.add(k)); const out=new Set(); walk(x,y,[],out); if(!out.size) same++; for(const f of out) fam[f]=(fam[f]||0)+1; }
console.log('seeds',a.size,'identical',same); console.log('top keys only in A',[...keysA].filter(k=>!keysB.has(k)),'only in B',[...keysB].filter(k=>!keysA.has(k)));
for(const [f,n] of Object.entries(fam).sort((p,q)=>q[1]-p[1])) console.log(String(n).padStart(4),f);
