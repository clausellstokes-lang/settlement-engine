// node houselines.mjs <corpus...>: the trade's and the old families' structural lines, judged against the record by an oracle
import { recs } from './rd.mjs';
const R={smaller:[0,0],lesserOld:[0,0],headsOld:[0,0],leadingTrade:[0,0]}; const ex=[];
for (const f of process.argv.slice(2)) for await (const {seed,s} of recs(f)) { const fac=s.powerStructure?.factions||[];
  for (const c of s.npcs||[]) { const p=String(c.structuralPosition||''); if(!p) continue;
    const ms=(c.memberships||[]).filter(m=>Number.isInteger(m.rank)).sort((a,b)=>a.rank-b.rank); const first=ms[0]; const my=first&&fac.find(x=>x.faction===first.power);
    const econ=fac.filter(x=>x.category==='economy'), nob=fac.filter(x=>x.category==='noble');
    const judge=(k,ok)=>{R[k][ok?0:1]++; if(!ok&&ex.length<12) ex.push(`${k} ${seed} ${c.name} (${c.title}; ${first?first.power+'#'+first.rank:'-'}): ${p.slice(0,70)}`);};
    if (/^Runs a smaller house/.test(p)) judge('smaller', econ.some(x=>!(my&&x.faction===my.faction&&first.rank===1)));
    else if (/^Belongs to a lesser (old )?family/.test(p)) judge('lesserOld', !!my && my.category==='noble' && (first.rank!==1 || nob.some(x=>x!==my&&(x.power||0)>(my.power||0))));
    else if (/^Heads an old family/.test(p)) judge('headsOld', !!my && my.category==='noble' && first.rank===1);
    else if (/^Heads the leading house in the trade/.test(p)) judge('leadingTrade', !!my && my.category==='economy' && first.rank===1 && econ.every(x=>(x.power||0)<=(my.power||0)));
  } }
console.log(JSON.stringify(R), ex);
