// gdiff.mjs <A> <B> <which>: cards whose short/long goal changed; split: the old line printed a chain label (reworded) or not (re-dealt).
import fs from 'node:fs'; import zlib from 'node:zlib';
const [A,B,W]=process.argv.slice(2);
const load=(d)=>{ const m=new Map(); for(const f of fs.readdirSync(d).filter(f=>f.startsWith(W+'.')&&f.endsWith('.ndjson.gz'))) for(const l of zlib.gunzipSync(fs.readFileSync(d+'/'+f)).toString().split('\n')) if(l){const r=JSON.parse(l); m.set(r.key,r);} return m; };
const src=fs.readFileSync('/home/user/p9base/src/data/supplyChainData.js','utf8'); const labels=[...new Set([...src.matchAll(/label: '([^']*)'/g)].map(m=>m[1]).concat(['Food Processing']))];
const a=load(A), b=load(B); const t={short:{rew:0,re:0},long:{rew:0,re:0}}; const ex=[]; const towns=new Set();
for(const [k,ra] of a){ const rb=b.get(k); const bm=new Map(rb.npcs.map(c=>[c.id,c]));
  for(const c of ra.npcs){ const d=bm.get(c.id); if(!d) continue;
    for(const [v,f] of [['short','gs'],['long','gl']]) if((c[f]||'')!==(d[f]||'')){ towns.add(k); const rew=labels.some(x=>(c[f]||'').includes(x)); t[v][rew?'rew':'re']++; if(!rew&&ex.length<8) ex.push(`${k} [${ra.stress.join('+')||'calm'}] ${c.title}: "${c[f]}" -> "${d[f]}"`); } } }
console.log(JSON.stringify(t),'towns',towns.size); console.log(ex.join('\n'));
