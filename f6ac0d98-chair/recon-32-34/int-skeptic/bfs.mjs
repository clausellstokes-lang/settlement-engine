import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
const ROOT = process.argv[2];
const ENTRY = process.argv[3];
const targets = process.argv.slice(4);
const seen = new Map(); // file -> parent
const q = [];
function res(spec, from){
  if(!spec.startsWith('.')) return null;
  let p = resolve(dirname(from), spec);
  const cands=[p, p+'.js', p+'.jsx', join(p,'index.js'), join(p,'index.jsx')];
  for(const c of cands){ if(existsSync(c) && statSync(c).isFile()) return c; }
  return null;
}
const staticRe = /(?:^|\n)\s*(?:import\s[^;]*?from\s*|import\s*|export\s[^;]*?from\s*)['"]([^'"]+)['"]/g;
function edges(file){
  const src = readFileSync(file,'utf-8');
  // strip dynamic imports: import( ... )
  const out=[]; let m;
  staticRe.lastIndex=0;
  while((m=staticRe.exec(src))!==null){
    // ensure not preceded by '(' i.e. dynamic
    out.push(m[1]);
  }
  return out;
}
const entry = resolve(ROOT, ENTRY);
seen.set(entry, null); q.push(entry);
while(q.length){
  const f=q.shift();
  let specs; try{specs=edges(f);}catch(e){continue;}
  for(const s of specs){
    const r=res(s,f); if(!r) continue;
    if(seen.has(r)) continue;
    seen.set(r,f); q.push(r);
  }
}
console.log('reachable modules:', seen.size);
for(const t of targets){
  const hit=[...seen.keys()].filter(k=>k.endsWith('/'+t));
  if(!hit.length){ console.log('NOT REACHABLE:', t); continue; }
  for(const h of hit){
    const chain=[]; let c=h; while(c){ chain.push(c.replace(ROOT+'/','')); c=seen.get(c); }
    console.log('REACHABLE:', t, '\n   ', chain.reverse().join('\n  -> '));
  }
}
