// charter.mjs <dir> <which>: charter goals (rights from those who govern) on a criminal house's card or on the governing power's head.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [D,W]=process.argv.slice(2); const CH=/those who govern|written down and sealed|excused from one tax|no new rule from those who govern|old rights of .* read out/;
let crim=0, head=0; const ex=[];
for(const f of fs.readdirSync(D).filter(f=>f.startsWith(W+'.')&&f.endsWith('.ndjson.gz'))) for(const l of zlib.gunzipSync(fs.readFileSync(D+'/'+f)).toString().split('\n')){ if(!l) continue; const r=JSON.parse(l);
  const gov=r.factions.find(x=>x.g)?.n;
  for(const c of r.npcs) for(const g of [c.gs,c.gl]){ if(!g||!CH.test(g)) continue;
    if(c.cat==='criminal'){ crim++; if(ex.length<3) ex.push(`${r.key} ${c.title}: ${g}`); }
    if(c.mem.some(m=>m[0]===gov&&m[1]===1)){ head++; if(ex.length<6) ex.push(`${r.key} HEAD ${c.title}: ${g}`); } } }
console.log(`charter goals on a criminal card ${crim} · on the governing power's head ${head}`); console.log(ex.join('\n'));
