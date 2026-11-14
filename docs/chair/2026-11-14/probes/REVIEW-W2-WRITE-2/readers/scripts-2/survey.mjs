import * as L from './lib.mjs';
const order=['thorp','hamlet','village','town','city','metropolis'];
L.LINES.forEach((l,i)=>{ const ps=l.prints||[]; const tiers={}; const cr={};
 for(const p of ps){tiers[p.tier]=(tiers[p.tier]||0)+1; const s=(p.stress||[]).join('+')||'calm'; cr[s]=(cr[s]||0)+1;}
 const views={}; for(const p of ps) for(const v of p.page||[]) views[v.view]=(views[v.view]||0)+1;
 const surf=ps.map(p=>(p.page||[]).length?'':'nopage').filter(Boolean).length;
 console.log(i, l.id.replace('DS-DEF-2::',''), ps.length, JSON.stringify(tiers), JSON.stringify(cr), JSON.stringify(views), 'nopage:'+surf);
});
