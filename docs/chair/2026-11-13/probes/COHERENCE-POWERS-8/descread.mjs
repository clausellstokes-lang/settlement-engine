// descread.mjs <a> <b> [n]: every power description that differs a -> b, with its town's tier, the power's figure and label
import { recs } from './rd.mjs';
const [A,B,N]=process.argv.slice(2); const a=new Map(); for await (const {seed,s} of recs(A)) a.set(seed,s);
let k=0, total=0; const out=[];
for await (const {seed,s} of recs(B)) { const o=a.get(seed); const of=new Map((o.powerStructure?.factions||[]).map(f=>[f.faction,f]));
  for (const f of s.powerStructure?.factions||[]) { const g=of.get(f.faction); if(!g||g.desc===f.desc) continue; total++;
    if((total%6)===1 && out.length<Number(N||30)) out.push(`${seed} [${s.tier}] ${f.faction} ${f.power} ${f.powerLabel}${f.isGoverning?' GOV':''}\n   WAS: ${g.desc.slice(0,110)}\n   NOW: ${f.desc.slice(0,160)}`); } }
console.log('changed',total); console.log(out.join('\n'));
