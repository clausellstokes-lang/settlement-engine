const fs=require("fs");const B="/tmp/claude-0/rw2c/run/";
const L=fs.readFileSync(B+"fam-all/defense-magic.jsonl","utf8").trim().split("\n").map(JSON.parse);
for(const fam of ["Supporting Capabilities: Legal InfrastructureNone","Supporting Capabilities: Legal InfrastructurePrison only"]){
const seeds=[...new Set(L.filter(r=>r.fam===fam).map(r=>r.seed))];const tally={};const ex=[];
for(const s of seeds){const rec=JSON.parse(fs.readFileSync(B+"tip/records/"+s+".json"));const i=rec.economicState.compound?.inst||rec.economicState.safetyProfile.compound?.inst||{};
 const ros=rec.institutions.map(x=>x.name).filter(n=>/court|prison|gaol|jail|stocks/i.test(n));
 const k="court="+i.hasCourtSystem+" prison="+i.hasPrison+" ros="+ros.join("|");tally[k]=(tally[k]||0)+1;
 ex.push({s,tier:rec.tier,pop:rec.population,court:i.hasCourtSystem,prison:i.hasPrison,ros,g:rec.economicState.safetyProfile.guardEffectivenessDesc});}
console.log(fam,seeds.length,tally);fs.writeFileSync("legalflags-"+(fam.includes("None")?"none":"prison")+".json",JSON.stringify(ex,null,1));}
