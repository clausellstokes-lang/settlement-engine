// deskdiff.mjs <line.jsonl> <tip.jsonl> <out.jsonl>: per lens key, towns whose printed sentence moved line→tip; rows written.
import fs from 'node:fs';
const rd=(f)=>new Map(fs.readFileSync(f,'utf8').trim().split('\n').map(JSON.parse).map(o=>[o.seed,o]));
const A=rd(process.argv[2]), B=rd(process.argv[3]); const t={}; const rows=[];
for(const [seed,b] of B){ const a=A.get(seed); const ks=new Set([...Object.keys(a.lines||{}),...Object.keys(b.lines||{})]);
  for(const k of ks){ const x=a.lines?.[k]?.sentence??null, y=b.lines?.[k]?.sentence??null; const xb=a.lines?.[k]?.beside??null, yb=b.lines?.[k]?.beside??null;
    if(x!==y||xb!==yb){ const kind=x==null?'NEW':y==null?'GONE':'CHANGED'; (t[k+' '+kind]??=0); t[k+' '+kind]++; rows.push({seed,k,kind,line:x,tip:y}); } } }
for(const [k,v] of Object.entries(t).sort()) console.log(v+'\t'+k);
fs.writeFileSync(process.argv[4], rows.map(r=>JSON.stringify(r)).join('\n')+'\n');
