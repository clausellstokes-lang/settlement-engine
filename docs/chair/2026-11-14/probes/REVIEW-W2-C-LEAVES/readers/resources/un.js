const fs=require("fs");const {leaves,rec,tab}=require("./lib.js");
const fam=JSON.parse(fs.readFileSync("prose-fam.json","utf8"));
const H={stone:/quarr|mason|stonecut|brick/i,timber:/woodcut|sawmill|carpent|lumber|logg|charcoal|forester/i,"gold/silver ore":/smelt|mine|miner|goldsmith|silversmith|jewel|mint|refin/i};
const X={stone:/stone|quarr/i,timber:/timber|lumber|plank|beam|wood(?!s)|charcoal/i,"gold/silver ore":/gold|silver|precious/i};
for(const k of Object.keys(fam).filter(k=>/^un:/.test(k))){for(const r of fam[k]){const lv=leaves[r.seed];const R=rec(r.seed);
 let res=(r.m[0]||"").replace(/^\{N\}'s /,"");if(k==="un:fetch"){const prev=fam["un:leavesUnworked"].find(x=>x.seed===r.seed);res=prev?prev.m[0]:"?"}
 const h=H[res]||/./;const x=X[res]||/./;
 console.log(k,"|",r.seed,lv.tier,lv.crisis.join(),"|",r.s);
 console.log("   houses:",lv.roster.filter(n=>h.test(n)).join(","),"| chains:",lv.chains.filter(c=>x.test([c.id,c.input,c.resource,...c.outputs].join(" "))).map(c=>c.id+":"+c.raw+"["+c.houses+"]").join(";"),"| exports:",lv.rawExports.filter(e=>x.test(e)).join(","),"| conds:",R.resourceAnalysis.resourceConditions.filter(c=>x.test(c.key+c.label)).map(c=>c.key+":"+c.condition).join(","),"| inc:",R.economicState.incomeSources.filter(i=>x.test(i.source)).map(i=>i.source+i.percentage).join(","))}}
