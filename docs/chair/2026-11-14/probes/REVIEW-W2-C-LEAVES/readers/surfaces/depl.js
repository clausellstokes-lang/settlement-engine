const fs=require("fs");const R="/tmp/claude-0/rw2c/run/";const P=fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const out=[];let n=0;
for(const x of P){const rec=JSON.parse(fs.readFileSync(R+"tip/records/"+x.seed+".json","utf8"));const cond=Object.fromEntries((rec.resourceAnalysis.resourceConditions||[]).map(c=>[c.key,c.condition]));const dep=new Set((rec.config||{}).nearbyResourcesDepleted||[]);
 for(const st of ["partial","full"])for(const r of (x.L.exploit[st]||[])){const key=String(r.r).toLowerCase().replace(/ /g,"_");if(r.moved)n++;
  if(cond[key]==="depleted"||dep.has(key))out.push({seed:x.seed,res:r.r,shown:st,moved:r.moved,filed:r.filed,kinds:x.L.kinds.join("+")});}}
console.log("moved rows",n,"depleted shown worked",out.length,"of which moved",out.filter(o=>o.moved).length);console.log(JSON.stringify(out.filter(o=>o.moved)));console.log(JSON.stringify(out.filter(o=>!o.moved).slice(0,5)));
