// held.mjs <dir> <which>: cards whose secret or presentation is a line of persons held; per title and per town.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [D,W]=process.argv.slice(2); const HELD=/against their will|in chains|locked up between bouts|buys and sells people|papers that would free them/;
let cards=0; const towns=new Set(); const byT={};
for(const f of fs.readdirSync(D).filter(f=>f.startsWith(W+'.')&&f.endsWith('.ndjson.gz'))) for(const l of zlib.gunzipSync(fs.readFileSync(D+'/'+f)).toString().split('\n')){ if(!l) continue; const r=JSON.parse(l);
  for(const c of r.npcs){ if(HELD.test(c.sec||'')||HELD.test(c.pi||'')){ cards++; towns.add(r.key); byT[c.title]=(byT[c.title]||0)+1; } } }
console.log('cards',cards,'towns',towns.size,JSON.stringify(byT));
