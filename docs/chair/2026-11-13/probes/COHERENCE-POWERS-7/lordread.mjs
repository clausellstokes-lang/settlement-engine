import { recs } from './rd.mjs';
const out={finDepGovSide:0, lines:{}, sample:[]};
let k=0;
for (const f of process.argv.slice(2)) for await (const {seed,s} of recs(f)) { const lords=(s.npcs||[]).filter(c=>c.institution?.kind==='power'&&c.title==='the lord'); const ids=new Set(lords.map(c=>c.id));
  for (const r of s.relationships||[]) if (r.typeName==='Financial Dependence' && ids.has(r.from)) out.finDepGovSide++;
  for (const c of lords) { const key=`${c.structuralPosition} | ${c.activeConstraint}`; out.lines[key]=(out.lines[key]||0)+1;
    if ((k++)%5===0 && out.sample.length<30) { const rows=(s.relationships||[]).filter(r=>r.from===c.id||r.to===c.id).map(r=>`${r.typeName}: ${String(r.description).slice(0,110)}`); out.sample.push({seed, name:c.name, gender:c.gender, power:(c.memberships||[]).map(m=>m.power+'#'+m.rank).join(','), pos:c.structuralPosition, con:c.activeConstraint, goal:c.goal?.short, secret:c.secret?.what, rows:rows.slice(0,2)}); } } }
out.lines=Object.entries(out.lines).sort((a,b)=>b[1]-a[1]).slice(0,12);
console.log(JSON.stringify(out,null,1));
