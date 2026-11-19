// read30: for each fixed phrase, find the corpus block, pool key, marks of the variant whose text contains it.
import fs from 'node:fs';
const T=process.env.TREE; const dir=T+'/src/data/dossierStateProse/';
const phrases=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const mods={};
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.generated.js'))){ const m=await import(dir+f); mods[f]=m; }
for(const p of phrases){ let hit=[];
  for(const [f,m] of Object.entries(mods)) for(const [ek,obj] of Object.entries(m)) { if(typeof obj!=='object'||!obj) continue;
    for(const [bid,blk] of Object.entries(obj)){ const pools=blk?.pools||{}; for(const [pk,arr] of Object.entries(pools)){ if(!Array.isArray(arr)) continue;
      for(const v of arr){ if(typeof v?.text==='string'&&v.text.includes(p)) hit.push(`${f} :: ${bid} :: "${pk}" vid ${v.vid} marks=${JSON.stringify(v.marks||[])}`);} } } }
  console.log('### '+p+'\n  '+(hit.join('\n  ')||'NOT IN CORPUS'));
}
