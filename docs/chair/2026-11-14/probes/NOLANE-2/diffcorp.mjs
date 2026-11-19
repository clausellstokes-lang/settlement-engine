// node diffcorp.mjs <outA> <outB> [depth=2]  : which record fields differ between two births corpora, by path family, in how many towns
import zlib from 'node:zlib'; import fs from 'node:fs';
const [A,B,D='2']=process.argv.slice(2); const depth=Number(D);
const load=(d)=>{const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(d+'/corpus.ndjson.gz')).toString().split('\n')){ if(!l) continue; const o=JSON.parse(l); m.set(o.seed,o.s);} return m;};
const a=load(A), b=load(B);
const fam=new Map(); let townsDiff=0; const sample={};
const walk=(x,y,path,seed,acc)=>{
  if(JSON.stringify(x)===JSON.stringify(y)) return;
  const isO=(v)=>v&&typeof v==='object'&&!Array.isArray(v);
  if(path.length<depth && isO(x)&&isO(y)){ for(const k of new Set([...Object.keys(x),...Object.keys(y)])) walk(x[k],y[k],[...path,k],seed,acc); return; }
  const key=path.join('.'); acc.add(key); if(!sample[key]) sample[key]={seed,a:JSON.stringify(x)?.slice(0,160),b:JSON.stringify(y)?.slice(0,160)};
};
for(const [seed,sa] of a){ const sb=b.get(seed); const acc=new Set(); if(!sb){acc.add('<missing>');} else walk(sa,sb,[],seed,acc); if(acc.size) townsDiff++; for(const k of acc) fam.set(k,(fam.get(k)||0)+1); }
console.log('towns',a.size,b.size,'differing',townsDiff);
for(const [k,n] of [...fam].sort((x,y)=>y[1]-x[1])) console.log(String(n).padStart(4),k,'  e.g.',sample[k]?.seed,'|',sample[k]?.a,'=>',sample[k]?.b);
