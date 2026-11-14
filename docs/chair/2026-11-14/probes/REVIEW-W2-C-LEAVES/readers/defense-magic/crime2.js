const fs=require("fs");const B="/tmp/claude-0/rw2c/run/";const o=require("./crime-towns.json");
for(const s of Object.keys(o)){const rec=JSON.parse(fs.readFileSync(B+"tip/records/"+s+".json"));const ps=rec.powerStructure;
 o[s].crimF=ps.factions.filter(f=>f.category==="criminal").map(f=>({n:f.faction||f.name,p:f.power,g:!!f.isGoverning,c:f.contestsNiche||null,d:(f.desc||"").slice(0,90)}));
 o[s].govName=ps.governingName; o[s].capture=ps.criminalCaptureState?JSON.stringify(ps.criminalCaptureState).slice(0,200):null;
 o[s].crisisNote=ps.factions.filter(f=>f.crisisNote).map(f=>f.crisisNote);
 const cn=new Set(o[s].crimF.map(f=>f.n));
 o[s].crimRel=(ps.factionRelationships||[]).filter(r=>{const a=r.a||r.from||r.factionA||r.source,b=r.b||r.to||r.factionB||r.target;return cn.has(a)&&cn.has(b)}).map(r=>JSON.stringify(r).slice(0,200));
 o[s].relSample=(ps.factionRelationships||[])[0];
}
fs.writeFileSync("crime-towns.json",JSON.stringify(o,null,1));
const t={},d={};for(const x of Object.values(o)){const k=x.crimF.map(f=>f.n+(f.g?"*":"")+(f.c?"~":"")).join("+");t[k]=(t[k]||0)+1;for(const f of x.crimF)d[f.d.slice(0,60)]=(d[f.d.slice(0,60)]||0)+1}
console.log(t,d);console.log(JSON.stringify(Object.values(o)[0].relSample));
console.log(Object.values(o).filter(x=>x.crimRel.length).length);
