const {rec,L,crises}=require("./lib");
const ok={grain:/^(mill\b|mills|bakers?|baker\b|brewer|brewery|granary)/i,fish:/fishmonger|salter|fish market|smokehouse|salt works/i};
let tr=0,fm=[],fl=[];
for(const p of L[6].prints){const t=rec(p.town);const fx=t.resourceAnalysis.exploitation.fullyExploited;const names=t.institutions.map(i=>i.name);
 const good=fx.filter(r=>!ok[r.rawResource]||names.some(n=>ok[r.rawResource].test(n)));
 const extOnly=fx.every(r=>r.rawResource==="grain"&&!names.some(n=>ok.grain.test(n)));
 if(good.length)tr++;else if(extOnly)fm.push(p.town+"("+p.tier+","+crises(t).join("+")+") grain only via "+names.filter(n=>/mill|farm/i.test(n)).join("/"));else fl.push(p.town+"("+p.tier+") "+fx.map(r=>r.rawResource).join("/")+" insts:"+names.filter(n=>/fish|salt|cellar/i.test(n)).join("/"));}
console.log("true",tr,"MED",fm.length,"LOW",fl.length);fm.forEach(x=>console.log(" M",x));fl.forEach(x=>console.log(" L",x));
