import { recs } from './rd.mjs';
const RE=/crown|Crown/; let n=0, cs=0; const ex={};
for (const f of process.argv.slice(2)) for await (const {seed,s} of recs(f)) { const city=(s.institutions||[]).some(i=>i.name==='City-state government');
  const texts=[...(s.powerStructure?.factions||[]).map(x=>['faction:'+x.faction,x.desc]), ['recentConflict',s.powerStructure?.recentConflict], ['stability',s.powerStructure?.stability]];
  const hit=texts.filter(([k,t])=>RE.test(String(t||''))); if(!hit.length) continue; n++; if(city){ cs++; for(const [k,t] of hit){ const m=String(t).match(/[^.]*[Cc]rown[^.]*\./g)||[]; for(const x of m) ex[x.trim()]=(ex[x.trim()]||0)+1; } } }
console.log('towns with a crown line',n,'of them city-state',cs); console.log(ex);
