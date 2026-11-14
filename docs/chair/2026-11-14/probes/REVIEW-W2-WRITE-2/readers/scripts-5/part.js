const {L,rec,crises}=require("./lib");
const W={stone:/stone|quarr/i,wool:/wool|cloth|textile/i,"iron ore":/iron|tool|weapon|metal/i,clay:/clay|pott|brick|ceramic/i};
const IN={stone:/quarr|mason/i,wool:/weav|dyer|full|textile/i,"iron ore":/smelt|smith|mine/i,clay:/potter|brick/i};
for(const i of process.argv.slice(2).map(Number)){const l=L[i];console.log("==",l.id);
for(const p of l.prints){const t=rec(p.town);const r=t.resourceAnalysis.exploitation.partiallyExploited.map(x=>x.rawResource).find(x=>(p.page[0]||{}).printed.includes(x))||"?";
console.log(" ",p.town,p.tier,JSON.stringify(crises(t)),r,"insts=",JSON.stringify(t.institutions.map(x=>x.name).filter(n=>IN[r]&&IN[r].test(n))),"exp=",JSON.stringify((t.economicState.primaryExports||[]).filter(x=>W[r]&&W[r].test(x))),"food=",JSON.stringify(t.economicState.foodSecurity&&(t.economicState.foodSecurity.storesMonths||t.economicState.foodSecurity.label||"")).slice(0,60));}}
