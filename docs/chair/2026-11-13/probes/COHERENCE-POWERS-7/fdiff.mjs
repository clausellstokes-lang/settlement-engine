// node fdiff.mjs <a.ndjson.gz> <b.ndjson.gz> — leaf-path families that differ, births paired by seed
import { recs } from './rd.mjs';
const A=new Map(); for await (const {seed,s} of recs(process.argv[2])) A.set(seed,s);
const fam={}; let diff=0, n=0; const ex={};
function walk(a,b,p,out){ if(a===b) return; if(typeof a!=='object'||typeof b!=='object'||a===null||b===null){ out.add(p); return; }
  if(Array.isArray(a)!==Array.isArray(b)){ out.add(p); return; }
  const ks=new Set([...Object.keys(a),...Object.keys(b)]); for(const k of ks){ walk(a[k],b[k], p+(Array.isArray(a)?'[]':'.'+k), out); } }
for await (const {seed,s} of recs(process.argv[3])) { n++; const a=A.get(seed); if(!a) continue; const out=new Set(); walk(a,s,'',out); if(out.size){ diff++; for(const p of out){ fam[p]=(fam[p]||0)+1; ex[p]??=seed; } } }
console.log('births',n,'differing',diff); for(const [p,c] of Object.entries(fam).sort((x,y)=>y[1]-x[1]).slice(0,60)) console.log(c, p, ex[p]);
