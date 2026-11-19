// goalcheck.mjs <dir> <which>: goals that print a chain label; siege/famine goals that presume buying, hiring, stores or road trade.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [D,W]=process.argv.slice(2);
const { SUPPLY_CHAIN_NEEDS } = await import('/home/user/p9base/src/data/supplyChainData.js').catch(()=>({}));
const src=fs.readFileSync('/home/user/p9base/src/data/supplyChainData.js','utf8'); const labels=[...new Set([...src.matchAll(/label: '([^']*)'/g)].map(m=>m[1]).concat(['Food Processing','Smelting & Refining']))];
const SIEGE=/Find a new source of supply for|Bring in from outside what|Find whoever can still supply|Find a second supplier of|Lay in a season of|Buy .* at the market in bulk|Take on more hands|Win new business for|Grow the work at .* by one more pair of hands|Get the most out of/;
const FAM=/Take on more hands|Get the most out of|Grow the work at .* by one more pair of hands/;
let lab=0,labT=new Set(),sg=0,sgT=new Set(),fm=0; const ex=[];
for(const f of fs.readdirSync(D).filter(f=>f.startsWith(W+'.')&&f.endsWith('.ndjson.gz'))) for(const l of zlib.gunzipSync(fs.readFileSync(D+'/'+f)).toString().split('\n')){ if(!l) continue; const r=JSON.parse(l);
  for(const c of r.npcs) for(const g of [c.gs,c.gl]){ if(!g) continue;
    if(labels.some(x=>g.includes(x))){ lab++; labT.add(r.key); }
    if(r.stress.includes('under_siege')&&SIEGE.test(g)&&g===c.gs){ sg++; sgT.add(r.key); if(ex.length<3) ex.push(r.key+': '+g); }
    if(r.stress.includes('famine')&&FAM.test(g)&&g===c.gs){ fm++; } } }
console.log(`chain-label goals ${lab} in ${labT.size} towns · siege short goals presuming trade ${sg} in ${sgT.size} towns · famine hiring/most-out ${fm}`); if(ex.length) console.log(ex.join('\n'));
