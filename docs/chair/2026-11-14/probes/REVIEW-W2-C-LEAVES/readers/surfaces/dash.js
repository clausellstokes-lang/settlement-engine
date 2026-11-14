const fs=require("fs");const R="/tmp/claude-0/rw2c/run/";const P=fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const hits=[];let rows=0;
for(const x of P){const inst=x.facts.inst.map(n=>n.toLowerCase()).filter(n=>!n.startsWith("access to"));
 for(const r of (x.L.exploit.partial||[]).filter(r=>r.moved)){rows++;
  const have=(r.houses||[]).filter(h=>{const w=h.toLowerCase().replace(/'s?\b.*$/,"").replace(/s$/,"").split(" ")[0];return inst.some(n=>n.startsWith(w))});
  if(have.length)hits.push({seed:x.seed,res:r.r,cardHouses:r.houses,rosterHas:have,roster:x.facts.inst.filter(n=>have.some(h=>n.toLowerCase().startsWith(h.toLowerCase().split(" ")[0].replace(/'s?$/,"").replace(/s$/,"")))).join("; ")});}}
console.log(rows,hits.length);const c={};for(const h of hits){const k=h.res+" :: "+h.rosterHas.join("/");c[k]=(c[k]||0)+1}console.log(c);console.log(JSON.stringify(hits.slice(0,8),null,0));
fs.writeFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/dash-out.json",JSON.stringify(hits,null,1));
