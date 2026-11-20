import { readFileSync, readdirSync } from 'node:fs';
const D='/var/tmp/v18/t2/pool-t2sig-2'; const parts=process.argv.slice(2);
const out={};
for (const f of readdirSync(D).filter(f=>/^poolb?-shard\d\.json$/.test(f))) { const sh=JSON.parse(readFileSync(`${D}/${f}`)); const P=f.startsWith('poolb')?'B':'A';
  for (const b of sh.births) for (const [k,i] of Object.entries(b.sigs)) { const o=JSON.parse(sh.sigs[i]); const m={};
    for (const [a,v] of Object.entries(o.f)) m['f.'+a]=v; for (const [a,v] of Object.entries(o.r)) m['r.'+a]=v; for (const [a,v] of Object.entries(o.x)) m['x.'+a]=v;
    for (const p of parts) { const key=`${b.size}|${k.split('|')[0]}|${p}`; const v=m[p]??'-'; ((out[key]||={})[v]||=new Set()).add(b.seed); } } }
for (const [k,v] of Object.entries(out).sort()) console.log(k, Object.entries(v).map(([a,s])=>`${a}:${s.size}`).join(' '));
