const {rec,L,crises}=require("./lib");
const syn=g=>({livestock:/livestock|cattle|sheep|grazing|herd|dairy|meat/i,grapes:/grape|vine|wine/i,"gold/silver ore":/gold|silver|precious/i,"iron ore":/\biron/i,"copper ore":/copper/i,clay:/\bclay|pottery|brick/i,grain:/grain|flour|wheat|barley|farm/i,stone:/stone|quarr/i,timber:/timber|lumber|wood|forest/i,wool:/wool|sheep/i,fish:/fish/i,salt:/salt/i,hides:/hide|leather/i,"desert_salt":/salt/i,"medicinal herbs":/herb/i})[g]||new RegExp(g.replace(/[^a-z ]/gi,"."),"i");
module.exports=(i)=>{const l=L[i];const rows=[];
for(const p of l.prints){const t=rec(p.town);const pr=(p.page[0]||{}).printed;const ra=t.resourceAnalysis.imports;
 const crit=(ra.critical||[]).filter(g=>pr.includes(" "+g+" ")||pr.includes(" "+g+","));const g=crit.sort((a,b)=>b.length-a.length)[0];
 const reason=ra.reasons[g]||"";const house=(/^Required by (.+?) but/.exec(reason)||[])[1];
 const names=t.institutions.map(x=>x.name);const re=syn(g||"?");
 const lp=(t.economicState.localProduction||[]).filter(x=>re.test(x));
 const nr=(t.config.nearbyResources||[]).filter(x=>re.test(x.replace(/_/g," ")));
 const ex=(t.economicState.primaryExports||[]).filter(x=>re.test(x));
 const im=(t.economicState.primaryImports||[]).filter(x=>re.test(x));
 const ia=(t.resourceAnalysis.availableResources||[]).filter(x=>re.test(x.replace(/_/g," ")));
 rows.push({town:p.town,tier:p.tier,cr:crises(t),g,house,houseIn:house?names.some(n=>n===house||n.startsWith(house.split(" (")[0])):null,lp,nr,ex,im,ia,pr,route:t.config.tradeRouteAccess});}
return rows;};
if(require.main===module){const i=+process.argv[2];const rows=module.exports(i);const goods={};
for(const r of rows){goods[r.g]=(goods[r.g]||0)+1;}console.log(JSON.stringify(goods));
for(const r of rows){const flag=(r.lp.length||r.nr.length||r.ex.length||r.ia.length)?"LOCAL":"";if(flag||process.argv[3])console.log(flag,r.town,r.tier,r.cr.join("+"),r.g,"house="+r.house,r.houseIn,"lp="+JSON.stringify(r.lp),"nr="+JSON.stringify(r.nr),"ia="+JSON.stringify(r.ia),"ex="+JSON.stringify(r.ex),"im="+JSON.stringify(r.im));}}
