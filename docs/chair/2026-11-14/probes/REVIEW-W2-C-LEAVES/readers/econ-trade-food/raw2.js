const {leaves,lines,rec}=require("./lib");
const norm=s=>s.toLowerCase().replace(/_/g," ");
function parents(r){const near=r.config.nearbyResources;const m={};let cur=null;for(const a of r.resourceAnalysis.availableResources){if(near.includes(a)){cur=a;continue}const g=norm(a);(m[g]=m[g]||[]).push(cur)}return m}
module.exports={parents,norm};
if(require.main===module){
const W={coal:/coal|mine|pit|collier/i,stone:/quarr|mason|stone/i,iron:/mine|smith|forge|iron|smelt/i,metalwork:/smith|forge|metal/i,gems:/mine|gem|jewel|lapidar/i,timber:/wood|timber|saw|lumber|forest|carpent/i,peat:/peat|turf/i,fish:/fish|boat|harbour|dock|wharf|net/i,salt:/salt/i,
"game meat":/hunt|trap|lodge|forest/i,furs:/hunt|trap|fur/i,livestock:/graz|herd|pastur|livestock|stock|shepherd|cattle|stable|farm|dairy|horse|camel|butcher/i,wool:/graz|herd|pastur|shepherd|sheep|wool|weav|farm/i,dairy:/graz|dairy|herd|pastur|cheese|farm/i,"animal hides":/graz|herd|pastur|tann|hunt|leather|butcher|farm/i,
grain:/farm|field|grain|mill|granary|agricult|subsistence/i,flour:/mill/i,"processed textiles":/weav|textile|cloth|fuller|loom|tailor|dyer/i,clay:/clay|pott|brick|kiln/i,pottery:/pott|kiln/i,glass:/glass/i,honey:/./,"medicinal herbs":/./,dates:/./,water:/./};
const bad={},badSrc={};
for(const l of lines){if(!l.fam.startsWith("TRADE-PILLS"))continue;const L=leaves.get(l.seed);if(L.trade.local.join("")!==l.line)continue;const r=rec(l.seed);
 const cond=Object.fromEntries((r.resourceAnalysis.resourceConditions||[]).map(c=>[c.key,c.condition]));const P=parents(r);
 for(const p of L.trade.local){if(!W[p])continue;const par=(P[p]||[]);const ok=par.filter(k=>k&&cond[k]!=="depleted");
  if(!ok.length){(badSrc[p]=badSrc[p]||[]).push(l.seed+" par="+par.map(k=>k+":"+cond[k]))}
  if(!L.roster.some(n=>W[p].test(n))){(bad[p]=bad[p]||[]).push(l.seed+" ["+L.tier+"] "+L.roster.join("|"))}}}
console.log("NO SOURCE");for(const p in badSrc){console.log(p,badSrc[p].length,badSrc[p].slice(0,3))}
console.log("NO WORKER");for(const p in bad){console.log(p,bad[p].length);console.log(bad[p].slice(0,3).join("\n"))}
}
