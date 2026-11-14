const {L,rec,page}=require("./lib");const {slots}=require("./slots");
const KW={timber:/sawmill|carpenter|lumber|timber|wood|logging|shipyard/i,stone:/quarry|mason|stone/i,wool:/weaver|fuller|textile|wool|spinner|cloth/i,"iron ore":/smelter|\bmine|miner|iron|bloomer|forge/i,clay:/potter|brick|clay|kiln|tile/i,"glass sand":/glass/i};
for(const i of process.argv.slice(2).map(Number)){const l=L[i];let tr=0,fa=[];const res={};
for(const p of l.prints){const t=rec(p.town);const pr=(p.page[0]||{}).printed||p.pdf[0];
 // resource
 const ex=t.resourceAnalysis.exploitation;const un=(ex.unexploited||[]).map(r=>r.rawResource);
 let r=un.find(x=>pr.includes(" "+x+" ")||pr.includes(" "+x+","));res[r]=(res[r]||0)+1;
 const kw=KW[r]||new RegExp(r,"i");
 const insts=t.institutions.map(x=>x.name).filter(n=>kw.test(n));
 const chains=(t.economicState.activeChains||[]).filter(c=>kw.test(c.name||"")||kw.test(c.resource||"")).map(c=>(c.name)+":"+c.status);
 const exp=(t.economicState.primaryExports||[]).concat(t.economicState.localProduction||[]).filter(x=>kw.test(x));
 const other=[...(ex.fullyExploited||[]),...(ex.partiallyExploited||[])].map(x=>x.rawResource).filter(x=>x===r);
 const bad=insts.length||chains.length||other.length;
 if(bad)fa.push(`${p.town}(${p.tier},${(p.stress||[]).join("+")}) r=${r} insts=${JSON.stringify(insts)} chains=${JSON.stringify(chains)} prod=${JSON.stringify(exp)}`);else tr++;
}
console.log("==",l.id,"true",tr,"false",fa.length,JSON.stringify(res));fa.forEach(x=>console.log("  ",x.slice(0,400)));}
