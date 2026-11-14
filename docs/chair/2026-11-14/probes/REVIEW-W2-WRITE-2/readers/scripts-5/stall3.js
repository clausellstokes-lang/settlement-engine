const {rec,L,crises}=require("./lib");
const local=(u,names,lp)=>{const N=r=>names.some(n=>r.test(n)),P=r=>lp.some(v=>r.test(v));
 switch(u){case "clay":return P(/^clay$/i)||N(/clay pit/i);case "livestock":return P(/^livestock$/i)||N(/grazing|herd|shepherd|stockyard/i);
 case "food_processing":return (N(/^mills?\b|^mill$/i)&&N(/baker/i))||P(/^(flour|baked goods)$/i);case "stone":return P(/^stone$/i)||N(/quarry/i);
 case "cartography":return N(/cartograph/i);case "warehouse_logistics":return N(/warehouse/i);case "fuel":return P(/^(coal|peat|charcoal|fuel wood)$/i)||N(/charcoal|woodcutter|collier/i);
 case "hunting":return N(/hunt/i);case "precious_metals_mining":return P(/precious|gold|silver/i)||N(/\bmine/i);case "smelting":return N(/smelter/i);case "textiles":return N(/weaver/i);case "iron":return P(/^iron$/i);default:return false;}};
module.exports=i=>L[i].prints.map(p=>{const t=rec(p.town);const names=t.institutions.map(x=>x.name);const lp=t.economicState.localProduction||[];
 const rows=(t.economicState.activeChains||[]).filter(c=>c.upstreamMissing&&c.upstreamMissing.length);
 const toks=rows.flatMap(c=>c.upstreamMissing.map(u=>({c:c.label,u,loc:local(u,names,lp)})));
 const allLocal=toks.length&&toks.every(x=>x.loc);const imp=t.economicState.primaryImports||[];
 return {town:p.town,tier:p.tier,cr:crises(t),toks,allLocal,imp,route:t.config.tradeRouteAccess,
  bad: !imp.length ? "noImports" : allLocal ? "feedLocal" : null};});
if(require.main===module){for(const i of process.argv.slice(2).map(Number)){const r=module.exports(i);const f=r.filter(x=>x.bad);console.log(L[i].id,"n",r.length,"true",r.length-f.length,"false",f.length);
const k={};r.forEach(x=>x.toks.forEach(t=>{const kk=t.u+(t.loc?"(local)":"(absent)");k[kk]=(k[kk]||0)+1;}));console.log("  tokens",JSON.stringify(k));
f.forEach(x=>console.log("  F",x.bad,x.town,x.tier,x.cr.join("+"),x.route,JSON.stringify(x.toks.map(t=>t.c+"<-"+t.u))));}}
