// cluster.mjs <strdiff.jsonl>: the differing string leaves grouped by path and by the tip text with digits masked;
// per group: towns, example seeds, and the base texts it replaced (masked).
import fs from 'node:fs';
const rows=fs.readFileSync(process.argv[2],'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const mask=(t)=>t==null?'∅':String(t).replace(/\d+/g,'#');
const g=new Map();
for(const r of rows){ const p=r.path.replace(/\[\d+\]/g,'[]'); if(/intent|\.id$|target/.test(p)) continue; const k=p+' ⟶ '+mask(r.tip).slice(0,160); const e=g.get(k)||{n:new Set(),ex:[],base:new Map()}; e.n.add(r.seed); if(e.ex.length<4) e.ex.push(r.seed); const b=mask(r.base).slice(0,110); e.base.set(b,(e.base.get(b)||0)+1); g.set(k,e); }
for(const [k,e] of [...g].sort((a,b)=>a[0].localeCompare(b[0]))) console.log(`${e.n.size}\t${k}\n\t\tex ${e.ex.join(' ')}\n\t\tfrom ${[...e.base].sort((a,b)=>b[1]-a[1]).slice(0,3).map(([b,n])=>n+'× '+b).join(' | ')}`);
