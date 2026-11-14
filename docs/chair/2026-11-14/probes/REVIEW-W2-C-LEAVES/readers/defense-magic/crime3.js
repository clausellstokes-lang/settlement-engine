const fs=require("fs");const B="/tmp/claude-0/rw2c/run/";const o=require("./crime-towns.json");
const ty={};
for(const s of Object.keys(o)){const rec=JSON.parse(fs.readFileSync(B+"tip/records/"+s+".json"));const ps=rec.powerStructure;
 const cn=new Set(o[s].crimF.map(f=>f.n));
 o[s].crimRel=(ps.factionRelationships||[]).filter(r=>r.pair&&cn.has(r.pair[0])&&cn.has(r.pair[1])).map(r=>({pair:r.pair,type:r.type,n:(r.narrative||"").slice(0,160)}));
 for(const r of o[s].crimRel)ty[r.type]=(ty[r.type]||0)+1;
 delete o[s].relSample;}
fs.writeFileSync("crime-towns.json",JSON.stringify(o,null,1));console.log(ty);
console.log(Object.values(o).filter(x=>x.crimRel.length).map(x=>x.s+" "+JSON.stringify(x.crimRel)).slice(0,8).join("\n"));
