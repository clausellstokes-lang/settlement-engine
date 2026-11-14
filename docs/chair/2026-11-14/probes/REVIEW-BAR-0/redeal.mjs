// ROUND-3-CUT: is a town re-dealt between two trees? identity = name, population, tier, the roster's names, the cast's
// names, the powers' names (REVIEW-W2A-3 redeal.mjs's key). node redeal.mjs <r20 dir> <pairs a:b,...> <out.json>
import fs from 'node:fs';
const [R,pairs,out]=process.argv.slice(2); const res={};
const id=(r)=>({name:r.name,pop:r.population,tier:r.tier,roster:(r.institutions||[]).map(i=>i.name).sort().join('|'),cast:(r.npcs||[]).map(n=>n.name).sort().join('|'),powers:(r.powerStructure?.factions||[]).map(x=>x.faction||x.name).sort().join('|')});
for(const p of pairs.split(',')){ const [a,b]=p.split(':'); res[p]={};
  for(const f of fs.readdirSync(`${R}/${a}/records`)){ const A=JSON.parse(fs.readFileSync(`${R}/${a}/records/${f}`)), B=JSON.parse(fs.readFileSync(`${R}/${b}/records/${f}`));
    const ia=id(A), ib=id(B); const d=Object.keys(ia).filter(k=>ia[k]!==ib[k]); const strip=(r)=>{const c={...r}; delete c.publicProse; delete c.generatedAt; return JSON.stringify(c)};
    res[p][f.replace('.json','')]= d.length?'RE-DEALT:'+d.join(','):(strip(A)===strip(B)?'identical':'fields moved, identity kept'); } }
fs.writeFileSync(out,JSON.stringify(res,null,1));
for(const [p,v] of Object.entries(res)){ const c={}; for(const x of Object.values(v)){ const k=x.startsWith('RE-DEALT')?'re-dealt':x; c[k]=(c[k]||0)+1;} console.log(p.padEnd(16),JSON.stringify(c)); }
