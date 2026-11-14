// pagelines.mjs <dumpsdir> <lines.json> <out.tsv>: every page line (with its tab) that matches each id
import fs from 'node:fs';
const [dir, lf, out] = process.argv.slice(2); const L=JSON.parse(fs.readFileSync(lf)).map(([id,rx])=>[id,new RegExp(rx)]);
const w=[]; const tally={};
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.txt'))){ const seed=f.slice(0,-4); let tab=''; const seen=new Set();
  for(const line of fs.readFileSync(dir+'/'+f,'utf8').split('\n')){ if(line.startsWith('== ')){ tab=line.replace(/=/g,'').trim(); continue; }
    for(const [id,rx] of L) if(rx.test(line)){ const k=id+'|'+tab+'|'+line; if(seen.has(k)) continue; seen.add(k); w.push([id,seed,tab,line.slice(0,400)].join('\t')); (tally[id]??=new Set()).add(seed); } } }
fs.writeFileSync(out,w.join('\n')+'\n'); for(const [k,v] of Object.entries(tally)) console.log(k, v.size);
