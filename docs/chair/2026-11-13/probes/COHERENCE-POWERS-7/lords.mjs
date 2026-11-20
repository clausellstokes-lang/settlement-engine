// node lords.mjs <corpus...>: minted lords and claimants (CLAIMANT_FACE: power-minted, role Duke/Duchess) —
// office lines (government structural templates), governing-side debt rows, and rows whose role word says "the lord" on a woman
import { recs } from './rd.mjs';
const OFFICE=/^Holds an office|office|Constraint/; const R={lords:0, cat:{}, officeLines:0, officeEx:[], govRows:0, govEx:[], femaleLordRows:0, femEx:[], towns:new Set()};
const GOVRE=/governs on|council's decisions are made in|pays for the common works|treasury|civic project|levy/i;
for (const f of process.argv.slice(2)) for await (const {seed,s} of recs(f)) {
  const lords=(s.npcs||[]).filter(c=>c.institution?.kind==='power' && c.role==='the lord' || (c.institution?.kind==='power' && c.title==='the lord'));
  const ids=new Set(lords.map(c=>c.id));
  for (const c of lords) { R.lords++; R.cat[c.category]=(R.cat[c.category]||0)+1;
    const pos=String(c.structuralPosition||''); if (/\boffice\b/i.test(pos)) { R.officeLines++; R.towns.add(seed); if(R.officeEx.length<5) R.officeEx.push(`${seed} ${c.name}: ${pos}`); } }
  for (const r of s.relationships||[]) { const text=`${r.description||''} ${r.tension||''}`;
    for (const side of ['from','to']) { if(!ids.has(r[side])) continue; const c=lords.find(x=>x.id===r[side]);
      if (GOVRE.test(text) && text.includes(`${c.name}'s chamber`) || /pays for the common works/.test(text)&&text.startsWith(c.name)) { R.govRows++; R.towns.add(seed); if(R.govEx.length<5) R.govEx.push(`${seed}: ${text.slice(0,140)}`); }
      const roleWord = side==='from' ? r.npc1Role : r.npc2Role; if (c.gender==='female' && /\bthe lord\b/.test(String(roleWord||''))) { R.femaleLordRows++; if(R.femEx.length<3) R.femEx.push(`${seed}: ${r.npc1Role} · ${r.npc2Role}`);} } } }
R.towns=R.towns.size; console.log(JSON.stringify(R,null,1));
