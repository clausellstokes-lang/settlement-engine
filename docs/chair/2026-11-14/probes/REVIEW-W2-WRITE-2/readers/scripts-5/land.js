const {rec,L,crises}=require("./lib");
const RX={"luxury goods":/luxury|jewel|fine metalwork|silk/i,spices:/spice/i,"fine textiles":/fine (wool )?(cloth|textile)|quality textile|silk|luxury textile|fine wool/i,timber:/timber|lumber|wood/i,stone:/stone|quarr/i,metals:/metal|iron|copper|tin|ore/i,grain:/grain|flour|wheat|barley|rye/i,salt:/salt/i,fish:/fish/i,wool:/wool/i,"medicinal herbs":/herb/i,livestock:/livestock|cattle|sheep/i,"hardwood":/hardwood|timber/i,clay:/clay|pottery/i,"exotic goods":/exotic/i,wine:/wine|grape/i,"olive oil":/olive/i,peat:/peat/i,glass:/glass/i,furs:/fur/i};
module.exports=i=>{const l=L[i];const rows=[];
for(const p of l.prints){const t=rec(p.town);const pr=(p.page[0]||{}).printed||"";const ra=t.resourceAnalysis.imports;
 const crit=(ra.critical||[]).filter(g=>pr.includes(" "+g+",")||pr.includes(" "+g+" ")||pr.includes(" "+g+";")).sort((a,b)=>b.length-a.length);const g=crit[0];
 const re=RX[g]||new RegExp((g||"zzz").split(/[ (]/)[0],"i");
 const lp=(t.economicState.localProduction||[]).filter(x=>re.test(x)),ex=(t.economicState.primaryExports||[]).filter(x=>re.test(x)),im=(t.economicState.primaryImports||[]).filter(x=>re.test(x));
 const nr=(t.config.nearbyResources||[]).filter(x=>re.test(x.replace(/_/g," "))&&!(t.config.nearbyResourcesDepleted||[]).includes(x));
 rows.push({town:p.town,tier:p.tier,cr:crises(t),g,lp,ex,im,nr,pr,allImp:t.economicState.primaryImports,route:t.config.tradeRouteAccess});}
return rows;};
if(require.main===module){const i=+process.argv[2];const rows=module.exports(i);const gs={};rows.forEach(r=>gs[r.g]=(gs[r.g]||0)+1);console.log(JSON.stringify(gs));
for(const r of rows){if(r.lp.length||r.ex.length||r.nr.length||!r.g||process.argv[3])console.log(r.town,r.tier,r.cr.join("+"),r.g,"lp="+JSON.stringify(r.lp),"ex="+JSON.stringify(r.ex),"nr="+JSON.stringify(r.nr),"im="+JSON.stringify(r.im));}
console.log("siege:",rows.filter(r=>r.cr.includes("under_siege")).map(r=>r.town+":"+r.g).join(" "));}
