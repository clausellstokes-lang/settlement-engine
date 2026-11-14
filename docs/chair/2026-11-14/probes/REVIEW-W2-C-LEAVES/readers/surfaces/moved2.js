const fs=require("fs");const R="/tmp/claude-0/rw2c/run/";const {rows}=require("/tmp/claude-0/rw2c/agents/out-surfaces/moved-out.json");
const HOUSE={"timber":/woodcut|lumber|sawmill|logging|forest|charcoal|carpent|timber/i,"mountain timber":/woodcut|lumber|sawmill|logging|forest|charcoal|carpent|timber/i,"medicinal herbs":/herb|apothec|forag|subsistence|healer|druid|grove|alchem/i,
"wool":/shepherd|grazing|wool|pasture|weav|fuller/i,"alpine pasture":/shepherd|grazing|pasture|dairy|herd/i,"animal hides":/tann|hunter|butcher|grazing|leather|livestock|slaughter/i,"glass sand":/glass|sand/i,"desert salt":/salt/i,"hot springs mineral":/bath|spring|spa/i,"camel herds":/camel|caravan/i,"iron ore":/mine|smelt|forge/i,"fish":/fish/i};
const sum={};const noEv=[];const dep=[];
for(const r of rows){const rec=JSON.parse(fs.readFileSync(R+"tip/records/"+r.seed+".json","utf8"));const inst=rec.institutions.map(i=>i.name).filter(n=>!/^access to/i.test(n));
 const re=HOUSE[r.res];const hs=re?inst.filter(n=>re.test(n)):[];
 const ev=r.k.startsWith("chainWorks")||r.exp.length||hs.length;
 const conds=(rec.resourceAnalysis.resourceConditions||[]).filter(c=>c.label&&c.label.toLowerCase().replace(/^(fine|open|ancient|old-growth|dense)\s+/,"").includes(r.res.split(" ").slice(-1)[0].replace(/s$/,"")));
 const k=ev?"evidence":"NO evidence";sum[r.res+" "+k]=(sum[r.res+" "+k]||0)+1;
 if(!ev)noEv.push({seed:r.seed,res:r.res,kinds:r.kinds,inst:inst.join("; ").slice(0,300)});
 if(/DEPLETED/.test(r.k))dep.push({seed:r.seed,res:r.res,kinds:r.kinds,houses:hs,chs:r.chs,conds:conds.map(c=>c.key+"="+c.condition),cfgDepleted:(rec.config||{}).nearbyResourcesDepleted});
}
console.log(sum);console.log("NO EVIDENCE",noEv.length,JSON.stringify(noEv.slice(0,10),null,0));console.log("DEPLETED",JSON.stringify(dep,null,0));
