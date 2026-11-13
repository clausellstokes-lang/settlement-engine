import { recs } from './rd.mjs';
const W={460:['metropolis-calm-1','Three powers'],638:['city-infiltrated-1','Three powers'],881:['town-under_siege+famine-1','Three powers'],1005:['town-under_siege-1','Three powers'],291:['metropolis-under_siege-1','is narrow'],109:['metropolis-politically_fractured-1','slow war'],713:['city-wartime-1','slow war'],766:['city-calm-1','slow war']};
for (const f of process.argv.slice(2)) { const by=new Map(); for await (const {seed,s} of recs(f)) by.set(seed.replace('rw3-',''),s);
  const out=[]; for (const [n,[t,w]] of Object.entries(W)) { const s=by.get(t); const hits=(s.powerStructure.factions||[]).filter(x=>String(x.desc||'').includes(w)).map(x=>x.faction); out.push(`#${n}:${hits.length?hits.join('|'):'-'}`); } console.log(f, out.join('  ')); }
