// headsub.mjs <corpus...>: a power's own FIRST (rank 1 of the power it ranks best in) whose structural line places it
// UNDER its own body's leaders (the faith's, the crew's, the casters' subordinate rows of npcStructure.js).
import { recs } from './rd.mjs';
const UNDER=/^(Serves the faith|Holds a place (?:under|in) a? ?crew|Holds a place under the crew|Works spells (?:under|that could help)|Holds a place in a crew)/;
const R={towns:0,townsHit:0,cards:0,byCat:{},byLine:{},catPair:{},topOfKind:0,lesser:0,ex:[]};
for (const f of process.argv.slice(2)) for await (const {seed,s} of recs(f)) { R.towns++; let hit=false;
  const facs=s.powerStructure?.factions||[];
  for (const c of s.npcs||[]) { const pos=String(c.structuralPosition||''); if(!UNDER.test(pos)) continue;
    const best=[...(c.memberships||[])].sort((a,b)=>(a.rank??99)-(b.rank??99))[0]; if(!best||best.rank!==1) continue;
    const f=facs.find(x=>x.faction===best.power); R.cards++; hit=true; R.byCat[c.category]=(R.byCat[c.category]||0)+1;
    const k=pos.slice(0,40); R.byLine[k]=(R.byLine[k]||0)+1; const pc=`${c.category}->${f?.category}`; R.catPair[pc]=(R.catPair[pc]||0)+1;
    const top=facs.filter(x=>x.category===f?.category).every(x=>(x.power||0)<=(f?.power||0)); top?R.topOfKind++:R.lesser++;
    if(R.ex.length<6) R.ex.push(`${seed} ${c.name} (${c.title}, first of ${best.power} ${f?.category} ${f?.power}${top?' top':' lesser'}): ${pos}`); }
  if(hit) R.townsHit++; }
console.log(JSON.stringify(R,null,1));
