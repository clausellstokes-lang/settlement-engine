const fs=require("fs");const B="/tmp/claude-0/rw2c/run/";
const L=fs.readFileSync(B+"fam-all/defense-magic.jsonl","utf8").trim().split("\n").map(JSON.parse);
const leaves={};for(const l of fs.readFileSync(B+"leaves-tip.jsonl","utf8").trim().split("\n")){const r=JSON.parse(l);leaves[r.seed]=r}
const seeds=[...new Set(L.filter(r=>/Criminal/.test(r.sec)).map(r=>r.seed))];
const out={};
for(const s of seeds){const rec=JSON.parse(fs.readFileSync(B+"tip/records/"+s+".json"));const sp=rec.economicState.safetyProfile;
 const crimF=rec.powerStructure.factions.filter(f=>f.category==="criminal").map(f=>({n:f.name,p:f.power,g:f.isGoverning}));
 const gov=rec.powerStructure.factions.filter(f=>f.isGoverning).map(f=>f.category+":"+(f.name||""));
 const ros=rec.institutions.map(i=>i.name).filter(n=>/thie|crimin|gang|smuggl|black market|front|whisper|fence|assassin|underground|gambl/i.test(n));
 const lines=L.filter(r=>r.seed===s).map(r=>r.line);
 out[s]={s,tier:rec.tier,pop:rec.population,name:rec.name,key:leaves[s]?.crime?.key,crimF,gov,ros,ci:sp.criminalInstitutions,crimeIsGovt:sp.flags?.crimeIsGovt,crisis:leaves[s]?.crisis,route:rec.economicState.tradeAccess,lines};
}
fs.writeFileSync("crime-towns.json",JSON.stringify(out,null,1));
const t={};for(const o of Object.values(out)){const k=o.key+" crimF="+o.crimF.length+" gov="+o.crimF.some(f=>f.g)+" tg="+o.ros.some(n=>/thie/i.test(n))+" rival="+o.ci.includes("Rival Gangs")+" cIG="+o.crimeIsGovt;t[k]=(t[k]||0)+1}
console.log(seeds.length,t);
