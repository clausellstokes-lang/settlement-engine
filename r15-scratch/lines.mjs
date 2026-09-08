import fs from 'node:fs'; import path from 'node:path';
const T=process.env.T;
const g=JSON.parse(fs.readFileSync('graph.json','utf8'));
const imports=g.imports;
const rows=JSON.parse(fs.readFileSync('final-rows.json','utf8'));
const srcCache=new Map();
function lines(f){ if(!srcCache.has(f)){ let s=''; try{s=fs.readFileSync(path.join(T,f),'utf8');}catch{} srcCache.set(f,s.split('\n')); } return srcCache.get(f); }
function findIn(f,needle){ const L=lines(f); for(let i=0;i<L.length;i++) if(L[i].includes(needle)) return i+1; return null; }
let fixed=0, still=0;
for(const r of rows){
  if(r.line!==null) continue;
  const cands=[];
  for(const t of (imports[r.file]||[])) cands.push(t);
  for(const t of [...cands]) for(const u of (imports[t]||[])) if(!cands.includes(u)) cands.push(u);
  let got=null, gotF=null;
  for(const n of [String(r.text).slice(0,60), String(r.text).slice(0,30), String(r.text).slice(0,18)]){
    if(n.length<8) break;
    for(const c of cands){ const L=findIn(c,n); if(L){ got=L; gotF=c; break; } }
    if(got) break;
  }
  if(got){ r.line=got; r.lineFile=gotF; fixed++; } else still++;
}
console.log('recovered', fixed, 'still null', still);
fs.writeFileSync('final-rows.json', JSON.stringify(rows));
