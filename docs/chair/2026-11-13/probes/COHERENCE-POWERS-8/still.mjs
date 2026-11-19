// still.mjs <rr20.ndjson.gz> <cut.json> <n,n,...>: does each cut line's sentence (prefixes stripped) stand in its town's record?
import fs from 'node:fs'; import { recs } from './rd.mjs';
const [C,J,N]=process.argv.slice(2); const want=new Set(N.split(',').map(Number));
const lines=JSON.parse(fs.readFileSync(J,'utf8')).lines.filter(l=>want.has(l.n));
const T=new Map(); for await (const {seed,s} of recs(C)) T.set(seed,JSON.stringify(s));
const core=(t)=>t.replace(/^(How they deal|Secret:|Wants)\s*/,'').replace(/^(.)/,(c)=>c).trim();
for(const l of lines){ const rec=T.get(l.town); const c=core(l.sentence); const parts=c.split(/(?<=[.;:])\s+/).filter(p=>p.length>25);
  const hit=parts.map(p=>rec?.includes(JSON.stringify(p).slice(1,-1).slice(0,60))?1:0);
  console.log(`#${l.n} ${l.town} ${hit.join('')||'?'} ${rec?'':'NO-TOWN'} :: ${c.slice(0,90)}`); }
