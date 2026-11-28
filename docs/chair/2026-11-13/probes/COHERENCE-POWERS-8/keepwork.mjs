// keepwork.mjs <corpus...>: #312 — a card whose goal is "… at {house} …, and keep the work going." where {house} is a house
// that works a resource the record marks depleted (config.nearbyResourcesDepleted), and every goal line of the solvency cell.
import { recs } from './rd.mjs';
const R={towns:0,cards:0,atDepleted:0,ex:[],depletedKeys:{}};
for (const f of process.argv.slice(2)) for await (const {seed,s} of recs(f)) { R.towns++;
  const dep=(s.config?.nearbyResourcesDepleted||[]).map(String); for(const d of dep) R.depletedKeys[d]=(R.depletedKeys[d]||0)+1;
  for (const c of s.npcs||[]) for (const g of [c.goal?.short,c.goal?.long]) { if(!/keep the work going/.test(String(g||''))) continue; R.cards++;
    const inst=String(c.institution?.name||''); const words=dep.flatMap(d=>d.split('_')).filter(w=>w.length>3);
    if (dep.length && words.some(w=>inst.toLowerCase().includes(w)||String(g).toLowerCase().includes(w))) { R.atDepleted++; if(R.ex.length<6) R.ex.push(`${seed} ${c.name} (${inst}) dep=${dep.join(',')}: ${g}`); } } }
console.log(JSON.stringify(R,null,1));
