import fs from 'node:fs';
const rd=(f)=>new Map(fs.readFileSync(f,'utf8').trim().split('\n').map(JSON.parse).map(o=>[o.seed,o.leaves]));
const A=rd('print.base.jsonl'), B=rd('print.tip.jsonl'); const c={}; const towns={};
for(const [seed,b] of B){ const a=A.get(seed); for(const k of new Set([...Object.keys(a),...Object.keys(b)])){ if(a[k]!==b[k]){ const kk=k.replace(/\.\d+/g,'.#')+' '+(a[k]==null?'NEW':b[k]==null?'GONE':'CHANGED'); c[kk]=(c[kk]||0)+1; (towns[kk]??=new Set()).add(seed);} } }
for(const [k,v] of Object.entries(c)) console.log(v, towns[k].size, k);
