const {rec,ctx,line,L}=require("./lib.js");
const [id,mode,...towns]=process.argv.slice(2);
const l=typeof id==="string"&&/^\d+$/.test(id)?L[+id]:line(id);
const order=["thorp","hamlet","village","town","city","metropolis"];
if(mode==="list"){ const ps=l.prints; console.log(l.id,"prints",ps.length);
  const by={}; ps.forEach(p=>{const k=p.tier+"|"+(p.stress||[]).join("+"); by[k]=(by[k]||[]).concat(p.town)});
  Object.keys(by).sort((a,b)=>order.indexOf(a.split("|")[0])-order.indexOf(b.split("|")[0])).forEach(k=>console.log(" ",k,by[k].length,by[k].slice(0,4).join(" ")));
  return;}
for(const t of towns){ const p=l.prints.find(p=>p.town===t); const r=rec(t); const d=r.defenseProfile||{};
  console.log("=====",t,r.tier,r.population,"stress:",JSON.stringify(r.config.stressTypes)+"|"+(r.stress&&r.stress.type));
  if(p) console.log(" printed:",JSON.stringify(p.page), "pdf:",JSON.stringify(p.pdf||[]).slice(0,200), "pp:", JSON.stringify(p.pp||[]).slice(0,200));
  const inst=d.institutions||{}; console.log(" defInst:",Object.entries(inst).map(([k,v])=>k+"="+(v||[]).map(x=>x.name).join("/")).join("; "));
  console.log(" readiness:",JSON.stringify(d.readiness&&{s:d.readiness.score,l:d.readiness.label}), "scores:",JSON.stringify(d.scores&&{m:d.scores.military,mo:d.scores.monster,i:d.scores.internal,ec:d.scores.economic,mg:d.scores.magical,dep:d.scores.magicDependency,tr:d.scores.traditions}));
  const needles=(p&&p.page||[]).map(x=>x.printed.slice(0,50)); const seen=new Set();
  for(const n of needles){ if(seen.has(n)) continue; seen.add(n); console.log(ctx(t,n,+process.env.B||4,+process.env.A||4)); }
  if(!p) console.log(" (does not print here)");
}
