const {leaves,lines,rec}=require("./lib");const {byF,picks}=require("./pick.js");const {parseRow}=require("./food.js");
let flags=require("./flags.json");
// downgrades after hand review
for(const f of flags){if(f.code==="famine-failed"){
  if(f.seed==="rr3-town-famine-rand-0"){f.sev="LOW";f.fact+=" (this good comes from the date palms, which the famine did not name; doubtful)"}
  if(/^Produced locally: (flour|Flour and meal)$/.test(f.sentence)){f.sev="LOW";f.fact+=" (mills could grind bought grain; doubtful)"}}}
// divine provision with no house of worship (record cannot settle)
const re=/church|cathedral|temple|priest|shrine|monaster|abbey|chapel|friary|cleric/i;
for(const l of lines){if(!/^FOOD/.test(l.fam))continue;if(!/[Dd]ivine provision/.test(l.line))continue;const L=leaves.get(l.seed);const own=L.roster.filter(n=>!/^access to/i.test(n));
 if(!own.some(n=>re.test(n)))flags.push({fam:l.fam,seed:l.seed,sev:"LOW",kind:"a",code:"divine-no-house",sentence:l.line,fact:"no house of worship on the roster (only "+L.roster.filter(n=>/access to parish|burial/i.test(n)).join(", ")+"); the record's magicOffset under a divine tradition is the only ground; record cannot settle"})}
const SEV={HIGH:3,MED:2,LOW:1};
const NOTES={
 "TRADE-PILLS":"Checked by script on every row: row identified as Exports/Produced locally by the structured lists; every pill tested against its chain (shown state), its ground (present, not depleted), the famine's failed ground (foodRecord.failedSource), the siege's impaired cards, and the house its making needs; transit pills against an entrepot chain; Imports rows are never new under a siege (trade stopped rows print none).",
};
const fams=[];
for(const f in byF){const L=byF[f];const towns=new Set(L.map(x=>x.seed));const fl=flags.filter(x=>x.fam===f);
 const bad=new Set(fl.map(x=>x.seed));const medBad=new Set(fl.filter(x=>SEV[x.sev]>=2).map(x=>x.seed));
 const sev=fl.reduce((m,x)=>SEV[x.sev]>SEV[m]?x.sev:m,"LOW");
 const kinds=[...new Set(fl.map(x=>x.kind))].sort().join(",");
 const byCode={};for(const x of fl){byCode[x.code+"/"+x.sev]=byCode[x.code+"/"+x.sev]||new Set();byCode[x.code+"/"+x.sev].add(x.seed)}
 // examples: prefer MED, distinct seeds
 const ex=[];const seen=new Set();for(const x of fl.slice().sort((a,b)=>SEV[b.sev]-SEV[a.sev])){if(seen.has(x.seed+x.code))continue;seen.add(x.seed+x.code);ex.push({seed:x.seed,sentence:x.sentence,fact:x.fact});if(ex.length>=5)break}
 let verdict="TRUE";if(fl.length)verdict=bad.size===towns.size?"FALSE":"MIXED";
 let note=/^TRADE-PILLS/.test(f)?NOTES["TRADE-PILLS"]:/^NEEDS/.test(f)?"Each needed good tested against the town's Produced-locally/Exports pills, its grounds (present, not depleted), and houses that keep or work it (herds, dairy, fishery, woodcutter, mine, quarry, pit); list checked for repeats and non-goods.":/^FOODROW/.test(f)?"Every figure checked against economicState.foodSecurity (dailyProduction, importCoverage, magicOffset, dailyNeed) with Short = Need - Production - imported - provision; under a siege that stops trade (non-port) the row zeroes imports and the sentence agrees; siege ports keep sea imports, matching 'ships bring in'. Provision kind checked against the houses.":"Share words checked against the town's own food row: grown = Production/Need, rest = imported/(Need-Production), provision = provision/Need; bands do not overlap across all towns. Carrier checked against route and houses (ships only with docks/harbour at a port, boats only on a river with a river house, carts on road/crossroads/isolated, trade otherwise); 'No food comes in' only where the row has no import; household words against Short/Need; siege towns never say carts or boats.";
 if(fl.length)note+=" Findings: "+Object.entries(byCode).map(([k,v])=>k+" in "+v.size+" town(s)").join("; ")+".";
 if(/divine-no-house/.test(Object.keys(byCode).join()))note+=" The divine-provision item is LOW and unsettled: the record carries a divine magic offset with no house of worship here.";
 fams.push({fam:f,towns:towns.size,readByHand:picks[f],scripted:true,trueTowns:towns.size-bad.size,falseTowns:bad.size,falseTownsMEDplus:medBad.size,verdict,severity:fl.length?sev:null,kind:kinds||null,examples:ex,note});}
fams.sort((a,b)=>(b.falseTownsMEDplus-a.falseTownsMEDplus)||(b.falseTowns-a.falseTowns)||(b.towns-a.towns));
require("fs").writeFileSync("result.json",JSON.stringify({generated:"2026-11-14",source:"/tmp/claude-0/rw2c/run/fam-all/econ-trade-food.jsonl",families:fams},null,1));
for(const x of fams.filter(x=>x.verdict!=="TRUE"))console.log(x.verdict,x.severity,x.kind,x.falseTowns+"/"+x.towns,"MED+:"+x.falseTownsMEDplus,"|",x.fam.slice(0,90));
console.log("TRUE families",fams.filter(x=>x.verdict==="TRUE").length,"of",fams.length);
