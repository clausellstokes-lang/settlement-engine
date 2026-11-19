// node rdiff.mjs <base.gz> <tip.gz> <field-js-expr>  — print seed tier siege : before -> after for the field
import fs from 'node:fs'; import zlib from 'node:zlib';
const read=(f)=>{ const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) if(l){ const o=JSON.parse(l); m.set(o.seed, o.s);} return m; };
const A=read(process.argv[2]), B=read(process.argv[3]); const get=new Function('s','return ('+process.argv[4]+')');
const extra=process.argv[5]?new Function('s','return ('+process.argv[5]+')'):()=>''; 
for(const [seed,a] of A){ const b=B.get(seed); const x=JSON.stringify(get(a)), y=JSON.stringify(get(b)); if(x!==y) console.log(`${seed} [${a.tier} ${(a.config?.stressTypes||[]).join('+')||'calm'} ${extra(b)}]\n  - ${x}\n  + ${y}`); }
