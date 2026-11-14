import * as L from './lib.mjs';
L.LINES.forEach((l,i)=>{ const ps=l.prints||[]; const cr={};
 for(const p of ps){const s=L.facts(p.town).crisis.types.join('+')||'calm'; cr[s]=(cr[s]||0)+1;}
 console.log(i, l.id.replace('DS-DEF-2::',''), ps.length, JSON.stringify(cr));
});
